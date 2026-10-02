"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  User,
  Stethoscope,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  ChevronRight,
  ShieldCheck,
  Building2,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  FileCheck,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { TokenManager } from "@/lib/auth";
import { cn } from "@/lib/utils";

export type RoleType = "patient" | "doctor" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function AppShell({
  children,
  role: forcedRole,
  pageTitle,
}: {
  children: React.ReactNode;
  role?: RoleType;
  pageTitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [currentHash, setCurrentHash] = useState<string>("");

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash || "");
    };
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Auto-detect role from path if not provided
  let detectedRole: RoleType = "patient";
  if (forcedRole) {
    detectedRole = forcedRole;
  } else if (pathname.startsWith("/admin")) {
    detectedRole = "admin";
  } else if (pathname.startsWith("/doctors")) {
    detectedRole = "doctor";
  }

  // Normalized Navigation configs matching docs/frontend.md Phase 2
  const navConfigs: Record<RoleType, NavItem[]> = {
    patient: [
      {
        label: "Dashboard",
        href: "/patient/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "My Appointments",
        href: "/patient/dashboard/appointments",
        icon: Calendar,
      },
      {
        label: "Book Appointment",
        href: "/patient/dashboard/book",
        icon: CalendarPlus,
      },
      {
        label: "Health Profile",
        href: "/patient/dashboard/profile",
        icon: User,
      },
      {
        label: "Settings",
        href: "/patient/dashboard/settings",
        icon: Settings,
      },
    ],

    doctor: [
      {
        label: "Today's Schedule",
        href: "/doctors/dashboard#schedule",
        icon: Clock,
      },
      {
        label: "Appointments",
        href: "/doctors/dashboard#appointments",
        icon: Calendar,
      },
      {
        label: "Patients",
        href: "/doctors/dashboard#patients",
        icon: Users,
      },
      {
        label: "Consultation Plans",
        href: "/doctors/dashboard#plans",
        icon: Layers,
      },
      {
        label: "Profile",
        href: "/doctors/dashboard#profile",
        icon: User,
      },
    ],

    admin: [
      {
        label: "Overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Appointments",
        href: "/admin/dashboard#appointments",
        icon: Calendar,
      },
      {
        label: "Doctors",
        href: "/doctors",
        icon: Stethoscope,
      },
      {
        label: "Patients",
        href: "/admin/dashboard#patients",
        icon: Users,
      },
      {
        label: "Reports",
        href: "/admin/dashboard#reports",
        icon: FileCheck,
      },
      {
        label: "Settings",
        href: "/admin/dashboard#settings",
        icon: Settings,
      },
    ],
  };

  const navItems = navConfigs[detectedRole] || navConfigs.patient;

  const rawName = user?.name;
  const userName =
    rawName && !rawName.toLowerCase().includes("ramirez")
      ? rawName
      : detectedRole === "admin"
      ? "Dr. Aymen Hamel (Admin)"
      : detectedRole === "doctor"
      ? "Dr. Amine Mansouri"
      : "Sarah Benali";

  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "CP";

  const handleLogout = () => {
    try {
      logout.mutate();
    } catch {
      // Swallowed safely - local purge must proceed
    }
    TokenManager.clearToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("carepulse_token");
      localStorage.removeItem("user_token");
      localStorage.removeItem("carepulse_user");
      localStorage.removeItem("carepulse_role");
      localStorage.removeItem("carepulse_demo");
      document.cookie = "carepulse_token=; path=/; max-age=0";
      document.cookie = "user_token=; path=/; max-age=0";
      document.cookie = "carepulse_demo=; path=/; max-age=0";
      window.location.href = "/login";
    } else {
      router.push("/login");
    }
  };

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const notificationsList = [
    {
      id: "n1",
      title: "Consultation Confirmed",
      desc: "Dr. Amine Mansouri confirmed your Cardiology evaluation for 09:30 AM.",
      time: "10m ago",
      read: false,
    },
    {
      id: "n2",
      title: "Consultation Completed",
      desc: "Clinical evaluation dossier and follow-up consultation registered.",
      time: "2h ago",
      read: false,
    },
    {
      id: "n3",
      title: "CNAS Policy Verified",
      desc: "National health coverage DZ-CNAS-99887711 active with 100% copay.",
      time: "1d ago",
      read: true,
    },
  ];

  const isItemActive = (href: string) => {
    const [itemPath, itemHash] = href.split("#");
    if (itemHash) {
      if (pathname === itemPath) {
        if (currentHash === `#${itemHash}`) return true;
        if (!currentHash && itemHash === "schedule" && pathname === "/doctors/dashboard") return true;
      }
      return false;
    }
    if (href === "/doctors/dashboard") {
      return pathname === "/doctors/dashboard" && (!currentHash || currentHash === "#schedule");
    }
    if (href === "/patient/dashboard") {
      return pathname === "/patient/dashboard";
    }
    if (href === "/patient/dashboard/appointments") {
      return pathname === "/patient/dashboard/appointments" || pathname.includes("/my-appointments");
    }
    if (href === "/patient/dashboard/book") {
      return pathname === "/patient/dashboard/book" || pathname.startsWith("/appointments/new");
    }
    if (href === "/patient/dashboard/profile") {
      return pathname === "/patient/dashboard/profile" || pathname.includes("/profile");
    }
    if (href === "/patient/dashboard/settings") {
      return pathname === "/patient/dashboard/settings";
    }
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname === href;
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 z-30 shrink-0 select-none",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
              <Activity className="size-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-foreground leading-none">
                  CarePulse
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                  {detectedRole === "admin"
                    ? "Admin Console"
                    : detectedRole === "doctor"
                    ? "Doctor Portal"
                    : "Patient Clinic"}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group relative",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Toggle & User Card Bottom Section */}
        <div className="p-3 border-t border-border space-y-2">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-secondary/50",
              isCollapsed && "justify-center p-1.5"
            )}
          >
            <Avatar className="size-8 rounded-lg shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold rounded-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {userName}
                </p>
                <p className="text-[10px] text-muted-foreground capitalize truncate">
                  {detectedRole} account
                </p>
              </div>
            )}

            {!isCollapsed && (
              <Button
                roleVariant="ghost"
                size="icon"
                onClick={handleLogout}
                className="size-7 rounded-lg text-muted-foreground hover:text-destructive shrink-0"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-card p-5 flex flex-col justify-between shadow-2xl border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Activity className="size-5" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-foreground block">CarePulse</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                      {detectedRole} Portal
                    </span>
                  </div>
                </div>
                <Button
                  roleVariant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="size-8"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 rounded-lg">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                    {userName}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">{detectedRole}</p>
                </div>
              </div>
              <Button
                roleVariant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs text-destructive hover:bg-destructive/10 rounded-lg px-2.5"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA & SLIM TOPBAR */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Slim TopBar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border/80 bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              roleVariant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden size-9 rounded-xl"
              aria-label="Open mobile navigation"
            >
              <Menu className="size-5" />
            </Button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors font-medium">
                CarePulse
              </Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="font-semibold text-foreground capitalize">
                {pageTitle || detectedRole}
              </span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Button */}
            <Button
              roleVariant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl text-xs text-muted-foreground bg-secondary/40 border-border hover:bg-secondary hover:text-foreground"
            >
              <Search className="size-3.5" />
              <span>Search portal...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ⌘K
              </kbd>
            </Button>

            {/* Notification Bell with Dropdown */}
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  roleVariant="ghost"
                  size="icon"
                  className="size-9 rounded-xl border border-border/60 relative"
                  aria-label="Open notifications"
                >
                  <Bell className="size-4 text-foreground" />
                  <span className="absolute top-1.5 right-1.5 size-2 bg-emerald-500 rounded-full ring-2 ring-background" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl border border-border shadow-xl">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Notifications
                  </span>
                  <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                  {notificationsList.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-3 space-y-1 hover:bg-secondary/40 transition-colors cursor-pointer text-xs",
                        !item.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{item.title}</span>
                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-border text-center">
                  <Link
                    href={detectedRole === "patient" ? "/patient/dashboard/appointments" : "#"}
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    View All Activity
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Visual Theme Toggle */}
            <ThemeToggle className="size-9 rounded-xl border border-border/60" />

            {/* User Avatar & Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  roleVariant="ghost"
                  className="p-0 size-8 rounded-lg hover:ring-2 hover:ring-primary/40 transition-all"
                >
                  <Avatar className="size-8 rounded-lg border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 border border-border shadow-xl">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-xs font-bold text-foreground truncate">{userName}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{detectedRole} Account</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={detectedRole === "patient" ? "/patient/dashboard/profile" : "/doctors/dashboard#profile"}
                    className="cursor-pointer text-xs rounded-xl flex items-center gap-2"
                  >
                    <User className="size-3.5" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={detectedRole === "patient" ? "/patient/dashboard/settings" : "/doctors/dashboard"}
                    className="cursor-pointer text-xs rounded-xl flex items-center gap-2"
                  >
                    <Settings className="size-3.5" />
                    <span>Settings & Security</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-xs rounded-xl text-destructive hover:bg-destructive/10 flex items-center gap-2"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Global Search Dialog Modal */}
        {searchOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
            onClick={() => setSearchOpen(false)}
          >
            <div
              className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Quick search appointments, doctors, records... (ESC to close)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-secondary text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                  Quick Navigation
                </span>
                <Link
                  href="/patient/dashboard/book"
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-secondary text-foreground"
                >
                  <CalendarPlus className="size-4 text-primary" />
                  <span>Book Medical Consultation</span>
                </Link>
                <Link
                  href="/patient/dashboard/appointments"
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-secondary text-foreground"
                >
                  <Calendar className="size-4 text-primary" />
                  <span>View Consultation Schedule</span>
                </Link>
                <Link
                  href="/patient/dashboard/profile"
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-secondary text-foreground"
                >
                  <User className="size-4 text-primary" />
                  <span>Health Profile & Allergies</span>
                </Link>
                <Link
                  href="/doctors"
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-secondary text-foreground"
                >
                  <Stethoscope className="size-4 text-primary" />
                  <span>Physicians Directory</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
