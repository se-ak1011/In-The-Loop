# In The Loop

In The Loop is a dark, operations-first Expo React Native app for couples and families who need to manage the messy reality of household admin together. The tone is practical and calm, with a Linear/Notion/GitHub-inspired interface rather than anything romantic or therapy-themed.

## Stack

- Expo + React Native + TypeScript
- Expo Router for file-based navigation
- Local mock data for MVP flows
- React Native Safe Area Context
- Expo Vector Icons + Expo Status Bar

## Features

- **Home dashboard** with active projects, waiting items, decisions, updates, due tasks, and recent documents
- **Projects tab** with status filters and progress-focused cards
- **Tasks tab** grouped by open/done states with ownership and priority cues
- **Shopping tab** with multiple lists and tappable bought/unbought state
- **Docs tab** with category filtering and project context
- **More tab** for household decisions, activity log, and AI feature placeholders
- **Project detail screen** with progress, summary, tasks, decisions, documents, and update timeline

## Design system

Palette is defined in `constants/theme.ts`:

- Background: `#151718`
- Surface: `#1D2022`
- Elevated: `#24282B`
- Primary text: `#F4F1EA`
- Secondary text: `#A7AAA7`
- Accent: `#6C7565`
- Warning: `#B89B5E`
- Danger: `#A65F5F`
- Success: `#7E9278`
- Border: `#2A2F32`

## Project structure

```text
app/
  (tabs)/
    _layout.tsx
    index.tsx
    projects.tsx
    tasks.tsx
    shopping.tsx
    docs.tsx
    more.tsx
  _layout.tsx
  project/[id].tsx
components/
constants/
data/
types/
```

## Local development

```bash
npm install
npm start
```

Useful commands:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
```

## Notes

- Expo Router is the app entrypoint via `expo-router/entry`.
- Mock data lives in `data/mockData.ts`.
- Mock data is wrapped by `services/mockRepository.ts` so it can be swapped for Supabase later without rewriting every screen.
- Project summaries now use `services/ai.ts`: without an AI endpoint, the app shows a deterministic local summary; with `EXPO_PUBLIC_AI_SUMMARY_ENDPOINT`, it calls your own server-side summary endpoint.
- Supabase environment variables are detected via `config.ts`; add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` when you are ready to wire live data. Keep `OPENAI_API_KEY` server-side only; never add it with an `EXPO_PUBLIC_` prefix.
