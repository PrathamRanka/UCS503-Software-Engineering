import { readdir } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

const sourceRoot = "src";
const coveredBy = {
  "src/App.tsx": ["module-loading", "browser-smoke"],
  "src/main.tsx": ["production-build", "browser-smoke", "staging"],
  "src/styles.css": ["production-build", "staging"],
  "src/types/social.ts": ["typescript-build"],
  "src/data/mockData.ts": ["module-loading", "browser-smoke"],
  "src/utils/institutionalEmail.ts": ["unit", "integration", "browser-smoke"],
  "src/components/auth/AuthScreen.tsx": ["integration", "browser-smoke"],
  "src/components/auth/PasswordResetScreen.tsx": ["module-loading", "browser-smoke"],
  "src/components/feed/FeedHeader.tsx": ["module-loading", "browser-smoke"],
  "src/components/feed/PostCard.tsx": ["module-loading", "browser-smoke"],
  "src/components/feed/Stories.tsx": ["module-loading", "browser-smoke"],
  "src/components/layout/MobileNavigation.tsx": ["module-loading", "browser-smoke"],
  "src/components/layout/RightRail.tsx": ["module-loading", "browser-smoke"],
  "src/components/layout/Sidebar.tsx": ["module-loading", "browser-smoke"],
  "src/components/modals/CampusMapModal.tsx": ["module-loading", "browser-smoke"],
  "src/components/modals/ComposerModal.tsx": ["module-loading", "browser-smoke"],
  "src/components/modals/ContentMenuModal.tsx": ["module-loading", "browser-smoke"],
  "src/components/modals/SocialListModal.tsx": ["module-loading", "browser-smoke"],
  "src/components/modals/StoryManagerModal.tsx": ["module-loading", "browser-smoke"],
  "src/components/modals/StoryViewer.tsx": ["module-loading", "browser-smoke"],
  "src/components/ui/Avatar.tsx": ["module-loading", "browser-smoke"],
  "src/components/ui/Brand.tsx": ["module-loading", "integration"],
  "src/components/ui/LiveWeather.tsx": ["module-loading", "browser-smoke"],
  "src/components/ui/Motion.tsx": ["module-loading", "integration", "browser-smoke"],
  "src/components/ui/PageHeader.tsx": ["module-loading", "browser-smoke"],
  "src/components/ui/ScrollProgress.tsx": ["module-loading", "browser-smoke"],
  "src/components/ui/SmoothScroll.tsx": ["module-loading", "browser-smoke"],
  "src/components/ui/StatePanel.tsx": ["unit", "browser-smoke"],
  "src/components/ui/ThemeToggle.tsx": ["unit", "integration", "browser-smoke"],
  "src/components/views/ArchivedPostsView.tsx": ["module-loading", "staging"],
  "src/components/views/ExploreView.tsx": ["module-loading", "browser-smoke"],
  "src/components/views/MessagesView.tsx": ["module-loading", "browser-smoke"],
  "src/components/views/NotificationsView.tsx": ["module-loading", "browser-smoke"],
  "src/components/views/OtherProfileView.tsx": ["module-loading", "staging"],
  "src/components/views/PostDetailView.tsx": ["module-loading", "staging"],
  "src/components/views/ProfileView.tsx": ["module-loading", "staging"],
  "src/components/views/ReelsView.tsx": ["module-loading", "browser-smoke"],
  "src/components/views/SearchView.tsx": ["module-loading", "browser-smoke"],
  "src/components/views/SettingsView.tsx": ["module-loading", "staging"],
};

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    else files.push(path);
  }
  return files;
}

const productionFiles = (await collect(sourceRoot))
  .filter((file) => [".ts", ".tsx", ".css"].includes(extname(file)))
  .filter((file) => !file.includes(".test."))
  .filter((file) => !file.includes(`${sep}test${sep}`))
  .map((file) => relative(".", file).split(sep).join("/"))
  .sort();

const missing = productionFiles.filter((file) => !coveredBy[file]?.length);
const stale = Object.keys(coveredBy).filter((file) => !productionFiles.includes(file));

if (missing.length || stale.length) {
  if (missing.length) console.error(`Missing test mapping:\n${missing.join("\n")}`);
  if (stale.length) console.error(`Stale test mapping:\n${stale.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Source test matrix passed: ${productionFiles.length}/${productionFiles.length} production files mapped`);
}
