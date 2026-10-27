export interface StarMask {
    left: number;
    top: number;
    width: number;
    height: number;
    radius: number;
    padding: number;
}

const SELECTOR = '[data-as-star-mask]';
const FADE_DISTANCE = 12;

/** Measure painted surfaces and individual text lines, never a text container's empty space. */
export function measureStarMasks(landing: HTMLElement): StarMask[] {
    const masks: StarMask[] = [];
    for (const node of landing.querySelectorAll<HTMLElement>(SELECTOR)) {
        if (node.parentElement?.closest('[data-as-star-mask="surface"]'))
            continue;
        if (node.dataset.asStarMask === 'surface') {
            const rect = node.getBoundingClientRect();
            if (!rect.width || !rect.height) continue;
            const value = getComputedStyle(node).borderTopLeftRadius;
            const radius =
                (parseFloat(value) || 0) *
                (value.endsWith('%')
                    ? Math.min(rect.width, rect.height) / 100
                    : 1);
            masks.push({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                radius: Math.min(radius, rect.width / 2, rect.height / 2),
                padding: 0,
            });
            continue;
        }
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        let text: Node | null;
        while ((text = walker.nextNode())) {
            const content = text.textContent || '';
            const start = content.search(/\S/);
            if (start < 0 || text.parentElement?.closest(SELECTOR) !== node)
                continue;
            const closed = text.parentElement?.closest('details:not([open])');
            if (closed && !closed.querySelector('summary')?.contains(text))
                continue;
            if (
                text.parentElement &&
                getComputedStyle(text.parentElement).visibility === 'hidden'
            )
                continue;
            range.setStart(text, start);
            range.setEnd(text, content.trimEnd().length);
            for (const rect of range.getClientRects()) {
                if (!rect.width || !rect.height) continue;
                masks.push({
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    radius: 0,
                    padding: 2,
                });
            }
        }
    }
    return masks;
}

/** Fade the whole sprite before it touches content, including around rounded corners. */
export function starMaskOpacity(
    x: number,
    y: number,
    starRadius: number,
    masks: readonly StarMask[],
): number {
    let opacity = 1;
    for (const mask of masks) {
        const margin = starRadius + mask.padding + FADE_DISTANCE;
        if (
            x < mask.left - margin ||
            x > mask.left + mask.width + margin ||
            y < mask.top - margin ||
            y > mask.top + mask.height + margin
        )
            continue;
        const qx =
            Math.abs(x - mask.left - mask.width / 2) -
            mask.width / 2 +
            mask.radius;
        const qy =
            Math.abs(y - mask.top - mask.height / 2) -
            mask.height / 2 +
            mask.radius;
        const distance =
            Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
            Math.min(Math.max(qx, qy), 0) -
            mask.radius -
            starRadius -
            mask.padding;
        if (distance <= 0) return 0;
        const progress = Math.min(1, distance / FADE_DISTANCE);
        opacity = Math.min(opacity, progress * progress * (3 - 2 * progress));
    }
    return opacity;
}
