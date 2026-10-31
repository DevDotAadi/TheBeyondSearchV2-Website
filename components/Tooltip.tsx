"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type ReactElement,
} from "react";

const HOVER_DELAY = 150;
const VIEWPORT_MARGIN = 8;

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type TooltipProps = {
  label: string;
  children: ReactElement;
};

type TooltipStyle = CSSProperties & {
  "--tooltip-shift": string;
};

function supportsFocusVisible(element: HTMLElement) {
  try {
    return element.matches(":focus-visible");
  } catch {
    return true;
  }
}

export function Tooltip({ label, children }: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [shift, setShift] = useState(0);

  const visible = canHover && !dismissed && (hovered || focusVisible);
  const child = children as ReactElement<{ "aria-describedby"?: string }>;
  const describedBy = [child.props["aria-describedby"], id].filter(Boolean).join(" ");

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    return () => clearHoverTimer();
  }, [clearHoverTimer]);

  useEffect(() => {
    if (!visible) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      clearHoverTimer();
      setDismissed(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, clearHoverTimer]);

  useIsomorphicLayoutEffect(() => {
    if (!visible) return;

    function updateShift() {
      const anchor = anchorRef.current;
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip) return;

      const rect = anchor.getBoundingClientRect();
      const width = tooltip.offsetWidth;
      const center = rect.left + rect.width / 2;
      const minCenter = VIEWPORT_MARGIN + width / 2;
      const maxCenter = window.innerWidth - VIEWPORT_MARGIN - width / 2;
      const clampedCenter = Math.min(Math.max(center, minCenter), maxCenter);

      setShift(clampedCenter - center);
    }

    updateShift();
    window.addEventListener("resize", updateShift);
    return () => window.removeEventListener("resize", updateShift);
  }, [visible, label]);

  function handleMouseEnter() {
    if (!canHover) return;

    clearHoverTimer();
    setDismissed(false);
    hoverTimerRef.current = setTimeout(() => {
      hoverTimerRef.current = null;
      setHovered(true);
    }, HOVER_DELAY);
  }

  function handleMouseLeave() {
    clearHoverTimer();
    setHovered(false);
  }

  function handleFocus(event: FocusEvent<HTMLSpanElement>) {
    const target = event.target as HTMLElement;
    if (!supportsFocusVisible(target)) return;

    clearHoverTimer();
    setDismissed(false);
    setFocusVisible(true);
  }

  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;

    setFocusVisible(false);
  }

  const shiftStyle: TooltipStyle = {
    "--tooltip-shift": `${shift}px`,
  };

  return (
    <span
      ref={anchorRef}
      className="tooltip-anchor"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {cloneElement(child, { "aria-describedby": describedBy })}
      <span
        ref={tooltipRef}
        id={id}
        role="tooltip"
        className="tooltip"
        data-visible={visible}
        style={shiftStyle}
      >
        {label}
        <span className="tooltip-arrow" aria-hidden="true" />
      </span>
    </span>
  );
}
