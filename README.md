# OpenBJJ - Jiu-Jitsu University Digital Dojo

A modular React PWA built with Apple-style design principles.

## Current Version (v0.1.0)
This version allows users to browse the **Jiu-Jitsu University** book content (Steps and Misconceptions) organized due to belt levels.

**Pending Features:**
- Video integration.
- Video Recording Module.
- AI Analysis Module.

## Prerequisites

- Node.js (v16+)
- npm or yarn

## Installation

1.  Clone the repository or unzip the project.
2.  Install dependencies:

```bash
npm install react react-dom react-router-dom framer-motion lucide-react dexie tailwind-merge clsx
npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react vite
```

3.  Run the development server:

```bash
npm run dev
```

## Structure

The project uses a Feature-Based Architecture:

- `src/modules/core`: Agnostic UI components and Layouts.
- `src/modules/learn`: Logic for curriculum and belt progression.
- `src/modules/onboarding`: Welcome flow and profile creation.
- `src/modules/shared`: Global utilities (Database).

## Design System

- **Colors:** Zinc (Tailwind)
- **Theme:** Dark Mode Only
- **Typography:** System Sans-Serif
