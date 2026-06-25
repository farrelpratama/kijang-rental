"use client";

export default function FleetSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[30px] border border-slate-200 bg-white"
        >
          <div className="h-64 animate-pulse bg-slate-200" />

          <div className="space-y-5 p-6">
            <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />

            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

            <div className="grid grid-cols-3 gap-3">
              {Array.from({
                length: 3,
              }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="space-y-2">
                <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />

                <div className="h-8 w-36 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="h-12 w-32 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}