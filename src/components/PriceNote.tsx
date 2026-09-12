export function PriceNote({ className = "" }: { className?: string }) {
  return (
    <p className={`rounded-xl bg-cream px-4 py-3 text-sm text-muted-foreground ${className}`}>
      Prices and availability may vary. Contact us for current details.
    </p>
  );
}
