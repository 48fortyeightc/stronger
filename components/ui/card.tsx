import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "panel glass-border rounded-[30px]",
        className,
      )}
      {...props}
    />
  );
}
