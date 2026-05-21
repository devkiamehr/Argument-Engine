export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 sm:px-8">
      <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-52 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
