import { useEffect, useState } from "react";
import { MapPin, Minus, Plus, RotateCcw, X } from "lucide-react";
import { MotionBackdrop, MotionReveal } from "../ui/Motion";

export function CampusMapModal({ onClose }: { onClose: () => void }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=")
        setZoom((value) => Math.min(2.5, value + 0.25));
      if (event.key === "-")
        setZoom((value) => Math.max(1, value - 0.25));
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <MotionBackdrop
      className="fixed inset-0 z-[80] flex flex-col bg-black/90 p-3 text-white backdrop-blur-md sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campus-map-title"
      onMouseDown={onClose}
    >
      <MotionReveal className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 pb-3" distance={-6} scale={1}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-[#ed111c]">
            <MapPin size={19} />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-white/45">
              TIET campus
            </p>
            <h2 id="campus-map-title" className="truncate text-lg font-semibold">
              Find your way around
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 disabled:opacity-35"
            onClick={(event) => {
              event.stopPropagation();
              setZoom((value) => Math.max(1, value - 0.25));
            }}
            disabled={zoom === 1}
            aria-label="Zoom out"
          >
            <Minus size={17} />
          </button>
          <button
            className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10"
            onClick={(event) => {
              event.stopPropagation();
              setZoom(1);
            }}
            aria-label="Reset zoom"
          >
            <RotateCcw size={16} />
          </button>
          <button
            className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 disabled:opacity-35"
            onClick={(event) => {
              event.stopPropagation();
              setZoom((value) => Math.min(2.5, value + 0.25));
            }}
            disabled={zoom === 2.5}
            aria-label="Zoom in"
          >
            <Plus size={17} />
          </button>
          <button
            className="ml-1 grid size-10 place-items-center rounded-full bg-white text-black"
            onClick={onClose}
            aria-label="Close campus map"
          >
            <X size={19} />
          </button>
        </div>
      </MotionReveal>
      <MotionReveal
        className="mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-auto rounded-md bg-[#abc2dc] shadow-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <img
          className="mx-auto block h-auto max-w-none origin-top-left transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${zoom * 100}%` }}
          src="/tiet-campus-map.webp"
          alt="Illustrated map of the TIET campus showing academic blocks, hostels, sports facilities, gates, library, food court and central park"
        />
      </MotionReveal>
      <p className="pt-3 text-center text-[10px] text-white/45">
        Approximate campus guide · Use + and − to zoom
      </p>
    </MotionBackdrop>
  );
}
