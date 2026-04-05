# BLOC — UI/UX Design System

## Abstract
The design of BLOC is centered on **"Ink & Amber"** — a high-contrast, minimalist aesthetic inspired by traditional archival paper and modern developer tools. It prioritizes focus, clarity, and rapid interaction.

## Design Tokens (from index.css)
- **Ink**: `#0c0c0b` (Primary Background)
- **Chalk**: `#f0ece4` (Primary Text)
- **Mist**: `#d6d1c7` (Secondary Text / Muted)
- **Amber**: `#e8a020` (Action / Highlight)
- **Surface**: `#161613` (Card / Section Background)
- **Border**: `#2a2925` (Subtle separations)

## Typography
- **Primary**: `Sora` (Sans-serif, geometric)
- **Secondary**: `Inter` (UI elements, high legibility)
- **Mono**: `JetBrains Mono` (Code, data points)

---

## Layout Components

### 1. App Shell (AppLayout)
A permanent skeleton wrapping all authenticated modules.
- **Sidebar (Left)**: Collapsible (260px expanded / 80px collapsed). Contains branding, module navigation, user profile, and notifications toggle.
- **Main Content (Right)**: Flexible area with responsive padding (`p-4` to `p-10`). Uses a vertical scrolling model with a max-width container (`max-w-7xl`).

### 2. TopBar
Horizontal header fixed at the top of the Main Content area.
- **Breadcrumbs**: e.g., `Focus → Active Session`
- **Global Actions**: Search, feedback, help.
- **Contextual Info**: e.g., Current task name or project.

---

## Wireframes (Descriptive)

### Sign In / Sign Up
- **Layout**: Split-screen or centered card.
- **Aesthetic**: Deep Ink background with a glassmorphism card (`--surface`).
- **Focus**: Minimal inputs, amber primary button. Clear error states in `--red-400`.

### Focus Module (Home)
- **Grid Layout**: Dashboard-style cards.
- **Primary Card**: "What are you working on?" large input field.
- **Secondary Cards**: Project selector, recent logs, daily goal progress.

### Active Session (Focus Mode)
- **Layout**: Zen Mode (Minimalist).
- **Centerpiece**: Large digital timer (JetBrains Mono).
- **Controls**: Pause, Resume, End (prominent).
- **Backdrop**: Subtle amber glow animation (`--hero-glow`).

---

## Interaction Design
- **Micro-animations**: Subtle `framer-motion` spring transitions on hover and mount.
- **Loading States**: Skeleton loaders (`--surface` background with pulse).
- **Feedback**: Amber toasts for successes, red for errors.
