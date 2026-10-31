"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

type Menu = "product" | "services" | "resources";
type MobileSection = Menu | null;

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const productItems: NavItem[] = [
  {
    label: "Ad Drafting",
    href: "/product/ad-drafting",
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
    icon: (
      <>
        <path d="M19.439 15.417A3.5 3.5 0 0 0 22 12a3.5 3.5 0 0 0-3.5-3.5h-1.1l-.9-2.1A3.5 3.5 0 0 0 13 4a3.5 3.5 0 0 0-3.5 3.5v1.1l-2.1.9A3.5 3.5 0 0 0 4 13a3.5 3.5 0 0 0 3.5 3.5h1.1l.9 2.1A3.5 3.5 0 0 0 13 22a3.5 3.5 0 0 0 3.5-3.5v-1.1l2.1-.9a3.5 3.5 0 0 0 .939-1.083Z" />
      </>
    ),
  },
];



const resourceItems: NavItem[] = [
  {
    label: "Blog",
    href: "/blogs",
    icon: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
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
  const [scrolled, setScrolled] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const [closingMenu, setClosingMenu] = useState<Menu | null>(null);
  const [panelPhase, setPanelPhase] = useState<"open" | "closed">("closed");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MobileSection>(null);

  const navbarRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<Menu, HTMLButtonElement | null>>({
    product: null,
    services: null,
    resources: null,
  });
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const activeMenuRef = useRef<Menu | null>(null);

  const panelMenu = activeMenu ?? closingMenu;
  const isPanelOpen = activeMenu !== null;

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(
    (immediate = false) => {
      clearTimers();
      const menu = activeMenuRef.current;
      if (!menu) return;

      setClosingMenu(menu);
      setActiveMenu(null);
      setPanelPhase("closed");

      window.setTimeout(() => {
        setClosingMenu((current) => (current === menu ? null : current));
      }, 100);

      void immediate;
    },
    [clearTimers]
  );

  const openMenu = useCallback(
    (menu: Menu, immediate = false) => {
      clearTimers();

      const current = activeMenuRef.current;
      if (current === menu) return;

      if (current && current !== menu) {
        setClosingMenu(null);
        setActiveMenu(menu);
        setPanelPhase("open");
        return;
      }

      if (immediate || !canHover) {
        setActiveMenu(menu);
        setClosingMenu(null);
        setPanelPhase("open");
        return;
      }

      openTimerRef.current = window.setTimeout(() => {
        setActiveMenu(menu);
        setClosingMenu(null);
        setPanelPhase("open");
      }, 80);
    },
    [canHover, clearTimers]
  );

  const scheduleClose = useCallback(() => {
    if (!activeMenuRef.current) return;
    clearTimers();

    const menu = activeMenuRef.current;
    closeTimerRef.current = window.setTimeout(() => {
      setClosingMenu(menu);
      setActiveMenu(null);
      setPanelPhase("closed");
      window.setTimeout(() => {
        setClosingMenu((current) => (current === menu ? null : current));
      }, 100);
    }, 150);
  }, [clearTimers]);

  const handleTriggerEnter = useCallback(
    (menu: Menu) => {
      if (!canHover) return;
      clearTimers();

      const current = activeMenuRef.current;
      if (current && current !== menu) {
        setActiveMenu(menu);
        setClosingMenu(null);
        setPanelPhase("open");
      } else if (!current) {
        openTimerRef.current = window.setTimeout(() => {
          setActiveMenu(menu);
          setClosingMenu(null);
          setPanelPhase("open");
        }, 80);
      }
    },
    [canHover, clearTimers]
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
    if (activeMenu) {
      const id = window.requestAnimationFrame(() => setPanelPhase("open"));
      return () => window.cancelAnimationFrame(id);
    }
    setPanelPhase("closed");
    return undefined;
  }, [activeMenu]);

  useEffect(() => {
    const closeAll = () => {
      closeMenu(true);
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

  const solid = scrolled;

  function renderCard(item: NavItem) {
    return (
      <Link
        key={item.href}
        href={item.href}
        className="flex h-[64px] min-w-[184px] flex-none items-center gap-3 rounded-[14px] border border-[rgba(0,0,0,0.06)] bg-[#fcfcfd] px-3 py-0 pl-3 pr-4 transition-colors duration-150 hover:border-[rgba(0,0,0,0.09)] hover:bg-[#f4f4f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
      >
        <span className="grid size-[42px] shrink-0 place-items-center rounded-[12px] bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] border border-[rgba(0,0,0,0.07)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.04)]">
          <Icon paths={item.icon} className="size-5 text-[#1a1a1a]" />
        </span>
        <span className="text-[14px] font-medium text-[#14161a]">
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <>
      <header
        ref={navbarRef}
        className="fixed inset-x-0 top-0 z-50 h-14 min-[900px]:h-[70px]"
      >
        <div
          className={`h-full transition-[background-color,border-color] duration-200 ${
            solid
              ? "border-b border-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.94)] backdrop-blur-[12px]"
              : "border-b border-transparent bg-transparent"
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
              className="hidden min-[900px]:flex items-center gap-0"
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
                onMouseLeave={scheduleClose}
                className="inline-flex items-center gap-px px-[7px] py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
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
                onMouseLeave={scheduleClose}
                className="inline-flex items-center gap-px px-[7px] py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
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
                className="inline-flex items-center gap-px px-[7px] py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-px px-[7px] py-2 text-[14px] font-medium tracking-[-0.01em] text-[#14161a] transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
              >
                About
              </Link>
            </nav>

            <div className="flex items-center gap-3 min-[900px]:gap-2 min-[900px]:justify-end">
              <Link
                href="/book-demo"
                className="btn-skeu btn-primary inline-flex h-9 items-center justify-center rounded-[10px] px-4 text-[13px] font-medium no-underline whitespace-nowrap min-[900px]:h-10 min-[900px]:rounded-[12px] min-[900px]:px-[17px] min-[900px]:text-[12px]"
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
        </div>

        {panelMenu ? (
          <div
            ref={panelRef}
            onMouseEnter={() => {
              if (canHover) clearTimers();
            }}
            onMouseLeave={() => {
              if (canHover) scheduleClose();
            }}
            className={`fixed left-1/2 top-[78px] z-50 w-max max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-[22px] border border-[rgba(0,0,0,0.06)] bg-white px-2 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] ${
              panelPhase === "open"
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1"
            } motion-safe:transition-[opacity,transform] motion-safe:duration-160 motion-safe:ease-out motion-reduce:transition-none`}
          >
            <div className="flex items-start gap-2">
              <div className="flex shrink-0 gap-2">
                {(panelMenu === "product" ? productItems : resourceItems).map(
                  (item) => renderCard(item)
                )}
              </div>
            </div>
          </div>
        ) : null}

      {mobileOpen ? (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-white px-6 py-6 min-[900px]:hidden">
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
                {productItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-medium text-[#14161a] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] border border-[rgba(0,0,0,0.07)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)]">
                      <Icon paths={item.icon} className="size-5 text-[#1a1a1a]" />
                    </span>
                    {item.label}
                  </Link>
                ))}
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
                {resourceItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] font-medium text-[#14161a] transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(63,140,255,0.45)] focus-visible:ring-offset-2"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] border border-[rgba(0,0,0,0.07)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.04)]">
                      <Icon paths={item.icon} className="size-5 text-[#1a1a1a]" />
                    </span>
                    {item.label}
                  </Link>
                ))}
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

          <div className="mt-8 space-y-3">
            <Link
              href="/book-demo"
              className="btn-skeu btn-primary flex h-11 w-full items-center justify-center rounded-[14px] px-[22px] text-[14px] font-medium no-underline whitespace-nowrap"
            >
              Book a demo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
    </>
  );
}
