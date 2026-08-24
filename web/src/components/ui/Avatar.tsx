type AvatarProps = {
  src: string;
  size?: "sm" | "md" | "lg";
};

export function Avatar({ src, size = "md" }: AvatarProps) {
  const sizes = {
    sm: "size-8",
    md: "size-10",
    lg: "size-14",
  };

  return (
    <img
      className={`${sizes[size]} shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 object-cover object-center`}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}
