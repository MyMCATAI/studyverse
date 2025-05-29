# Agentic AI Demo Plan

## Current State

*   The application currently has a feature to check an access code.
*   We want to introduce an AI assistant, Kalypso, to provide context-aware assistance.

## Demo Goals

*   Visually represent Kalypso on the frontend.
*   Kalypso will provide information based on hardcoded, context-specific dummy data.
*   This initial demo focuses on the user interface and interaction, not on a fully functional AI backend.

## Initial Steps

1.  **Kalypso Visuals & Audio:**
    *   Create a dedicated folder `src/app/kalypso-assets/` for Kalypso's visual (e.g., images, sprites) and audio (e.g., voice clips) assets.
2.  **Frontend Integration (Dummy Data):**
    *   Develop a UI component to display Kalypso.
    *   Implement logic to show different messages from Kalypso based on the user's current location/context within the app (using hardcoded data for now).
    *   Example contexts:
        *   Homepage: Kalypso offers a general welcome.
        *   Specific feature page: Kalypso provides tips or information related to that feature.
3.  **Future Considerations (Post-Demo):**
    *   Integrate with a real AI model.
    *   Develop a system for dynamic context gathering.
    *   Expand Kalypso's capabilities (e.g., responding to user queries). 