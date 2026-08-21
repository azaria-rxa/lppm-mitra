import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingIsiSurvei() {
  return (
    <div className="space-y-5 pt-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />

      {/* progress bar */}
      <div className="space-y-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>

      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-4 p-5">
            <div className="flex gap-3">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            {i % 2 === 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((__, j) => (
                  <Skeleton key={j} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {Array.from({ length: 3 }).map((__, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Skeleton className="h-12 w-full" />
    </div>
  );
}
