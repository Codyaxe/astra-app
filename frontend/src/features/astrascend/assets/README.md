# Local design assets

The mascot and two wave SVGs are original exports from the approved Figma file `Z2zNPg97xTtORcfbtQk05t` (home frames `22:331` and `38:56`). The mascot uses the design's crop inside an overflow container. SVG roots and artwork are unmodified.

The blue mark, white mark, and white wordmark are unmodified copies supplied by the owner from `astra-branding`: `Shape 4 copy 2.png`, `Shape 4.png`, and `astra-wordmark-logo.png`, respectively. They replace the Figma-exported logo marks. The header uses the blue mark on light backgrounds and the white mark on dark backgrounds; the footer uses the white mark. Both pair the mark with live text that imitates the original wordmark's bold “ASTRA” and lighter “Developers” lettering. The complete white wordmark image is retained as the typography reference.

Urbanist weights 400, 500, 600, and 700 are self-hosted Google Fonts files. See `Urbanist-OFL.txt` for the font license. The CSS family name is feature-specific; it does not change the member app typography.

The dark hero glow and star field are unmodified Figma exports. `starMotion.ts` records the 69 star rectangles from frame `38:73`; the canvas draws each sprite directly from the original SVG, with separate depth and twinkle timing. Mobile uses 35 of these stars. The same canvas spans all dark landing sections and masks text and cards; request pages do not mount it.
