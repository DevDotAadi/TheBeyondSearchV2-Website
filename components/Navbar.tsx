"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

type Menu = "product" | "resources";
type MobileSection = Menu | null;
type SlidePhase = "idle" | "out" | "in";

const PANEL_EXIT_MS = 160;
const MENU_SLIDE_OUT_MS = 280;
const MENU_SLIDE_IN_MS = 320;

type NavItem = {
  label: string;
  href: string;
  description: string;
  icon: ReactNode;
};

const productItems: NavItem[] = [
  {
    label: "Ad Drafting",
    href: "/product/ad-drafting",
    description: "Campaigns written for you",
    icon: (
      <>
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </>
    ),
  },
  {
    label: "Autopilot",
    href: "/product/autopilot",
    description: "Launch and optimize on autopilot",
    icon: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </>
    ),
  },
  {
    label: "Integrations",
    href: "/product/integrations",
    description: "Meta, Google and more",
    icon: (
      <>
        <path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z" />
      </>
    ),
  },
];



const resourceItems: NavItem[] = [
  {
    label: "Blog",
    href: "/blogs",
    description: "Ideas and updates",
    icon: (
      <>
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
        <path d="m15 5 3 3" />
      </>
    ),
  },
  {
    label: "Help Center",
    href: "/help",
    description: "Guides and support",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </>
    ),
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Quick answers",
    icon: (
      <>
        <path d="M10 6h11" />
        <path d="M10 12h11" />
        <path d="M10 18h11" />
        <path d="M4 6h1v4" />
        <path d="M4 10h2" />
        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
      </>
    ),
  },
];

function Icon({
  paths,
  className = "size-5",
  strokeWidth = 1.75,
}: {
  paths: ReactNode;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [canHover, setCanHover] = useState(false);
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const [closingMenu, setClosingMenu] = useState<Menu | null>(null);
  const [panelPhase, setPanelPhase] = useState<"open" | "closing" | "closed">("closed");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSection>(null);
  const [hoverIntent, setHoverIntent] = useState(false);
  const [displayMenu, setDisplayMenu] = useState<Menu | null>(null);
  const [slidePhase, setSlidePhase] = useState<SlidePhase>("idle");
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [navHidden, setNavHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navbarRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<Menu, HTMLButtonElement | null>>({
    product: null,
    resources: null,
  });
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const panelTimerRef = useRef<number | null>(null);
  const slideTimerRef = useRef<number | null>(null);
  const activeMenuRef = useRef<Menu | null>(null);
  const displayMenuRef = useRef<Menu | null>(null);
  const slidePhaseRef = useRef<SlidePhase>("idle");
  const pendingMenuRef = useRef<Menu | null>(null);
  const lastScrollYRef = useRef(0);
  const prevPanelPhaseRef = useRef<"open" | "closing" | "closed">("closed");

  const panelMenu = activeMenu ?? closingMenu;
  const contentMenu = displayMenu ?? panelMenu;

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (panelTimerRef.current !== null) {
      window.clearTimeout(panelTimerRef.current);
      panelTimerRef.current = null;
    }
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  }, []);

  const clearPanelTimer = useCallback(() => {
    if (panelTimerRef.current !== null) {
      window.clearTimeout(panelTimerRef.current);
      panelTimerRef.current = null;
    }
  }, []);

  const updateDisplayMenu = useCallback((menu: Menu | null) => {
    displayMenuRef.current = menu;
    setDisplayMenu(menu);
  }, []);

  const updateSlidePhase = useCallback((phase: SlidePhase) => {
    slidePhaseRef.current = phase;
    setSlidePhase(phase);
  }, []);

  const clearSlideTimer = useCallback(() => {
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current);
      slideTimerRef.current = null;
    }
  }, []);

  const startMenuSwap = useCallback(
    (next: Menu) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        pendingMenuRef.current = null;
        clearSlideTimer();
        setSlideDirection(next === "resources" ? 1 : -1);
        updateDisplayMenu(next);
        updateSlidePhase("idle");
        return;
      }

      const current = displayMenuRef.current;
      if (!current) {
        pendingMenuRef.current = null;
        updateDisplayMenu(next);
        updateSlidePhase("idle");
        return;
      }

      if (current === next) {
        if (slidePhaseRef.current === "out") {
          pendingMenuRef.current = null;
          clearSlideTimer();
          updateSlidePhase("idle");
        }
        return;
      }

      pendingMenuRef.current = next;
      setSlideDirection(next === "resources" ? 1 : -1);

      if (slidePhaseRef.current === "out") return;

      clearSlideTimer();
      updateSlidePhase("out");

      slideTimerRef.current = window.setTimeout(() => {
        slideTimerRef.current = null;
        const target = pendingMenuRef.current;
        if (!target || target === displayMenuRef.current) {
          pendingMenuRef.current = null;
          updateSlidePhase("idle");
          return;
        }
        pendingMenuRef.current = null;
        updateDisplayMenu(target);
        updateSlidePhase("in");
        slideTimerRef.current = window.setTimeout(() => {
          slideTimerRef.current = null;
          updateSlidePhase("idle");
        }, MENU_SLIDE_IN_MS);
      }, MENU_SLIDE_OUT_MS);
    },
    [clearSlideTimer, updateDisplayMenu, updateSlidePhase]
  );

  const closeMenu = useCallback(
    (immediate = false) => {
      clearTimers();
      const menu = activeMenuRef.current;
      if (!menu) return;
      clearPanelTimer();
      setHoverIntent(false);

      setClosingMenu(menu);
      setActiveMenu(null);
      setPanelPhase("closing");

      panelTimerRef.current = window.setTimeout(() => {
        panelTimerRef.current = null;
        setClosingMenu((current) => (current === menu ? null : current));
        setPanelPhase("closed");
        pendingMenuRef.current = null;
        clearSlideTimer();
        updateDisplayMenu(null);
        updateSlidePhase("idle");
      }, PANEL_EXIT_MS);

      void immediate;
    },
    [clearPanelTimer, clearSlideTimer, clearTimers, updateDisplayMenu, updateSlidePhase]
  );

  const openMenu = useCallback(
    (menu: Menu, immediate = false) => {
      clearTimers();
      clearPanelTimer();

      const current = activeMenuRef.current;
      if (current === menu) return;

      if (immediate || !canHover) {
        setActiveMenu(menu);
        setClosingMenu(null);
        startMenuSwap(menu);
        return;
      }

      openTimerRef.current = window.setTimeout(() => {
        setActiveMenu(menu);
        setClosingMenu(null);
        startMenuSwap(menu);
      }, 40);
    },
    [canHover, clearPanelTimer, clearTimers, startMenuSwap]
  );

  const scheduleClose = useCallback(() => {
    if (!activeMenuRef.current) {
      clearTimers();
      setHoverIntent(false);
      return;
    }
    clearTimers();

    const menu = activeMenuRef.current;
    closeTimerRef.current = window.setTimeout(() => {
      setHoverIntent(false);
      setClosingMenu(menu);
      setActiveMenu(null);
      setPanelPhase("closing");
      clearPanelTimer();
      panelTimerRef.current = window.setTimeout(() => {
        panelTimerRef.current = null;
        setClosingMenu((current) => (current === menu ? null : current));
        setPanelPhase("closed");
        pendingMenuRef.current = null;
        clearSlideTimer();
        updateDisplayMenu(null);
        updateSlidePhase("idle");
      }, PANEL_EXIT_MS);
    }, 150);
  }, [clearPanelTimer, clearSlideTimer, clearTimers, updateDisplayMenu, updateSlidePhase]);

  const handleTriggerEnter = useCallback(
    (menu: Menu) => {
      if (!canHover) return;
      clearTimers();
      clearPanelTimer();
      setHoverIntent(true);

      const current = activeMenuRef.current;
      if (current && current !== menu) {
        setActiveMenu(menu);
        setClosingMenu(null);
        startMenuSwap(menu);
      } else if (!current) {
        openTimerRef.current = window.setTimeout(() => {
          setActiveMenu(menu);
          setClosingMenu(null);
          startMenuSwap(menu);
        }, 80);
      }
    },
    [canHover, clearPanelTimer, clearTimers, startMenuSwap]
  );

  const handleTriggerClick = useCallback(
    (menu: Menu) => {
      if (activeMenuRef.current === menu) {
        closeMenu(true);
      } else {
        openMenu(menu, true);
      }
    },
    [closeMenu, openMenu]
  );

  useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY >= 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (activeMenu || closingMenu || mobileOpen) {
      setNavHidden(false);
      lastScrollYRef.current = window.scrollY;
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastScrollYRef.current;

      if (y <= 8) {
        setNavHidden(false);
        lastScrollYRef.current = y;
        return;
      }

      if (delta > 6) {
        setNavHidden(true);
        lastScrollYRef.current = y;
      } else if (delta < -6) {
        setNavHidden(false);
        lastScrollYRef.current = y;
      }
    };

    const handleScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeMenu, closingMenu, mobileOpen]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearTimers();
      }
    };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [clearTimers]);

  // Track panel phase changes to know when panel first opens (vs menu switch)
  useEffect(() => {
    prevPanelPhaseRef.current = panelPhase;
  }, [panelPhase]);

  // Shutter animation should only play on fresh open, not when switching menus
  const shouldShowShutter = prevPanelPhaseRef.current !== "open" && panelPhase === "open";

  useEffect(() => {
    if (activeMenu) {
      const id = window.requestAnimationFrame(() => setPanelPhase("open"));
      return () => window.cancelAnimationFrame(id);
    }

    if (closingMenu) {
      setPanelPhase("closing");
    } else {
      setPanelPhase("closed");
    }
    return undefined;
  }, [activeMenu, closingMenu]);

  useEffect(() => {
    const closeAll = () => {
      closeMenu(true);
      setHoverIntent(false);
      setMobileOpen(false);
      setMobileSection(null);
    };
    closeAll();
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handlePointerDown(event: globalThis.MouseEvent) {
      if (!mobileOpen && !activeMenu && !closingMenu) return;
      const target = event.target as Node;
      if (navbarRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closeMenu(true);
      setHoverIntent(false);
      setMobileOpen(false);
      setMobileSection(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [activeMenu, closingMenu, mobileOpen, closeMenu]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      if (mobileOpen) {
        setMobileOpen(false);
        setMobileSection(null);
        return;
      }

      if (activeMenu) {
        const menu = activeMenu;
        closeMenu(true);
        triggerRefs.current[menu]?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeMenu, closeMenu, mobileOpen]);

  const solid = hoverIntent || activeMenu !== null || mobileOpen;
  const hideNav = navHidden && !panelMenu && !mobileOpen;

  function renderCard(item: NavItem, mobile = false) {
    return (
      <Link
        key={item.href}
        href={item.href}
        className="menu-card flex h-[72px] min-w-[184px] flex-none items-center gap-[14px] rounded-[16px] px-0 py-0 pl-[14px] pr-[16px] no-underline"
      >
        <span
          className={`menu-card-tile grid ${mobile ? "size-10" : "size-[44px]"} shrink-0 place-items-center rounded-[12px]`}
        >
          <Icon paths={item.icon} className="menu-card-icon size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="menu-card-label block truncate text-[14px] font-medium leading-[1.25]">
            {item.label}
          </span>
          {!mobile ? (
            <span className="menu-card-description mt-0.5 block truncate text-[12px] font-normal leading-[1.3]">
              {item.description}
            </span>
          ) : null}
        </span>
        {!mobile ? (
          <Icon
            paths={
              <>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </>
            }
            className="menu-card-arrow size-4 shrink-0"
          />
        ) : null}
      </Link>
    );
  }

  return (
    <>
      <header
        ref={navbarRef}
        className={`fixed inset-x-0 top-0 z-50 h-14 min-[900px]:h-[70px] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none ${
          hideNav
            ? "-translate-y-full pointer-events-none focus-within:pointer-events-auto focus-within:translate-y-0"
            : "translate-y-0"
        }`}
      >
        <div
          aria-hidden="true"
          className={`nav-bg-scroll pointer-events-none absolute inset-0 z-0 transition-opacity duration-200 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`relative z-20 h-full transition-[background-color] duration-200 ${
            solid ? "glass-menu" : "bg-transparent"
          }`}
        >
          <div className="mx-auto flex h-full max-w-[var(--site-container)] items-center justify-between px-6 min-[900px]:grid min-[900px]:grid-cols-[1fr_auto_1fr]">
            <Link
              href="/"
              aria-label="Home"
              className="flex h-[30px] items-center text-[24px] font-semibold leading-none tracking-[-0.02em] text-[#14161a]"
            >
              TheBeyondSearch
            </Link>

            <nav
              className="hidden min-[900px]:flex items-center gap-4"
              aria-label="Primary"
            >
              <button
                ref={(element) => {
                  triggerRefs.current.product = element;
                }}
                type="button"
                aria-expanded={activeMenu === "product"}
                aria-controls="product-menu"
                onClick={() => handleTriggerClick("product")}
                onMouseEnter={() => handleTriggerEnter("product")}
                onMouseLeave={() => {
                  setHoverIntent(false);
                  scheduleClose();
                }}
                className="-mr-[17px] inline-flex items-center gap-px px-2 py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] whitespace-nowrap transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
              >
                Product
                <Icon
                  paths={<path d="m6 9 6 6 6-6" />}
                  strokeWidth={2}
                  className={`size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${activeMenu === "product" ? "motion-safe:rotate-180" : ""}`}
                />
              </button>

              <button
                ref={(element) => {
                  triggerRefs.current.resources = element;
                }}
                type="button"
                aria-expanded={activeMenu === "resources"}
                aria-controls="resources-menu"
                onClick={() => handleTriggerClick("resources")}
                onMouseEnter={() => handleTriggerEnter("resources")}
                onMouseLeave={() => {
                  setHoverIntent(false);
                  scheduleClose();
                }}
                className="-mr-[17px] inline-flex items-center gap-px px-2 py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] whitespace-nowrap transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
              >
                Resources
                <Icon
                  paths={<path d="m6 9 6 6 6-6" />}
                  strokeWidth={2}
                  className={`size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${activeMenu === "resources" ? "motion-safe:rotate-180" : ""}`}
                />
              </button>

              <Link
                href="/pricing"
                className="-mr-2 inline-flex items-center gap-px px-2 py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] whitespace-nowrap transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-px px-2 py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] whitespace-nowrap transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
              >
                About
              </Link>
            </nav>

            <div className="flex items-center gap-3 min-[900px]:gap-2 min-[900px]:justify-end">
              <Link
                href="/book-demo"
                className="btn-get-started inline-flex h-9 items-center justify-center rounded-[10px] px-4 text-[13px] font-medium tracking-[-0.005em] text-[#ffffff] whitespace-nowrap min-[900px]:h-[40px] min-[900px]:rounded-[12px] min-[900px]:px-[17px] min-[900px]:text-[12px]"
              >
                Book a demo
              </Link>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
                className="btn-skeu btn-neutral grid size-9 place-items-center rounded-[10px] p-0 min-[900px]:hidden"
              >
                <Icon
                  paths={
                    mobileOpen ? (
                      <>
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </>
                    ) : (
                      <>
                        <path d="M4 12h16" />
                        <path d="M4 6h16" />
                        <path d="M4 18h16" />
                      </>
                    )
                  }
                  className="size-5 text-[#1a1a1a]"
                />
              </button>
            </div>
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[var(--site-container)] px-6 transition-opacity duration-200 ${
              panelMenu && panelPhase === "open" ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="nav-hairline h-px w-full bg-[rgba(0,0,0,0.06)]" />
          </div>
        </div>

        {panelMenu ? (
          <div className="pointer-events-none fixed inset-x-0 top-14 z-10 overflow-hidden pb-16 min-[900px]:top-[70px]">
            <div
              id={contentMenu ? `${contentMenu}-menu` : undefined}
              ref={panelRef}
              onMouseEnter={() => {
                if (canHover) clearTimers();
              }}
              onMouseLeave={() => {
                if (canHover) {
                  setHoverIntent(false);
                  scheduleClose();
                }
              }}
              className={`glass-menu pointer-events-auto border-b border-[rgba(0,0,0,0.06)] shadow-[0_18px_36px_-18px_rgba(0,0,0,0.08)] will-change-transform ${
                panelPhase === "open"
                  ? "translate-y-0 opacity-100 motion-safe:transition-[transform,opacity] motion-safe:duration-200 motion-safe:ease-out"
                  : panelPhase === "closing"
                    ? "-translate-y-1 opacity-0 pointer-events-none motion-safe:transition-[transform,opacity] motion-safe:duration-200"
                    : "-translate-y-1 opacity-0 pointer-events-none"
              }`}
            >
              <div className="relative mx-auto max-w-[var(--site-container)] overflow-hidden px-6 py-4">
                {contentMenu ? (
                  <div
                      className={`${
                          slidePhase !== "in"
                            ? "motion-safe:transition-[transform,opacity] motion-safe:duration-[280ms] motion-safe:ease-in"
                            : ""
                        } motion-reduce:transition-none`}
                    style={{
                      transform:
                        slidePhase === "out"
                          ? `translateX(${slideDirection > 0 ? "-24px" : "24px"})`
                          : "translateX(0)",
                      opacity: slidePhase === "out" ? 0 : 1,
                    }}
                  >
                    <div
                      key={contentMenu}
                      className={
                        slidePhase === "in"
                          ? slideDirection > 0
                            ? "nav-menu-in-right"
                            : "nav-menu-in-left"
                          : undefined
                      }
                    >
                      <div className="relative">
                        {shouldShowShutter && (
                          <div className="absolute inset-x-0 top-[-100%] h-[4px] bg-white">
                            <div className="absolute inset-y-0 h-full bg-white animate-[shutter-fall_350ms_ease-out_forwards]" />
                          </div>
                        )}
                        <div className={`grid grid-cols-[1fr_1px_1fr_1px_1fr] gap-x-5 ${shouldShowShutter ? "animate-[shutter-fall-delayed_350ms_ease-out_forwards]" : ""}`}>
                          {(contentMenu === "product" ? productItems : resourceItems).map(
                            (item, index, items) => (
                              <Fragment key={item.href}>
                                {renderCard(item)}
                                {index < items.length - 1 ? (
                                  <span className="menu-divider" aria-hidden="true" />
                                ) : null}
                              </Fragment>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto border-t border-[rgba(0,0,0,0.16)] bg-white px-6 py-6 min-[900px]:hidden">
          <div className="space-y-2">
            <button
              type="button"
              aria-expanded={mobileSection === "product"}
              onClick={() =>
                setMobileSection((section) =>
                  section === "product" ? null : "product"
                )
              }
              className="flex w-full items-center justify-between rounded-2xl px-2 py-3 text-[15px] font-medium text-[#14161a] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] border border-[rgba(0,0,0,0.07)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)]">
                  <Icon
                    paths={
                      <>
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                        <path d="M20 3v4" />
                        <path d="M22 5h-4" />
                        <path d="M4 17v2" />
                        <path d="M5 18H3" />
                      </>
                    }
                    className="size-5 text-[#1a1a1a]"
                  />
                </span>
                Product
              </span>
              <Icon
                paths={<path d="m6 9 6 6 6-6" />}
                className={`size-5 shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${mobileSection === "product" ? "motion-safe:rotate-180" : ""}`}
              />
            </button>
            {mobileSection === "product" ? (
              <div className="space-y-2 pl-2">
                {productItems.map((item) => renderCard(item, true))}
              </div>
            ) : null}

            <button
              type="button"
              aria-expanded={mobileSection === "resources"}
              onClick={() =>
                setMobileSection((section) =>
                  section === "resources" ? null : "resources"
                )
              }
              className="flex w-full items-center justify-between rounded-2xl px-2 py-3 text-[15px] font-medium text-[#14161a] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] border border-[rgba(0,0,0,0.07)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)]">
                  <Icon
                    paths={
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </>
                    }
                    className="size-5 text-[#1a1a1a]"
                  />
                </span>
                Resources
              </span>
              <Icon
                paths={<path d="m6 9 6 6 6-6" />}
                className={`size-5 shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${mobileSection === "resources" ? "motion-safe:rotate-180" : ""}`}
              />
            </button>
            {mobileSection === "resources" ? (
              <div className="space-y-2 pl-2">
                {resourceItems.map((item) => renderCard(item, true))}
              </div>
            ) : null}

          </div>

          <div className="space-y-2 pt-2">
            <Link
              href="/pricing"
              className="block rounded-2xl px-2 py-3 text-[15px] font-medium text-[#14161a] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block rounded-2xl px-2 py-3 text-[15px] font-medium text-[#14161a] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
            >
              About
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
