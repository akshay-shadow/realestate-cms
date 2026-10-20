/** An image with an optional separate file for phones (screens under 768px). */
export function ResponsiveImage({
  src,
  mobileSrc,
  alt,
  className,
  loading = "lazy",
}: {
  src: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  /* eslint-disable @next/next/no-img-element */
  if (!mobileSrc) return <img src={src} alt={alt} loading={loading} className={className} />;
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <img src={src} alt={alt} loading={loading} className={className} />
    </picture>
  );
  /* eslint-enable @next/next/no-img-element */
}
