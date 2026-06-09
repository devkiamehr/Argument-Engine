"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { PageHeading } from "@/components/features/page-heading";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

function Feedback({ ok, error }: { ok: string | null; error: string | null }) {
  if (error)
    return (
      <p role="alert" className="text-sm text-destructive">
        {error}
      </p>
    );
  if (ok) return <p className="text-sm text-valid">{ok}</p>;
  return null;
}

export function AccountView() {
  const router = useRouter();
  const { user, updateAccount, deleteAccount, logout } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileOk, setProfileOk] = useState<string | null>(null);
  const [profileErr, setProfileErr] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [password, setPassword] = useState("");
  const [pwOk, setPwOk] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteErr, setDeleteErr] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (!user) return null;

  const profileChanged =
    name.trim() !== user.name || email.trim() !== user.email;

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileOk(null);
    setProfileErr(null);
    setSavingProfile(true);
    try {
      await updateAccount({ name: name.trim(), email: email.trim() });
      setProfileOk("Profile saved.");
    } catch (err) {
      setProfileErr(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPwOk(null);
    setPwErr(null);
    setSavingPw(true);
    try {
      await updateAccount({ password });
      setPassword("");
      setPwOk("Password updated.");
    } catch (err) {
      setPwErr(err instanceof Error ? err.message : "Could not update.");
    } finally {
      setSavingPw(false);
    }
  }

  async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeleteErr(null);
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      router.push("/signup");
    } catch (err) {
      setDeleteErr(err instanceof Error ? err.message : "Could not delete.");
      setDeleting(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeading
        eyebrow="Settings"
        title="Account"
        description="Manage your profile, password, and preferences."
      />

      {/* Profile */}
      <Card className="animate-rise [animation-delay:80ms]">
        <CardContent className="space-y-5 py-6">
          <div className="flex items-center justify-between">
            <CardLabel>Profile</CardLabel>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>

          <form onSubmit={saveProfile} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <Separator />
            <div className="flex items-center justify-between gap-4">
              <Feedback ok={profileOk} error={profileErr} />
              <Button
                type="submit"
                disabled={!profileChanged || savingProfile}
                className="ml-auto"
              >
                {savingProfile && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="animate-rise [animation-delay:120ms]">
        <CardContent className="space-y-5 py-6">
          <CardLabel>Password</CardLabel>
          <form onSubmit={savePassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Feedback ok={pwOk} error={pwErr} />
              <Button
                type="submit"
                disabled={password === "" || savingPw}
                className="ml-auto"
              >
                {savingPw && <Loader2 className="animate-spin" />}
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="animate-rise [animation-delay:160ms]">
        <CardContent className="space-y-5 py-6">
          <CardLabel>Appearance</CardLabel>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark. Saved locally.
              </p>
            </div>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="animate-rise border-destructive/30 ring-destructive/15 [animation-delay:200ms]">
        <CardContent className="space-y-4 py-6">
          <CardLabel>Danger zone</CardLabel>
          <p className="text-sm text-muted-foreground">
            Deleting your account permanently removes it and every saved
            syllogism. Enter your password to confirm.
          </p>
          <form
            onSubmit={handleDelete}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Input
              type="password"
              autoComplete="current-password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Current password"
              className="sm:max-w-xs"
            />
            <Button
              type="submit"
              variant="destructive"
              disabled={deletePassword === "" || deleting}
            >
              {deleting && <Loader2 className="animate-spin" />}
              Delete account
            </Button>
          </form>
          <Feedback ok={null} error={deleteErr} />
        </CardContent>
      </Card>
    </div>
  );
}
