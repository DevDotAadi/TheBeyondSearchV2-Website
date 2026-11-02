"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Tooltip } from "@/components/Tooltip";
import { Sparkles, ShieldCheck, Wallet } from "lucide-react";

/*============================================================================
  TERMINOLOGY
  - "App showcase" = the app window open on the desktop (everything inside it).
  - "System" = everything around it (wallpaper frame, dock, menu bar).
  The system is never modified here. All work happens inside AppShowcase only.
============================================================================*/

/*============================================================================
  BOT MARK - app icon image used in the dock.
============================================================================*/
function BotMark({ size = 14 }: { size?: number }) {
  return (
    <img
      src="/icons/brands/beyond-search-icon.webp"
      alt="Beyond Search"
      style={{ width: size, height: size }}
      className="rounded-full"
      decoding="async"
    />
  );
}

const POINTS = [
  { icon: Sparkles, label: "Ad Drafting", description: "One sentence to ready ads" },
  { icon: ShieldCheck, label: "Guardrails", description: "Brand and legal rules" },
  { icon: Wallet, label: "Budget Control", description: "Hard spend caps" },
];

/*============================================================================
  APP SHOWCASE - system shell: section header + points row + wallpaper + dock.
  The actual app window is not rendered here yet.
============================================================================*/
export function AppShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [dockBounce, setDockBounce] = useState(false);

  // Desktop system animations (dock bounce)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const t1 = setTimeout(() => setDockBounce(true), 300);
    const t2 = setTimeout(() => setDockBounce(false), 650);
    const t3 = setTimeout(() => setDockBounce(true), 1000);
    const t4 = setTimeout(() => setDockBounce(false), 1350);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
    };
  }, []);

  // Canvas scale via ResizeObserver on the device wrap
  useLayoutEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const update = () => setScale(Math.min(1, node.clientWidth / 1120));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="system"
      ref={sectionRef}
      className="system-section"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      {/* Section header restored above the showcase area */}
      <div className="section-header">
        <p className="section-eyebrow">The product</p>
        <h1 className="section-heading">From one sentence to live ads</h1>
      </div>

      <div className="system-device-wrap" ref={wrapRef}>
        <div className="system-scene-wrap" aria-hidden="true">
          <div className="system-desktop" style={{ "--s": scale } as React.CSSProperties}>

            {/* SYSTEM DOCK */}
            <div className={`system-dock ${dockBounce ? "system-dock-bounce" : ""}`} style={{ pointerEvents: "auto" }}>
              <div className="system-dock-item" style={{ transform: dockBounce ? "translateY(-8px)" : "translateY(0)", pointerEvents: "auto" }}>
                <Tooltip label="Beyond Search">
                  <BotMark size={40} />
                </Tooltip>
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-white" />
              </div>
              <div className="system-dock-item" style={{ pointerEvents: "auto" }}>
                <Tooltip label="Claude">
                  <img src="/icons/brands/claude.svg" alt="Claude" className="h-[34px] w-[34px] rounded-[9px]" />
                </Tooltip>
              </div>
              <div className="system-dock-item" style={{ pointerEvents: "auto" }}>
                <Tooltip label="ChatGPT">
                  <img src="/dock/chatgpt.svg" alt="ChatGPT" className="h-[34px] w-[34px] rounded-[9px]" />
                </Tooltip>
              </div>
              <div className="system-dock-item" style={{ pointerEvents: "auto" }}>
                <Tooltip label="Chrome">
                  <img src="/images/marketing/desktop/dock/chrome.svg" alt="Chrome" className="h-[34px] w-[34px] rounded-[9px]" />
                </Tooltip>
              </div>
              <div className="system-dock-divider" aria-hidden="true" />
              <div className="system-dock-item" style={{ pointerEvents: "auto" }}>
                <Tooltip label="Trash">
                  <img src="/images/marketing/desktop/dock/trash.png" alt="Trash" className="h-[34px] w-[34px]" />
                </Tooltip>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Three lucid feature icons showcasing app capabilities */}
      <div className="system-points">
        {POINTS.map((p, i) => (
          <React.Fragment key={p.label}>
            <div className="system-point">
            <div className="system-point-icon">
              <p.icon size={32} strokeWidth={1.75} color="#5b6070" />
            </div>
              <div className="system-point-text">
                <p className="system-point-label">{p.label}</p>
                <p className="system-point-desc">{p.description}</p>
              </div>
            </div>
            {i < POINTS.length - 1 && <div className="system-divider" />}
          </React.Fragment>
        ))}
      </div>

    </section>
  );
}
