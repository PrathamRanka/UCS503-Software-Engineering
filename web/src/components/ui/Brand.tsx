export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className="group flex w-fit items-center no-underline" href="/" aria-label="titalks home">
      <img
        className={`${compact ? "h-10 w-10 rounded-xl object-cover xl:hidden" : "h-11 w-auto"} transition duration-200 ease-out group-hover:scale-[1.025] motion-reduce:transition-none`}
        src={compact ? "/titalks-mark.webp" : "/titalks-wordmark.webp"}
        alt="titalks"
      />
      {compact ? <img className="hidden h-12 w-auto xl:block" src="/titalks-wordmark.webp" alt="titalks" /> : null}
    </a>
  );
}
