import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  children?: ReactNode;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-2 font-display text-[1.75rem] font-semibold md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-[0.975rem] text-muted-foreground md:text-lg">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
