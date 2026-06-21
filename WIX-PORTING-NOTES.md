# Wright Media — Phase 1 Prototype & Wix Porting Notes

A self-contained, responsive, mobile-first prototype. No build step — open `index.html`
through any static server. Two pages: `index.html` (homepage) + `gallery.html` (portfolio).

## Run the preview
```bash
cd site
python3 -m http.server 8124
# open http://localhost:8124/index.html
```

## What's in the box
```
site/
  index.html              # homepage (sections 1–9)
  gallery.html            # portfolio gallery (Ref 3.5) — 43 images + lightbox
  assets/
    css/styles.css        # shared design system + homepage
    css/gallery.css       # gallery + lightbox
    js/main.js            # carousel (2 variations), nav, marquee, reveal, form
    js/gallery.js         # masonry load-in + lightbox
    img/carousel/*        # 10 carousel images (optimized)
    img/gallery/*         # 43 gallery images (optimized, ≤1600px)
    img/about.png, logo.png
    video/hero.mp4|webm + hero-poster.jpg     # 4K→1920px, 200MB→19MB, muted
    video/reel.mp4|webm + reel-poster.jpg     # 4K→1080px vertical, 313MB→35MB
```

## Brand decisions locked in
- Contact email: **W@wrightmediaofficial.com** (corrected domain typo, per your confirmation).
- Phone: (561) 676-2130. Areas: Palm Beach County · Wellington · Boynton Beach · Boca Raton · South Florida.
- Testimonials use the 3 real clients verbatim attribution (Judge M./Sotheby's, Barry G./Douglas Elliman, Anna S./MarineMax). The quote *text* is written in-brand — **swap for the real quotes if you have them.**
- "Have a blessed day." sign-off appears in About + footer.

---

## Per-section Wix porting plan

Legend: **Native** = build with standard Wix editor elements · **Embed** = Wix "Embed HTML"
(iframe/inline) component · **Custom Element** = Wix Custom Element (registers a web component) ·
**Velo** = needs Velo code/backend.

| # | Section | Recommended Wix approach | Notes / flags |
|---|---------|--------------------------|---------------|
| — | **Nav / header** | **Native** (Wix site header + menu) | Use a transparent-on-hero header that turns solid on scroll (native scroll setting). Logo: upload white version or use Wix color overlay. |
| 1 | **Hero video** | **Native** Wix Video Box **or** Embed | Upload `hero.mp4`/`.webm` + `hero-poster.jpg` to Wix Media. Native Video Box supports autoplay-muted-loop full-bleed. If Wix's player adds chrome you don't want, use an HTML Embed with the `<video>` tag from the prototype. |
| 2 | **Description band** | **Native** | Plain text section. Use a serif Wix font (e.g. Cormorant). Trivial. |
| 3 | **Carousel (2 variations)** | **Custom Element** (recommended) or Embed | Wix Pro Gallery / Slideshow can do auto-advance + crossfade natively and is the lowest-maintenance option — **decide A vs B first**, then I'll configure one. For the exact Ken-Burns drift + crossfade timing in the prototype, port as a Custom Element wrapping `main.js`'s carousel. **Flag:** pick one variation before porting. |
| 3.5 | **Portfolio button** | **Native** | Standard button linking to the Gallery page. |
| 4 | **Vertical reel in phone** | **Embed** (recommended) or Custom Element | The phone frame is pure CSS. Easiest: one HTML Embed containing the `.phone` markup + `<video>`. Upload `reel.*` + poster to Wix Media and point the embed at those URLs. |
| 5 | **Testimonials** | **Native** (Wix Pro Gallery or repeater) | Three cards — native repeater/Pro Gallery testimonial layout. Or Embed the static markup. No Velo needed. |
| 6 | **Brand list marquee** | **Custom Element** or Embed | Wix has no native infinite-marquee. Port the `.marquee` markup as an Embed/Custom Element. **Flag:** logos are placeholders — replace `.brandph` spans with `<img>` once real logos arrive (sized ~180×60). |
| 7 | **About** | **Native** | Image (`about.png`) + text columns. Native two-column strip. The About.png already contains the full styled copy, so you can also just place it as a single image on mobile. |
| — | **Services list** | **Native** | 5-item row/repeater. Trivial. |
| 8 | **Contact form** | **Native** (Wix Forms) — **Velo optional** | Use Wix Forms (native submissions → Wix inbox/email). Style to match split layout. **Velo flag:** only needed if you want custom routing (e.g. send to W@wrightmediaofficial.com + autoresponder "Have a blessed day."). The prototype form is front-end only (no backend). |
| 9 | **Footer** | **Native** | Wix footer: menu, areas, socials, copyright. Trivial. |
| — | **Gallery page** | **Native** (Wix Pro Gallery) — recommended | Wix Pro Gallery "Masonry" layout + built-in expand/lightbox matches Ref 3.5 and gives lazy-loading for free. Upload the 43 images. If you want the exact prototype hover/lightbox feel, port as Custom Element instead. |

### Summary of what needs special handling
- **Velo:** only the contact form, and only if you want custom email routing/autoresponder. Everything else is Native/Embed/Custom Element.
- **Custom Elements / Embeds:** carousel (if not using Pro Gallery), reel phone frame, brand marquee.
- **Decisions needed before porting:** (a) carousel variation A or B; (b) real testimonial quote text; (c) real partner logos; (d) confirm Native Wix galleries vs. exact-prototype custom elements where both are offered.

## Media handling done
- Both `.mov` files transcoded with ffmpeg to web `.mp4` (H.264) **and** `.webm` (VP9), heavily
  compressed, each with a poster frame. Hero is muted/looped/autoplay/playsinline; reel same.
- Carousel + gallery JPEGs downscaled/recompressed for fast load.

## Known follow-ups (not blockers)
- Hero (19MB) / reel (35MB) are fine behind posters but could get smaller mobile-specific renditions if you want sub-10MB on cellular.
- Social links in the footer are placeholders (`#`) — add real Instagram/Facebook/YouTube URLs.
