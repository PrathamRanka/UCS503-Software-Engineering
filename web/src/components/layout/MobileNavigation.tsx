import { Clapperboard, Home, Search, SquarePlus } from "lucide-react";
import type { UserProfile } from "../../types/social";
import { Avatar } from "../ui/Avatar";

type MobileNavigationProps = {
  onCreate: () => void;
  activeNav: string;
  user: UserProfile;
  onNavigate: (label: string) => void;
};

const buttonClass = "grid size-11 place-items-center bg-transparent";

export function MobileNavigation({
  onCreate,
  activeNav,
  user,
  onNavigate,
}: MobileNavigationProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex h-[52px] items-center justify-around border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 lg:hidden"
      aria-label="Mobile navigation"
    >
      <button
        className={`${buttonClass} ${activeNav === "Home" ? "font-bold" : ""}`}
        onClick={() => onNavigate("Home")}
        aria-label="Home"
      >
        <Home size={24} strokeWidth={activeNav === "Home" ? 2.7 : 1.9} />
      </button>
      <button
        className={buttonClass}
        onClick={() => onNavigate("Search")}
        aria-label="Search"
      >
        <Search size={24} strokeWidth={activeNav === "Search" ? 2.7 : 1.9} />
      </button>
      <button
        className={buttonClass}
        onClick={onCreate}
        aria-label="Create post"
      >
        <SquarePlus size={24} />
      </button>
      <button
        className={buttonClass}
        onClick={() => onNavigate("Reels")}
        aria-label="Reels"
      >
        <Clapperboard
          size={24}
          strokeWidth={activeNav === "Reels" ? 2.7 : 1.9}
        />
      </button>
      <button
        className={buttonClass}
        onClick={() => onNavigate("Profile")}
        aria-label="Profile"
      >
        <span
          className={
            activeNav === "Profile"
              ? "rounded-full ring-2 ring-black ring-offset-1"
              : ""
          }
        >
          <Avatar src={user.avatar} size="sm" />
        </span>
      </button>
    </nav>
  );
}
