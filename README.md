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
npx tsc --noEmit
```

## Notes

- Expo Router is the app entrypoint via `expo-router/entry`.
- Mock data lives in `data/mockData.ts`.
- AI Summary and Translate are currently UI placeholders for a future service integration.
