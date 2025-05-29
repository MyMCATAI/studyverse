# Agentic AI Demo Plan

## Current State

*   Application features a tutor dashboard displaying student information (e.g., MCAT scores, content mastery).
*   A basic version of Kalypso (AI mascot) is implemented with a chat interface, capable of text and audio responses, and uses a streaming API.
*   Kalypso's visual asset (`kalypsoend.gif`) is available.

## Revised Demo Goals

*   **Elevate Kalypso to a central, interactive AI assistant**, moving beyond a simple chat pop-up.
*   Demonstrate Kalypso's ability to **understand and interact with the on-screen context** (e.g., the student dashboard).
*   Showcase a more natural and intuitive way for tutors to **collaborate with Kalypso** on tasks like data interpretation, session planning, and identifying student needs.
*   The initial demo will still primarily use **hardcoded or easily mockable contextual responses** to focus on the UI/UX of this agentic interaction.

## Enhancing Kalypso's Interaction - Planning Phase

This section outlines ideas for making Kalypso more agentic and central to the user experience, particularly on a data-rich page like the student dashboard.

1.  **Kalypso's Presence & Activation:**
    *   **Current:** Kalypso is a clickable GIF in the bottom-right corner, opening a separate chat window.
    *   **Proposed Vision:** Kalypso remains visually present (perhaps slightly smaller or less obtrusive initially in a corner) but activation leads to a more integrated experience.
    *   **Activation Idea:** Clicking Kalypso could transition the UI into an "AI Interaction Mode."

2.  **"AI Interaction Mode" - Taking Center Stage:**
    *   **Concept:** Instead of a small chat box, Kalypso takes a more prominent role, potentially overlaying or reflowing parts of the UI to create a dedicated interaction space.
    *   **Visuals:** Kalypso's avatar could become larger, and associated UI elements (like speech bubbles or information cards) would appear in a more central area of the screen.
    *   **Contextual Awareness (Demo):**
        *   When activated on the student dashboard (e.g., "Emma Thompson's" page):
            *   Kalypso could greet the tutor and say something like, "I see we're looking at Emma Thompson's progress. What would you like to focus on?"
            *   **Interactive Highlighting:** Kalypso could visually highlight sections of the dashboard (e.g., "Latest MCAT Score" or "AAMC Content Mastery") as it discusses them or as the tutor asks about them. (For the demo, these highlights and corresponding text would be pre-scripted).
            *   **Summarization (Demo):** Tutor asks, "Kalypso, summarize Emma's recent performance." Kalypso provides a concise summary (hardcoded) and perhaps visually draws attention to the relevant data points on the screen.
            *   **Action Suggestions (Demo):** Based on the (mocked) understanding of Emma's data (e.g., low CARS score), Kalypso could suggest, "Emma seems to be struggling with CARS. Would you like to design a session focusing on CARS practice or find relevant resources?" Clicking these suggestions would (for the demo) lead to a placeholder action or a simple confirmation message.

3.  **Interaction Flow & UI Elements:**
    *   **Input:** The tutor could still use text input, but voice input (even if just placeholder for demo) should be considered for a more natural feel.
    *   **Output - Kalypso's Communication Style:**
        *   Her avatar's animation/expression.
        *   **Chat Interface:** Instead of a fixed chatbox, the conversation will appear as a series of **cartoon-style speech bubbles** anchored near Kalypso's avatar. The background of this "chat area" should be transparent or semi-transparent to maintain visibility of the underlying page content.
        *   Visual cues on the existing dashboard (highlights, arrows, temporary overlays when Kalypso is discussing specific data).
    *   **Movability:** Kalypso's avatar (the GIF) should be **draggable**, allowing the tutor to reposition her and the anchored speech bubbles on the screen.
    *   **Exiting Interaction Mode:** A clear way to return to the standard dashboard view or minimize Kalypso's active interaction.

4.  **Technical Considerations for Demo (Frontend-Focus):**
    *   This is primarily a **UI/UX design and frontend implementation challenge** for the demo.
    *   Focus on creating a smooth and believable *illusion* of agentic behavior with pre-defined conversational paths and contextual triggers.
    *   The backend chat API (`/api/chat`) can still be used for message processing, but the frontend will do more heavy lifting in terms of interpreting a limited set of commands/responses to trigger UI changes.

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