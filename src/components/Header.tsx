import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Home, LayoutDashboard, Menu, Users, X } from "lucide-react";

import ContactButton from "./buttons/ContactButton";
import SignInButton from "./buttons/SignInButton";
import SignOutButton from "./buttons/SignOutButton";
import SignUpButton from "./buttons/SignUpButton";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, loading, logout } = useAuth();

  // Pendant le chargement
  if (loading) return null;

  const isAuthenticated = !!user;

  return (
    <>
      <header className="p-4 flex items-center justify-between shadow-lg text-foreground">
        <div className="flex items-center">
          {isAuthenticated && (
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-lg transition-colors hover:bg-[color-mix(in_oklch,var(--primary)_12%,var(--background))]"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          )}

          <h1 className="ml-4 text-xl font-semibold text-foreground">
            <Link
              to="/"
              className="inline-flex items-center text-3xl font-black tracking-tight text-foreground"
            >
              Niobé
            </Link>
          </h1>
        </div>

        <div className="ml-6 flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <SignOutButton onSignedOut={logout} />
              <ModeToggle />
            </>
          ) : (
            <>
              <ContactButton className="mr-4" />
              <SignInButton />
              <SignUpButton />
              <ModeToggle />
            </>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-background text-foreground shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[color-mix(in_oklch,var(--primary)_12%,var(--background))] rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[color-mix(in_oklch,var(--primary)_12%,var(--background))] transition-colors mb-2"
            activeProps={{
              className:
                "flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground transition-colors mb-2",
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[color-mix(in_oklch,var(--primary)_12%,var(--background))] transition-colors mb-2"
                activeProps={{
                  className:
                    "flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground transition-colors mb-2",
                }}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                to="/candidates"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[color-mix(in_oklch,var(--primary)_12%,var(--background))] transition-colors mb-2"
                activeProps={{
                  className:
                    "flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground transition-colors mb-2",
                }}
              >
                <Users size={20} />
                <span className="font-medium">Candidates</span>
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
