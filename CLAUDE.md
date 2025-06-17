# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Requirements
- Requires `OPENAI_API_KEY` environment variable for AI features

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom theme system
- **AI Integration**: OpenAI GPT-4o for content generation
- **3D Graphics**: Three.js with React Three Fiber
- **UI Components**: Custom component library with theme system
- **Calendar**: React Big Calendar for scheduling
- **Animations**: GSAP for complex interactions

### Application Structure

**Studyverse** is an AI-powered tutoring platform focused on medical education (MCAT prep). It serves three main user types:

1. **Tutors** - AI-powered lesson planning, content generation, and student tracking
2. **Firms** - Administrative tools, scheduling, and business analytics  
3. **Students** - Gamified learning experiences and progress tracking

### Key Architectural Patterns

#### AI Content Generation
- API routes in `/src/pages/api/` handle OpenAI integration
- `generate-quizzes.ts` - Creates multiple-choice quizzes from topics
- `generate-session-plan.ts` - Generates tutoring session plans
- All AI requests use GPT-4o model with structured prompts

#### Theme System
- Comprehensive CSS custom property system in `globals.css`
- Theme variables for different user types and contexts
- Color-coded calendar events and UI components
- Light theme with space/medical aesthetic

#### Component Architecture
- `/src/components/tutor/` - Tutor-specific dashboard and tools
- `/src/components/calendar/` - Calendar and scheduling components
- `/src/app/` - App router pages for different user flows
- Modular component design with consistent styling patterns

#### State Management
- React hooks for local state
- Calendar events and scheduling data managed through props
- Student data and session information passed between components

### Navigation Structure
- `/` - Landing page with hero section and feature overview
- `/tutor` - Tutor dashboard and tools
- `/admin` - Administrative interfaces
- `/training` - Training content and resources
- `/content` - Content management
- `/signup` - User registration

### Data Models

#### Sessions
```typescript
{
  id: number
  studentName: string
  date: string (e.g., "Monday, May 5, 2025")
  time: string (e.g., "10:00 AM")
  duration: string (e.g., "60 minutes")
  topic: string
}
```

#### Calendar Events
- Support for tutoring sessions, student exams, content reviews, and reports
- Color-coded by student or event type
- Flexible resource metadata system

## Development Guidelines

### File Organization
- Use absolute imports with `@/` path mapping
- Components are organized by feature area (tutor, calendar, etc.)
- API routes follow Next.js convention in `pages/api/`

### Styling Conventions  
- Tailwind CSS with extensive custom theme variables
- Consistent spacing and color usage through CSS custom properties
- Responsive design with mobile-first approach
- Hover effects and animations for interactive elements

### AI Integration Patterns
- Structured prompts with clear response formatting requirements
- Error handling for OpenAI API failures
- JSON response validation and parsing
- Temperature settings optimized for educational content

### Calendar and Scheduling
- Date parsing supports multiple formats ("Day, Month DD" and "Day, Month DD, YYYY")
- Time parsing handles 12-hour format with AM/PM
- Event color coding based on student assignments or event types
- Dual view modes: tutoring sessions vs. student activities