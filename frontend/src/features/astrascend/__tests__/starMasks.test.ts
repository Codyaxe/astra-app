import { afterEach, describe, expect, it, vi } from 'vitest';
import { measureStarMasks, starMaskOpacity, type StarMask } from '../starMasks';

afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
});

function landing(markup: string) {
    const root = document.createElement('div');
    root.innerHTML = markup;
    document.body.append(root);
    return root;
}

function textRects(lines: Record<string, number[][]>) {
    vi.spyOn(document, 'createRange').mockImplementation(() => {
        let node: Node;
        return {
            setStart: (next: Node) => {
                node = next;
            },
            setEnd: () => {},
            getClientRects: () =>
                (lines[node.textContent?.trim() || ''] || []).map(
                    ([x, y, width, height]) => new DOMRect(x, y, width, height),
                ),
        } as unknown as Range;
    });
}

describe('star content masks', () => {
    it('leaves empty space beside headings and between text blocks visible', () => {
        const root = landing(
            '<div data-as-star-mask><h1>Heading</h1><p>Introduction</p></div>',
        );
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockReturnValue(new DOMRect(0, 0, 1000, 300));
        textRects({
            Heading: [[20, 30, 120, 24]],
            Introduction: [[20, 90, 300, 20]],
        });
        const masks = measureStarMasks(root);
        expect(masks).toHaveLength(2);
        expect(starMaskOpacity(800, 40, 2, masks)).toBe(1);
        expect(starMaskOpacity(50, 70, 2, masks)).toBe(1);
        expect(starMaskOpacity(50, 40, 2, masks)).toBe(0);
    });
    it('measures each wrapped line rather than the paragraph rectangle', () => {
        const root = landing('<p data-as-star-mask>A wrapped paragraph</p>');
        textRects({
            'A wrapped paragraph': [
                [20, 30, 400, 20],
                [20, 60, 80, 20],
            ],
        });
        const masks = measureStarMasks(root);
        expect(masks.map((mask) => mask.width)).toEqual([400, 80]);
        expect(starMaskOpacity(300, 70, 2, masks)).toBe(1);
        expect(starMaskOpacity(50, 70, 2, masks)).toBe(0);
    });
    it('does not duplicate nested text masks or measure text inside an opaque surface', () => {
        const root = landing(
            '<div data-as-star-mask><h2 data-as-star-mask>Heading</h2>   <article data-as-star-mask="surface" style="border-top-left-radius:9999px"><p data-as-star-mask>Card copy</p></article></div>',
        );
        textRects({
            Heading: [[20, 30, 120, 24]],
            'Card copy': [[220, 30, 50, 20]],
        });
        vi.spyOn(
            HTMLElement.prototype,
            'getBoundingClientRect',
        ).mockReturnValue(new DOMRect(200, 20, 100, 30));
        const masks = measureStarMasks(root);
        expect(masks).toHaveLength(2);
        expect(masks[1]).toEqual({
            left: 200,
            top: 20,
            width: 100,
            height: 30,
            radius: 15,
            padding: 0,
        });
    });
    it('excludes collapsed FAQ answers and includes them when expanded', () => {
        const root = landing(
            '<div data-as-star-mask><details><summary>Question</summary><p>Answer</p></details></div>',
        );
        textRects({
            Question: [[20, 30, 100, 20]],
            Answer: [[20, 60, 200, 20]],
        });
        expect(measureStarMasks(root)).toHaveLength(1);
        root.querySelector('details')!.open = true;
        expect(measureStarMasks(root)).toHaveLength(2);
    });
    it('keeps stars visible outside rounded corners while protecting the card surface', () => {
        const masks: StarMask[] = [
            {
                left: 100,
                top: 100,
                width: 100,
                height: 100,
                radius: 50,
                padding: 0,
            },
        ];
        expect(starMaskOpacity(100, 100, 1, masks)).toBe(1);
        expect(starMaskOpacity(150, 100, 1, masks)).toBe(0);
        expect(starMaskOpacity(150, 94, 1, masks)).toBeGreaterThan(0);
        expect(starMaskOpacity(150, 94, 1, masks)).toBeLessThan(1);
    });
    it('fades smoothly before reaching content instead of cutting off the sprite', () => {
        const masks: StarMask[] = [
            {
                left: 100,
                top: 100,
                width: 100,
                height: 50,
                radius: 12,
                padding: 0,
            },
        ];
        const values = Array.from({ length: 13 }, (_, index) =>
            starMaskOpacity(150, 86 + index, 2, masks),
        );
        expect(values[0]).toBe(1);
        expect(values[values.length - 1]).toBe(0);
        for (let index = 1; index < values.length; index++) {
            expect(values[index - 1] - values[index]).toBeGreaterThanOrEqual(0);
            expect(values[index - 1] - values[index]).toBeLessThan(0.13);
        }
        expect(starMaskOpacity(150, 90, 8, masks)).toBeLessThan(
            starMaskOpacity(150, 90, 2, masks),
        );
    });
});
