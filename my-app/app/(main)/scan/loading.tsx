import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ScanLoading() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 md:px-8">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-64" />
        <Skeleton className="mx-auto h-5 w-96" />
      </div>
      <Card className="border-border bg-surface-1">
        <CardContent className="flex flex-col items-center justify-center p-16">
          <Skeleton className="mb-4 h-16 w-16 rounded-2xl" />
          <Skeleton className="mb-2 h-5 w-48" />
          <Skeleton className="h-4 w-36" />
        </CardContent>
      </Card>
    </div>
  );
}
