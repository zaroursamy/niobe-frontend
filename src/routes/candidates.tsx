import { useEffect, useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Calendar as CalendarIcon } from "lucide-react";

import CreateCandidateButton from "@/components/buttons/CreateCandidateButton";
import CandidateList, {
  type Candidate,
} from "@/components/candidates/CandidateList";
import CreateCandidateForm from "@/components/forms/CandidateForm";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchWithRefresh, type AuthUser } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/config";
import { requireAuth } from "@/lib/middleware/auth";

type CandidatesContext = { user: AuthUser };

const searchSchema = z.object({
  q: z.string().optional(),
  id: z.string().optional(),
  user_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  title: z.string().optional(),
  experience_years: z.preprocess((value) => {
    if (value === "" || value == null) return undefined;
    return Number(value);
  }, z.number().int().nonnegative().optional()),
  notes: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
type CandidatesSearch = z.infer<typeof searchSchema>;

const candidatesQueryOptions = (search: CandidatesSearch = {}) =>
  queryOptions({
    queryKey: ["candidates", search],
    queryFn: async (): Promise<Candidate[]> => {
      const params = new URLSearchParams();
      Object.entries(search).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        params.set(key, String(value));
      });
      const query = params.toString();
      const response = await fetchWithRefresh(
        `${BACKEND_URL}/candidates${query ? `?${query}` : ""}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }

      return response.json();
    },
  });

export const Route = createFileRoute("/candidates")({
  beforeLoad: async ({ location }) => {
    const { user } = await requireAuth({ location });
    return { user } satisfies CandidatesContext;
  },
  validateSearch: (search): CandidatesSearch => searchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(candidatesQueryOptions(deps)),
  component: CandidatesPage,
});

function CandidatesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch() as CandidatesSearch;
  const [searchText, setSearchText] = useState(search.q ?? "");

  const { data, refetch } = useSuspenseQuery(candidatesQueryOptions(search));

  const updateSearch = (
    key: keyof CandidatesSearch,
    value: string | number | undefined,
  ) => {
    const nextValue =
      typeof value === "string" ? (value.trim() ? value : undefined) : value;
    void navigate({
      search: (prev) => ({
        ...prev,
        [key]: nextValue,
      }),
      replace: true,
    });
  };
  useEffect(() => {
    setSearchText(search.q ?? "");
  }, [search.q]);
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const parseDate = (value?: string) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-accent/10 to-background text-foreground px-6 py-16">
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              CANDIDATES
            </p>
            <h1 className="text-4xl font-bold">Overview</h1>
            <p className="text-muted-foreground">
              Find your candidates and open their profiles.
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <CreateCandidateButton className="shadow-sm hover:brightness-110" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create candidate</DialogTitle>
                <DialogDescription>
                  Add a new candidate to your database.
                </DialogDescription>
              </DialogHeader>

              <CreateCandidateForm
                onSuccess={() => {
                  setIsCreateOpen(false);
                  void refetch();
                }}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="candidate-search">
                  Search on notes, name, email ...
                </Label>
                <Input
                  id="candidate-search"
                  placeholder="Search and press Enter"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      updateSearch("q", searchText);
                    }
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {data.length} candidate(s)
              </p>
            </div>

            <CandidateList candidates={data} />
          </div>

          <aside className="rounded-2xl border border-border bg-card/40 p-6 shadow-sm space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Filters
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate({
                    search: {},
                    replace: true,
                  })
                }
              >
                Clear
              </Button>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="candidate-experience">Experience min</Label>
                <div className="space-y-3">
                  <Slider
                    id="candidate-experience"
                    min={0}
                    max={40}
                    step={1}
                    value={[search.experience_years ?? 0]}
                    onValueChange={(value) =>
                      updateSearch("experience_years", value[0])
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {search.experience_years != null
                      ? `${search.experience_years} years`
                      : "Any"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate-status">Status</Label>
                <Input
                  id="candidate-status"
                  value={search.status ?? ""}
                  onChange={(event) =>
                    updateSearch("status", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate-source">Source</Label>
                <Select
                  value={search.source ?? "all"}
                  onValueChange={(value) =>
                    updateSearch("source", value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger id="candidate-source" className="w-full">
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="cooptation">Cooptation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate-created-at">Created at</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {search.created_at ?? "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(search.created_at)}
                      onSelect={(date) =>
                        updateSearch("created_at", date ? formatDate(date) : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidate-updated-at">Updated at</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {search.updated_at ?? "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(search.updated_at)}
                      onSelect={(date) =>
                        updateSearch("updated_at", date ? formatDate(date) : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
