import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

export interface PickerProps {
    id: string;
    name: string;
    label: string;
    labelId: string;
    value: string;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

interface Rect {
    left: number;
    top: number;
    bottom: number;
    width: number;
}
interface Viewport {
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface PopoverPosition {
    left: number;
    top: number;
    width: number;
    maxHeight: number;
    placement: 'top' | 'bottom';
}

export function placeFieldPopover(
    anchor: Rect,
    viewport: Viewport,
    height: number,
    preferredWidth = anchor.width,
    topLimit = viewport.top,
): PopoverPosition {
    const edge = 8,
        gap = 6;
    const minTop = Math.max(viewport.top + edge, topLimit);
    const bottom = viewport.top + viewport.height - edge;
    const below = Math.max(0, bottom - anchor.bottom - gap);
    const above = Math.max(0, anchor.top - gap - minTop);
    const placement =
        below >= height
            ? 'bottom'
            : above >= height
              ? 'top'
              : below >= above
                ? 'bottom'
                : 'top';
    const maxHeight = Math.min(height, placement === 'bottom' ? below : above);
    const width = Math.min(
        preferredWidth,
        Math.max(0, viewport.width - edge * 2),
    );
    return {
        placement,
        maxHeight,
        width,
        left: Math.max(
            viewport.left + edge,
            Math.min(
                anchor.left,
                viewport.left + viewport.width - edge - width,
            ),
        ),
        top:
            placement === 'bottom'
                ? Math.max(
                      minTop,
                      Math.min(anchor.bottom + gap, bottom - maxHeight),
                  )
                : Math.max(minTop, anchor.top - gap - maxHeight),
    };
}

export function useFieldPopover<T extends HTMLElement>(
    disabled: boolean | undefined,
    preferredHeight: number,
    preferredWidth?: number,
) {
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<T>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<PopoverPosition | null>(null);
    const close = useCallback((restoreFocus = false) => {
        setOpen(false);
        setPosition(null);
        if (restoreFocus) triggerRef.current?.focus();
    }, []);
    const measure = useCallback(() => {
        const trigger = triggerRef.current;
        if (!trigger) return;
        const visual = window.visualViewport;
        const viewport = {
            left: visual?.offsetLeft || 0,
            top: visual?.offsetTop || 0,
            width: visual?.width || window.innerWidth,
            height: visual?.height || window.innerHeight,
        };
        const header = trigger.closest('.astrascend')?.querySelector('header');
        const contentHeight = popupRef.current?.scrollHeight;
        // scrollHeight excludes borders; leave room for them and fractional-pixel rounding.
        const height = Math.min(
            contentHeight ? contentHeight + 3 : preferredHeight,
            preferredHeight,
        );
        const next = placeFieldPopover(
            trigger.getBoundingClientRect(),
            viewport,
            height,
            preferredWidth,
            Math.max(
                viewport.top + 8,
                (header?.getBoundingClientRect().bottom || 0) + 8,
            ),
        );
        setPosition((previous) =>
            previous &&
            Object.keys(next).every(
                (key) =>
                    previous[key as keyof PopoverPosition] ===
                    next[key as keyof PopoverPosition],
            )
                ? previous
                : next,
        );
    }, [preferredHeight, preferredWidth]);
    const show = () => {
        if (!disabled) {
            measure();
            setOpen(true);
        }
    };
    useEffect(() => {
        if (disabled) close();
    }, [disabled, close]);
    useLayoutEffect(() => {
        if (!open) return;
        const inside = (target: EventTarget | null) =>
            target instanceof Node && rootRef.current?.contains(target);
        const outside = (event: Event) => {
            if (!inside(event.target)) close();
        };
        const scroll = (event: Event) => {
            if (
                !(event.target instanceof Node) ||
                !popupRef.current?.contains(event.target)
            )
                close();
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                close(true);
            }
        };
        measure();
        const observer =
            typeof ResizeObserver === 'function'
                ? new ResizeObserver(measure)
                : null;
        if (popupRef.current) observer?.observe(popupRef.current);
        document.addEventListener('pointerdown', outside, true);
        document.addEventListener('click', outside, true);
        document.addEventListener('focusin', outside);
        document.addEventListener('keydown', escape);
        window.addEventListener('scroll', scroll, {
            capture: true,
            passive: true,
        });
        document.addEventListener('wheel', scroll, {
            capture: true,
            passive: true,
        });
        document.addEventListener('touchmove', scroll, {
            capture: true,
            passive: true,
        });
        window.addEventListener('resize', measure);
        window.visualViewport?.addEventListener('resize', measure);
        window.visualViewport?.addEventListener('scroll', scroll);
        return () => {
            observer?.disconnect();
            document.removeEventListener('pointerdown', outside, true);
            document.removeEventListener('click', outside, true);
            document.removeEventListener('focusin', outside);
            document.removeEventListener('keydown', escape);
            window.removeEventListener('scroll', scroll, true);
            document.removeEventListener('wheel', scroll, true);
            document.removeEventListener('touchmove', scroll, true);
            window.removeEventListener('resize', measure);
            window.visualViewport?.removeEventListener('resize', measure);
            window.visualViewport?.removeEventListener('scroll', scroll);
        };
    }, [open, close, measure]);
    return { rootRef, triggerRef, popupRef, open, position, show, close };
}
