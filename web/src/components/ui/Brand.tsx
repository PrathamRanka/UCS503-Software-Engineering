export function Brand({ compact = false }: { compact?: boolean }) {
  if (compact)
    return (
      <a
        className="relative block h-10 w-full overflow-hidden no-underline"
        href="/"
        aria-label="titalks home"
      >
        <img
          className="absolute left-0 top-0 h-10 w-10 rounded-xl object-cover opacity-100 transition-opacity duration-150 ease-out group-hover/sidebar:opacity-0 motion-reduce:transition-none"
          src="/titalks-mark.webp"
          alt=""
        />
        <img
          className="absolute left-0 top-0 h-10 w-auto max-w-[180px] opacity-0 transition-opacity duration-150 ease-out group-hover/sidebar:opacity-100 motion-reduce:transition-none"
          src="/titalks-wordmark.webp"
          alt="titalks"
        />
      </a>
    );

  return (
    <a className="group flex w-fit items-center no-underline" href="/" aria-label="titalks home">
      <img
        className="h-11 w-auto transition duration-200 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
        src="/titalks-wordmark.webp"
        alt="titalks"
      />
    </a>
  );
}
