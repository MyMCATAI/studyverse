# Agentic AI Demo Plan

## Overall Demo Vision (Multi-Perspective)

The long-term goal is to showcase Kalypso's capabilities across three key user perspectives: the Student, the Tutor, and the Admin. This particular plan and current development phase focuses on the **Tutor Perspective**. The Student view is handled in a separate project, and the Admin perspective will be addressed last.

## Current State (Tutor Perspective)

*   Application features a tutor dashboard displaying student information (e.g., MCAT scores, content mastery).
*   Kalypso (AI mascot) is implemented as a draggable GIF with a chat interface (speech bubbles) appearing above the icon. It supports streaming text and audio responses and is aware of the tutor's name ("Evan") and the current date/time (EST).
*   A basic frontend context system provides Kalypso with information about whether Evan is viewing the main dashboard or a specific student profile.

## Revised Demo Goals (Tutor Perspective Focus)

*   **Elevate Kalypso to a central, fun, and engaging AI partner** that actively assists Evan with their tutoring tasks.
*   **Deeply integrate Kalypso with the Tutor Dashboard UI:** Kalypso should react to Evan's interactions with specific data elements on the page, providing contextual insights and actionable advice, making AI feel like a core part of the workflow.
*   **Showcase "Wow Factors" for the Tutor:**
    *   **Effortless Progress Summaries:** Kalypso can summarize a student's progress and key changes since their last meeting with Evan.
    *   **Insight into Student Activity (Mocked):** Kalypso can present simulated "messages from students," a recap of content they've recently reviewed, or questions they've had, giving Evan a richer understanding of student engagement outside of sessions.
    *   **Click-Driven Contextual Insights:** Specific data points on the dashboard (e.g., tutoring sessions remaining, MCAT score, consistency metrics) become interactive. Clicking them prompts Kalypso to provide a relevant summary or recommendation.
*   The demo will use **hardcoded or easily mockable responses triggered by specific UI interactions** to simulate Kalypso's deep contextual understanding and maintain focus on the UI/UX and agentic feel.

## Enhancing Kalypso's Interaction - Tutor Perspective Detailed Scenarios

This section details how Kalypso will interact with Evan based on the new demo notes, focusing on making dashboard elements "clickable" to trigger contextual AI responses.

1.  **Kalypso's Core Interaction Model:**
    *   Kalypso's GIF remains draggable.
    *   When a specifically designated UI element on the dashboard is clicked (e.g., "Tutoring Sessions Left" widget), Kalypso's chat interface (speech bubbles above the GIF) will activate/appear.
    *   Kalypso will deliver a pre-scripted, context-specific message related to the clicked element.
    *   This interaction should feel like Kalypso is directly commenting on or summarizing the information Evan just clicked on.

2.  **Clickable Dashboard Elements & Kalypso's Responses (Examples based on notes):**
    *   **Element: "Amount of Tutoring Sessions Left" (e.g., for student Emma Thompson)**
        *   **Evan Clicks:** The widget showing "5 sessions left."
        *   **Kalypso Appears & Says (Mocked):** "Hi Evan, I see Emma only has 5 tutoring sessions left. She hasn't improved significantly in CARS recently. When you next speak with her, perhaps suggest she consider purchasing additional tutoring focused on that area?"
    *   **Element: "Latest MCAT Score" (e.g., shows 508, with a 5pt increase)**
        *   **Evan Clicks:** The score display.
        *   **Kalypso Appears & Says (Mocked):** "That's a nice 5-point jump for Emma on her latest MCAT, Evan! This brings her to 508. It looks like the recent focus on [Specific Topic] paid off. Keep encouraging her!"
    *   **Element: "Total Number of Coins Earned" (Gamification metric)**
        *   **Evan Clicks:** The coin display.
        *   **Kalypso Appears & Says (Mocked):** "Evan, Emma has earned a total of [X] coins! This shows good engagement with her study materials. You could mention this to acknowledge her efforts."
    *   **Element: "Consistency Score" (e.g., 76%)**
        *   **Evan Clicks:** The consistency score.
        *   **Kalypso Appears & Says (Mocked):** "Evan, Emma's consistency is at 76%. While that's pretty good, reminding her about the importance of regular CARS practice, as noted in her improvement areas, could be beneficial."
    *   **Element: "Burnout Score/Indicator"**
        *   **Evan Clicks:** The burnout indicator.
        *   **Kalypso Appears & Says (Mocked):** "Hmm, it looks like Emma's burnout risk is [Low/Medium/High]. If it's medium or high, it might be a good idea to check in on her study-life balance during your next session, Evan."

3.  **AI Flourishes - Integrating Simulated Student Insights (Mocked for Demo):**
    *   These could be triggered by a general "What's new with Emma?" query to Kalypso when viewing Emma's profile, or specific buttons/icons.
    *   **"Message from Student (Simulated)":**
        *   **Kalypso Presents:** "Evan, I have a quick update from Emma. She sent a message saying: 'I finally understood the kidney's countercurrent mechanism after our last session! Still a bit shaky on diuretics though.' This might be a good point to review next time."
    *   **"Recent Recap of Content Reviewed (Simulated)":**
        *   **Kalypso Presents:** "Looking at Emma's activity this week, Evan, she spent significant time on cardiology topics, particularly ECG interpretation and heart failure pathophysiology. She also completed practice questions on endocrine pharmacology."
    *   **"Recent Recap of Questions Asked (Simulated)":**
        *   **Kalypso Presents:** "Evan, some questions Emma flagged this week include: 'What are the key differences between Type 1 and Type 2 MI?' and 'How do loop diuretics affect potassium levels?' These could be good discussion starters."

4.  **UI/UX Enhancements for Agentic Feel:**
    *   The frontend needs to be spruced up to feel modern and engaging.
    *   Kalypso's interactions (appearing, delivering messages) should feel smooth and integrated, not like a separate, disjointed chat window for these specific contextual prompts.
    *   The current draggable chat bubble system is a good base, but for these direct data point interactions, the connection between the clicked element and Kalypso's response should be visually clear.

## Next Development Steps (Tutor Perspective):

1.  **Refine Frontend Context System:**
    *   **Identify specific, clickable UI elements** on the `Dashboard.tsx` and `StudentActions.tsx` (or similar student detail view) that will trigger Kalypso.
    *   Implement logic so that clicking these elements updates a more granular `kalypsoTriggerContext` (e.g., "clicked_sessions_left_for_emma", "clicked_mcat_score_for_emma").
    *   `KalypsoChat.tsx` will use this trigger context (along with the broader page context) to select the appropriate hardcoded message for Kalypso to deliver.
2.  **Implement Click-to-Summarize UI:**
    *   Modify `KalypsoChat.tsx` so that when a trigger context is received due to a click:
        *   `isOpen` is set to true (if not already).
        *   The pre-scripted message for that trigger is displayed immediately (not requiring Evan to type anything).
        *   The standard chat input might be less relevant for these instant summaries, or could be used for follow-up questions.
3.  **Content - Mocked Responses:**
    *   Write the specific (hardcoded) text and an audio script (if generating audio for these) for each of the defined clickable interactions and AI flourishes.
4.  **Define and Integrate Richer Student Context for AI (Technical Notes):**
    *   **Goal:** Provide Kalypso with more comprehensive background information about the student Evan is currently focused on, to enable more informed and context-aware responses beyond the immediate page/click context.
    *   **Student Data Model (Mocked/Hardcoded for Demo):**
        *   For each demo student (e.g., "Emma Thompson"), we will define a data structure.
        *   **Basic Info:**
            *   `studentName`: String (e.g., "Emma Thompson")
            *   `studentBio`: String (e.g., "A dedicated pre-med student, currently balancing MCAT prep with volunteer work at a local clinic. Strong in sciences but looking to improve CARS consistency.")
            *   `studentEmail`: String (e.g., "emma.thompson@example.com")
        *   **MCAT Scores:**
            *   `mcatScores`: Array of objects, similar to `testHistory` in `OverviewView.tsx`. Each object should include:
                *   `testName`: String (e.g., "AAMC FL 1", "CP Section Bank")
                *   `date`: String (e.g., "2023-10-02")
                *   `score`: Number or String (e.g., 508, "72%")
                *   `breakdown`: String (e.g., "126/125/127/130", "72%")
        *   **Recent Calendar/Activity Log (Simplified for Demo):**
            *   `calendarActivities`: Array of strings, representing key activities or study topics for the current/upcoming week.
                *   Example for "Emma Thompson":
                    *   "Reviewing Kidney Physiology - Countercurrent Mechanism"
                    *   "Practice Set: Diuretics and Renal Function"
                    *   "Scheduled: CARS Passage Practice - Mon, Wed, Fri"
                    *   "Meeting with Evan: Focus on CARS strategy - Thursday"
                    *   "Volunteering at Clinic - Tuesday afternoon"
    *   **Data Flow & AI Integration:**
        *   When Evan selects a student or is viewing a student-specific page, the frontend will retrieve (or use hardcoded) this comprehensive student data object.
        *   This data object will be stringified and passed to the `/api/chat` endpoint as part of the `pageSpecificContext` or a new dedicated field (e.g., `studentDataPayload`).
        *   The backend API route (`/api/chat/route.ts`) will prepend this detailed student information to the system prompt or the user's message, ensuring the AI has this broader context when generating responses.
            *   Example snippet for `getPageContextSystemPrompt` or similar logic:
                \`\`\`
                Current Student: ${studentData.studentName}
                Bio: ${studentData.studentBio}
                Recent MCAT Scores:
                ${studentData.mcatScores.map(s => `- ${s.testName}: ${s.score} (on ${s.date})`).join('\\n')}
                This Week's Focus for ${studentData.studentName}:
                ${studentData.calendarActivities.map(act => `- ${act}`).join('\\n')}

                Current Date/Time (EST): ${currentDateStr}
                Tutor: You are assisting ${tutorName}.
                Page Context: ${pageSpecificContextFromFrontend}
                ---
                Remember to use ${tutorName}'s name.
                \`\`\`
        *   This allows Kalypso to answer questions like "What is Emma working on this week?" or "Summarize Emma's recent MCAT progress" with more specific, (mocked) data-driven replies.
        *   For the click-triggered summaries, this richer context will also be available, potentially allowing for even more nuanced hardcoded responses.

## Future Considerations (Post-Demo - Tutor Perspective)

*   Transition from hardcoded responses to dynamic AI generation based on real data and more sophisticated context understanding.
*   Allow Kalypso to perform actions based on suggestions (e.g., "Would you like to add a session on CARS for Emma?" -> Yes -> Kalypso opens a pre-filled session planner).

## Initial Steps (Refined)

1.  **Kalypso Visuals & Audio:** (Completed)
    *   Dedicated folder `src/components/kalypso/` contains `KalypsoChat.tsx` and `kalypsoend.gif`.
2.  **Backend API for Chat:** (Completed)
    *   `src/app/api/chat/route.ts` provides streaming text and audio responses.
3.  **Frontend - Designing "AI Interaction Mode":**
    *   **Task 1 (Current Focus):** Brainstorm and prototype UI mockups for how Kalypso interacts directly with the student dashboard content (e.g., how highlights appear, where Kalypso's text is displayed relative to page elements).
    *   **Task 2:** Implement a new frontend component or modify `KalypsoChat.tsx` to support this "center stage" interaction. This will involve:
        *   Triggering the mode (e.g., on Kalypso GIF click).
        *   Displaying Kalypso more prominently.
        *   Showing hardcoded/mocked contextual messages and UI highlights based on predefined scenarios (e.g., looking at "Emma Thompson's" MCAT scores).
        *   Handling user input to cycle through a few predefined interaction flows.

## Future Considerations (Post-Demo)

*   Integrate with a real AI model capable of more dynamic contextual understanding and response generation.
*   Develop a robust system for the AI to truly "see" and interpret the UI elements and data on the page.
*   Expand Kalypso's capabilities to perform actions on behalf of the tutor (e.g., actually drafting a session plan, assigning resources). 