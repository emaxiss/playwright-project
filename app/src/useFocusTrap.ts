import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/** Registered traps in mount order, so the newest one wins. */
const openTraps: HTMLElement[] = [];

function topmostTrap(): HTMLElement | undefined {
  return openTraps[openTraps.length - 1];
}

/**
 * Keeps keyboard focus inside a modal container while it is open. Without this
 * an aria-modal element still lets Tab walk the page behind it, which
 * contradicts what the role promises to assistive technology.
 *
 * Restoring focus on close is left to the caller, which knows which element
 * opened the modal and when it has finished re-rendering.
 */
export function useFocusTrap<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    openTraps.push(container);
    // offsetParent is null inside position: fixed containers, so measure the
    // rendered box instead to tell a hidden control from a visible one
    const focusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      );

    focusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      // several modals can be open at once (the delete dialog sits above the
      // task panel), so only the topmost one reacts
      if (container !== topmostTrap()) return;

      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;

      // WebKit leaves buttons out of the tab order by default, so the native
      // sequence would step straight past the panel. Moving focus here keeps
      // every engine on the same cycle.
      const active = document.activeElement as HTMLElement | null;
      const current = items.findIndex((el) => el === active);
      const step = event.shiftKey ? -1 : 1;
      const next =
        current === -1
          ? items[0]
          : items[(current + step + items.length) % items.length];

      event.preventDefault();
      next.focus();
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      const index = openTraps.indexOf(container);
      if (index !== -1) openTraps.splice(index, 1);
    };
  }, [onClose]);

  return ref;
}
