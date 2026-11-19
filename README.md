# Habit Tracker — InnCode Lab · Project 02

A habit tracker built to show **Zustand** next to the hooks: one typed store with selectors and `persist` for the data, a small Context for UI settings, and custom hooks for the date logic.

**Live demo:** _add your Vercel URL here_

## Features

- Full CRUD for habits: create, edit (name, colour, weekly goal, notes), delete with confirmation, archive / restore
- Weekly view: tick habits day by day
- Current streak, record streak and 30-day completion rate
- Three-month heatmap for every habit, built with plain Tailwind
- Week navigation (previous, next, today) and a configurable first day of the week
- Active / archived filter
- Light / dark theme
- Data persisted in `localStorage` through Zustand's `persist` middleware, with demo habits on first launch

## Concept → file

| Concept | File |
| --- | --- |
| Typed Zustand store with actions | `src/store/habitStore.ts` |
| `persist` middleware, `partialize`, `merge` validation | `src/store/habitStore.ts` |
| Selectors (subscribe to one slice) | `src/components/HabitCard.tsx`, `src/App.tsx` |
| `useContext` for UI settings | `src/state/uiSettingsContext.ts`, `src/state/UiSettingsProvider.tsx`, `src/hooks/useUiSettings.ts` |
| `useMemo` for streaks and stats | `src/components/HabitCard.tsx`, `src/components/Heatmap.tsx` |
| `useEffect` + `useRef` for the midnight rollover | `src/hooks/useToday.ts` |
| Custom hook for week logic | `src/hooks/useWeek.ts` |
| `useId` for form fields | `src/components/TextField.tsx`, `src/components/ColorPicker.tsx` |
| Streak algorithm | `src/lib/streaks.ts` |
| Date maths without libraries | `src/lib/dates.ts` |
| Heatmap with CSS grid | `src/components/Heatmap.tsx` |
| `key` to reset a form | `src/App.tsx`, `src/components/HabitForm.tsx` |
| Tailwind v4 design tokens | `src/index.css` |

## Stack

React 19 · Vite · TypeScript (strict) · Tailwind CSS v4 · Zustand · self-hosted fonts via Fontsource (Outfit, Figtree, DM Mono)

## Commands

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build for production into dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
├── components/   UI: Header, HabitForm, Toolbar, HabitList, HabitCard, DayToggle, Heatmap, ...
├── hooks/        useToday, useWeek, useUiSettings, useLocalStorage
├── state/        UI settings context + provider
├── store/        the Zustand store
├── lib/          dates, streaks, stats, colours, validation, demo data, storage helpers
├── types.ts      shared types
├── index.css     Tailwind import + design tokens
├── App.tsx
└── main.tsx
```
