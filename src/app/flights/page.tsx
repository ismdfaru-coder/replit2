
import { Suspense } from 'react';
import FlightResultsView from '@/components/flight-results-view';
import { Skeleton } from '@/components/ui/skeleton';
import { FlightFiltersSidebar } from '@/components/flight-filters-sidebar';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';

function FlightResultsSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-1/3 mb-8" />
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}

export default function FlightsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams?.q ?? '';
  const finalQuery = Array.isArray(query) ? query[0] : query;

  return (
    <div className="pt-20 bg-background">
      <SidebarProvider>
        <Sidebar>
          <FlightFiltersSidebar />
        </Sidebar>
        <SidebarInset>
          <Suspense fallback={<FlightResultsSkeleton />}>
            <FlightResultsView query={finalQuery} layout="grid" />
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
