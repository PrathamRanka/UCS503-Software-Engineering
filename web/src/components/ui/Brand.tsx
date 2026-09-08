export function Brand({ compact = false }: { compact?: boolean }) {
  if (compact)
    return (
      <a
        className="relative block h-11 w-[196px] shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 no-underline"
        href="/"
        aria-label="titalks home"
      >
        <span className="absolute inset-y-0 left-0 grid w-12 place-items-center opacity-100 transition-opacity duration-150 ease-out group-hover/sidebar:opacity-0 motion-reduce:transition-none">
          <img
            className="size-8 object-contain"
            src="/titalks-icon-192.png?v=3"
            alt=""
          />
        </span>
        <img
          className="absolute left-3 top-1/2 h-7 w-[150px] -translate-y-1/2 object-contain object-left opacity-0 transition-opacity duration-150 ease-out group-hover/sidebar:opacity-100 motion-reduce:transition-none"
          src="/titalks-wordmark.webp?v=3"
          alt="titalks"
        />
      </a>
    );

  return (
    <a className="group flex w-fit items-center no-underline" href="/" aria-label="titalks home">
      <img
        className="h-11 w-auto transition duration-200 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
        src="/titalks-wordmark.webp?v=3"
        alt="titalks"
      />
    </a>
  );
}
