import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import { getTutorBaseSystemPrompt, getPageContextSystemPrompt } from "../../../../lib/prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Helper function to create audio stream
async function createAudioStreamFromText(text: string): Promise<Buffer> {
  if (!text.trim()) {
    // ElevenLabs will error on empty or whitespace-only strings
    throw new Error("Text to convert to audio cannot be empty.");
  }
  const audioStream = await elevenlabs.generate({
    voice: "Kalypso",
    model_id: "eleven_multilingual_v2",
    text,
  });

  const chunks: Uint8Array[] = [];
  for await (const chunk of audioStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, context: pageSpecificContext, threadId: clientThreadId, generateAudio, assistantId: clientAssistantId, tutorName = "Evan" } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API Key not configured." }, { status: 503 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const currentAssistantId = clientAssistantId || process.env.OPENAI_ASSISTANT_ID;
    if (!currentAssistantId) {
      console.error('OPENAI_ASSISTANT_ID is not set in environment variables.');
      return NextResponse.json({ success: false, error: 'Server configuration error: Assistant ID missing.' }, { status: 500 });
    }
    
    const fullUserMessage = pageSpecificContext ? `Context: ${pageSpecificContext}\n\nUser Message: ${message}` : message;

    let currentThreadId = clientThreadId;

    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    const baseSystemInstructions = getTutorBaseSystemPrompt(tutorName);
    let finalSystemInstructions = baseSystemInstructions;

    if (pageSpecificContext && typeof pageSpecificContext === 'string' && pageSpecificContext.trim() !== '') {
      finalSystemInstructions = getPageContextSystemPrompt(baseSystemInstructions, pageSpecificContext);
    }

    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: fullUserMessage,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: any) => {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        };

        sendEvent({ type: "thread_id", value: currentThreadId });

        let accumulatedText = "";
        let run;

        try {
          run = openai.beta.threads.runs.stream(currentThreadId, {
            assistant_id: currentAssistantId,
            instructions: finalSystemInstructions
          });

          for await (const event of run) {
            if (event.event === 'thread.message.delta') {
              const delta = event.data.delta.content?.[0];
              if (delta && delta.type === 'text' && delta.text?.value) {
                sendEvent({ type: "text_delta", value: delta.text.value });
                accumulatedText += delta.text.value;
              }
            } else if (event.event === 'thread.run.requires_action') {
              // Handle tool calls if your assistant uses them
              // For simplicity, we're not handling them in this version.
              // You would need to submit tool outputs here.
              console.log("Run requires action:", event.data);
            } else if (event.event === 'thread.run.failed') {
              console.error("Run failed:", event.data);
              sendEvent({ type: "error", message: `Run failed: ${event.data.last_error?.message || 'Unknown error'}` });
              controller.close();
              return;
            }
          }
        } catch (e: any) {
          console.error("Error during OpenAI stream:", e);
          sendEvent({ type: "error", message: `Stream error: ${e.message}` });
          controller.close();
          return;
        }
        
        // Stream finished, now handle audio if requested
        if (generateAudio) {
          if (!process.env.ELEVENLABS_API_KEY) {
            sendEvent({ type: "audio_status", status: "error", message: "ElevenLabs API Key not configured." });
          } else if (!accumulatedText.trim()) {
             sendEvent({ type: "audio_status", status: "error", message: "Cannot generate audio for empty AI response." });
          } else {
            try {
              const audioBuffer = await createAudioStreamFromText(accumulatedText);
              const audioBase64 = audioBuffer.toString('base64');
              sendEvent({ type: "audio_data", value: audioBase64 });
            } catch (audioError: any) {
              console.error("[ELEVENLABS_ERROR]", audioError);
              sendEvent({ type: "audio_status", status: "error", message: `Audio generation failed: ${audioError.message}` });
            }
          }
        }

        sendEvent({ type: "stream_end", threadId: currentThreadId });
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("[CONVERSATION_ERROR]", error);
    // This will handle errors outside the stream itself, e.g., initial request parsing
    // The stream has its own error reporting via SSE.
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
} 