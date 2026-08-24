# Frontend Components

The frontend is organized by what each component does.

```text
web/src/
  components/
    feed/
      FeedHeader.tsx
      PostCard.tsx
      Stories.tsx
    layout/
      MobileNavigation.tsx
      RightRail.tsx
      Sidebar.tsx
    modals/
      ComposerModal.tsx
      StoryViewer.tsx
    ui/
      Avatar.tsx
      Brand.tsx
  data/
    mockData.ts
  types/
    social.ts
  App.tsx
  main.tsx
  styles.css            Tailwind import only
```

## Responsibilities

- `App.tsx`: owns page-level state and composes the screen.
- `components/feed`: content shown in the central feed.
- `components/layout`: desktop and mobile page structure.
- `components/modals`: temporary overlays and focused actions.
- `components/ui`: small reusable visual elements.
- `data/mockData.ts`: temporary demo content. Replace this module with API calls later.
- `types/social.ts`: shared frontend data shapes.
- Component styling stays in Tailwind utility classes beside the markup.
- `styles.css` must remain limited to the Tailwind import unless a genuine global browser rule is required.

## Adding a feature

1. Add or update its data type.
2. Create a focused component in the closest feature folder.
3. Keep API calls outside small visual components.
4. Pass data and event handlers through typed props.
5. Add page-level state to `App.tsx` only when multiple components need it.

Avoid generic component abstractions until the same pattern is used at least twice.
