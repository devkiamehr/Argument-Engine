"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Trash2 } from "lucide-react";

import { PageHeading } from "@/components/features/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listSyllogisms, deleteSyllogism, type Syllogism } from "@/lib/api";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function ValidityCell({ value }: { value: boolean | null }) {
  if (value == null) return <Badge variant="beta">beta</Badge>;
  return (
    <Badge variant={value ? "valid" : "destructive"}>
      {value ? "valid" : "invalid"}
    </Badge>
  );
}

export function HistoryView() {
  const [items, setItems] = useState<Syllogism[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await listSyllogisms();
        if (active) setItems(data);
      } catch (err) {
        if (active)
          setError(err instanceof Error ? err.message : "Could not load history.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) =>
      [s.lineOne, s.lineTwo, s.conclusion].some((t) =>
        t.toLowerCase().includes(q)
      )
    );
  }, [items, query]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteSyllogism(id);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Library"
        title="Past syllogisms"
        description="Every syllogism you analyze is saved here with its conclusion."
      />

      <div className="flex animate-rise flex-col gap-3 [animation-delay:80ms] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search premises…"
            className="pl-9"
            aria-label="Search history"
          />
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {loading
            ? "Loading…"
            : `${filtered.length} ${filtered.length === 1 ? "syllogism" : "syllogisms"}`}
        </p>
      </div>

      <Card className="animate-rise [animation-delay:160ms]">
        <CardContent className="px-0 py-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Loading your history…</span>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-destructive">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <p className="font-medium">
                {items.length === 0
                  ? "No saved syllogisms yet"
                  : "No matches"}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {items.length === 0
                  ? "Head to the Analyzer to infer your first conclusion."
                  : "Try a different search term."}
              </p>
              {items.length === 0 && (
                <Button
                  className="mt-1"
                  render={<Link href="/" />}
                  nativeButton={false}
                >
                  Open the Analyzer
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Premises</TableHead>
                  <TableHead>Conclusion</TableHead>
                  <TableHead>Mood</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="pl-6 align-top">
                      <div className="space-y-0.5 font-mono text-xs text-muted-foreground">
                        <p>{s.lineOne}</p>
                        <p>{s.lineTwo}</p>
                      </div>
                    </TableCell>
                    <TableCell className="align-top font-medium">
                      {s.conclusion}
                    </TableCell>
                    <TableCell className="align-top">
                      {s.mood ? (
                        <span className="font-mono text-xs">{s.mood}</span>
                      ) : (
                        <Badge variant="beta">beta</Badge>
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      <ValidityCell value={s.validity} />
                    </TableCell>
                    <TableCell className="align-top font-mono text-xs text-muted-foreground">
                      {formatDate(s.createdAt)}
                    </TableCell>
                    <TableCell className="pr-6 text-right align-top">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Delete syllogism"
                        disabled={deletingId === s.id}
                        onClick={() => handleDelete(s.id)}
                      >
                        {deletingId === s.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Trash2 className="text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
