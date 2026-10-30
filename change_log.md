# CraftVeda Project Change Log

## [Storefront Typography & Positioning: Match Bento Grid Titles to Admin Preview] - 2026-10-30
### Enhanced in `index.html` & `change_log.md`
- **Matched Bento Grid Main Artwork Title Typography & Positioning**:
  - Identified the source of truth for the main artwork title in `admin-index.html`:
    - Selector: `.bt-tile-title`
    - Font Family: `'Playfair Display', Georgia, serif` (already loaded via Google Fonts)
    - Font Weight: `700` (bold, elegant serif)
    - Contrast Vignette: Applied Admin Preview's rich gradient overlay `.bt:before` (`linear-gradient(to top, rgba(10, 22, 38, .88) 0%, rgba(10, 22, 38, .25) 55%, rgba(10, 22, 38, .45) 100%)`)
  - **Repositioned to Bottom Half & Centered**:
    - Replaced the bottom-left corner alignment with centered positioning (`text-align: center; left: 16px; right: 16px; margin: 0 auto;`).
    - Positioned in the lower half of the card, elevated above the bottom edge (`bottom: 22px;`).
    - Configured constrained width (`max-width: 180px;`) so two-word titles ("Charcoal Sketch", "Pencil Sketch", "Textured Art", "Abstract Art", "Custom Art") naturally wrap into two centered lines, matching the Admin Preview appearance.
    - Single-word titles ("Vastu", "Nature", "Religious") remain prominent and centered on a single line.
  - **Responsive Scaling**:
    - Desktop: `23px` bold with `max-width: 180px; bottom: 22px;`
    - Tablet (`<= 900px`): `20px` bold with `max-width: 160px; bottom: 18px;`
    - Mobile (`<= 540px`): `17px` bold with `max-width: 140px; bottom: 14px;`

## [Bento Real Images Sync & Local Testing Draft Environment] - 2026-10-30
### Enhanced in `settings.json`, `admin-index.html`, `draft/index.html` & `change_log.md`
- **Restored Real Bento Grid Images in Admin Preview**:
  - Identified that Bento tiles #1 (Charcoal Sketch), #2 (Textured Art), #3 (Vastu), #5 (Abstract Art), and #7 (Religious) in `settings.json` were referencing non-existent placeholder paths (`images/bento/...`), causing them to 404 and fall back to SVG placeholder gradients.
  - Synced all Bento tile image paths in `settings.json` to the real artwork cover images from `index.html` that exist on disk:
    - Charcoal Sketch: `images/moonlit-ocean-textured-art-1-mve6abow.jpg`
    - Textured Art: `images/sacred-ghats-textured-art-1-mvcvio9x.jpg`
    - Vastu: `images/golden-horizon-sunset-textured-art-1-mve5rwrq.jpg`
    - Nature: `images/golden-moon-owls-textured-art-1-mve4ry4e.jpg`
    - Abstract Art: `images/earth-tones-cracked-texture-art-1-mve5xasd.jpg`
    - Pencil Sketch: `images/serene-buddha-textured-art-1-mve4poic.jpg`
    - Religious: `images/himalayan-sunset-textured-art-1-mvcum37v.jpg`
    - Custom Art: `images/ram-sita-watercolor-art-1-mvcvdlzc.jpg`
  - Added `healBentoImages()` in `admin-index.html` to automatically heal any obsolete `images/bento/` paths in browser `localStorage` or loaded settings to the canonical storefront images.
  - Upgraded `autoMatchTileImage()` and `onerror` image handlers to gracefully fall back to canonical default images or catalog artworks instead of jumping straight to SVG placeholders.
- **Created Offline UI Testing Sandbox in `draft/`**:
  - Created `draft/index.html` and `draft/admin-draft.html` replicating the full CraftVeda Admin UI.
  - Completely skipped login and authentication logic: `#login` is hidden and `#app` renders immediately upon load.
  - Set `<base href="../">` so all relative resources (artworks, images, fonts, styles) resolve directly against the project root.
  - Direct local loading of `products.json`, `settings.json`, and `templates.json` with browser `localStorage` persistence (`cv_draft_products` and `cv_settings`) for safe, isolated UI experimentation without committing to Git or needing backend proxies.
  - Added a "Reset Draft" button to instantly restore original catalog and settings states.

## [Admin Bugfix & UI Refinement: Bento Add Freeze Resolution, Tile Rename Input, Palette-Native Toast & Cache Invalidation] - 2026-10-30
### Fixed & Enhanced in `admin-index.html`, `functions/api/gh/[[path]].js` & `change_log.md`
- **Fixed Bento Tile Add UI Freeze**:
  - Identified and resolved a runtime `ReferenceError: ph is not defined` when adding a new Bento tile. Added the missing SVG placeholder generator (`ph`) directly into `admin-index.html`.
  - Added immediate visual `render()` upon clicking `+ Add Tile` prior to awaiting `saveSettings()`, ensuring the new card renders instantly in the grid with zero freeze or delay.
  - Implemented robust multi-tiered image fallback in `autoMatchTileImage()` to ensure safe image assignment without uncaught exceptions.
- **Dedicated Bento Tile Display Name Input**:
  - Added an interactive "Card Display Name" text input (`#bento-title-in`) in the Bento inspector.
  - Users can now freely customize and edit the title of any tile in real time, with instant live grid preview updates and automated background persistence on change.
- **Bento Settings Freshness & Cache-Busting**:
  - Added cache-busting timestamp (`&t=${Date.now()}`) and `cache: "no-store"` header to GitHub API proxy requests in `functions/api/gh/[[path]].js`.
  - Ensures deployed updates to `settings.json` are immediately fetched by the admin dashboard on reload or sync without stale 60-second CDN caching.
  - Added `localStorage` fallback hydration in `bentoView()` to ensure current session state is preserved even if network revalidation is in-flight.
- **Strict Native Color Palette for 3-Second Floating Toast**:
  - Removed all arbitrary and foreign color codes (`#0F172A`, `#22C55E`, `#EF4444`, `#38BDF8`), binding toast styling strictly to CraftVeda's established design tokens:
    - Background: `var(--navy)` (`#0F2740`)
    - Error Card: `var(--bad)` (`#B3261E`)
    - Success Countdown Line: `var(--ok)` (`#1B7F4B`)
    - Busy / Loading Line: `var(--cu)` (`#B5654A`)
    - Shadows & Radii: `var(--shadow-lg)` and `var(--radius)`
    - Clean white high-contrast text and icons (`#FFFFFF`).
  - Removed close/cancel buttons (`×`), allowing toasts to automatically and cleanly self-dismiss within 3 seconds as the visual countdown line completes.

## [UI/UX Upgrade: Top-Right Floating 3-Sec Toast with Countdown Progress Line] - 2026-10-30
### Enhanced in `admin-index.html` & `change_log.md`
- **Repositioned to Top-Right**:
  - Moved admin notifications from bottom-center to the standard top-right viewport corner (`top: 24px; right: 24px;`).
- **3-Second Auto-Dismissal with Visual Countdown Line**:
  - Embedded an animated progress bar line at the base of the notification card that smoothly depletes from 100% to 0% width over exactly 3 seconds, showing the real-time disappearance countdown.
  - Hovering over the notification card pauses both the progress bar animation and the dismiss timer, resuming automatically on mouse leave.
  - Added an integrated close button (`×`) for instant manual dismissal.
- **Enhanced Visual States & Micro-Interactions**:
  - Distinct visual styling and SVG icons for success (emerald checkmark), error (red alert badge), and ongoing async operations (spinning loader with pulsing status bar).
  - Smooth slide-in and slide-out micro-animations (`toastSlideIn` / `toastSlideOut`).


## [Admin Feature: Seamless Category/Theme Bento Tile Creation & Automatic Sync] - 2026-10-30
### Enhanced in `admin-index.html`, `index.html` & `change_log.md`
- **Eliminated JavaScript `prompt()` Dialog for Bento Tile Addition**:
  - Replaced browser `prompt()` popup with automated Category/Theme tile assignment (`getNextBentoTarget()`).
  - New tiles are automatically named after available unassigned Categories (`CATS`) or Themes (`THEMES`) like existing tiles, with zero manual typing required.
  - Automatically matches and sets a cover image from the catalog (`autoMatchTileImage`) for the selected Category or Theme.
  - Automatically balances layout shapes (`getBalancedTileShape`) across Laptop, Tablet, and Mobile to maintain alternating tall/short column harmony.
- **Automatic Layout & Persistence Sync on Add/Remove/Update**:
  - Automatically calls `saveSettings(...)` upon adding or deleting a Bento tile, persisting changes immediately to `localStorage` and GitHub (`settings.json`).
  - Added automatic image matching and instant auto-save when switching Category/Theme in the Inspector dropdown (`#bento-target-select`).
  - Updated tile deletion to automatically modify layout, adjust selection, and save without requiring a manual save button click.
- **Dynamic Grid Column Expansion**:
  - Storefront (`index.html`) and live admin preview (`admin-index.html`) now dynamically scale their grid columns (`repeat(${cols.length}, 1fr)`) to cleanly accommodate any number of columns (3, 4, 5, 6+) without wrapping or layout breakages.


## [Admin Feature: Automated Image Deletion on Artwork Removal & Updates] - 2026-10-30
### Enhanced in `admin-index.html`, `functions/api/gh/[[path]].js` & `change_log.md`
- **Synchronous & Reliable Artwork Image Deletion**:
  - Implemented `deleteArtworkImages(images, excludeArtworkId)` and improved `delImage(path)` with:
    - Path normalization (automatic handling of prefixes and slashes).
    - Cache-busting queries (`&t=Date.now()`) when retrieving file commit SHAs.
    - Automatic 3-attempt retry loop with backoff on HTTP 409 / 422 Git commit conflicts.
    - Real-time progress indicators (`busy("Removing image X of Y...")`) and warnings on failure instead of silent swallowing.
- **Sequential Deletion on Single Artwork Delete**:
  - Replaced unawaited parallel `.forEach()` calls in `rows()` with sequential `await deleteArtworkImages(toDeleteImages, id)`, preventing race conditions on GitHub branch refs.
- **Bulk Artwork Delete Image Cleanup**:
  - Added full image cleanup to `#bulk-del-btn`, ensuring that when artworks are bulk-deleted, all associated images across every selected product are deleted from the repository with progress updates.
- **Edit Modal Image Replacement Cleanup**:
  - Added automatic detection and cleanup of obsolete images in `form(it)`. When an artwork is edited and any image slot is replaced or removed, the previous orphaned images are automatically deleted from the repository.
- **Shared Image Guardrail (`isImageInUse`)**:
  - Added a reference check ensuring images still in use by other artworks or Bento grid tiles are never deleted.
- **Cloudflare Pages API Proxy Subpath Support (`functions/api/gh/[[path]].js`)**:
  - Updated image route regex to support nested directories (such as `images/bento/*`) alongside root `images/*`.


## [Maintenance: Cleanup of Orphaned and Unused Images] - 2026-10-29
### Cleaned up in `images/` & `change_log.md`
- **Orphaned Media Pruning & Repository Optimization**:
  - Removed 19 unreferenced and orphaned image files totaling ~3.64 MB from `images/`:
    - **Deleted Artworks & Test Entries**:
      - `ganesha-lotus-art-1-mvcx69f8.jpg`, `ganesha-lotus-art-2-mvcx6c6o.jpg`, `ganesha-lotus-art-3-mvcx6epz.jpg` (left behind after artwork removal)
      - `radha-krishna-art-work-1-mv9wczvz.jpg`, `radha-krishna-art-work-2-mv9wd21t.jpg` (left behind after product deletion)
      - `sacred-ganesh-spiral-in-terracotta-and-f-1-mvo343k6.jpg`, `sacred-ganesh-spiral-in-terracotta-and-f-2-mvo345yp.jpg`, `sacred-ganesh-spiral-in-terracotta-and-f-3-mvo34836.jpg` (left behind from admin bulk deletion)
      - `sdf-1-mvo0hcns.jpg`, `sdf-2-mvo0hepm.jpg`, `sdf-3-mvo0hgrc.jpg` (test items bulk-deleted from catalog)
      - `zdbgb-3-mvlcpmye.jpg` (test item deleted from catalog)
    - **Replaced Artwork Photo Uploads**:
      - `golden-mountain-dawn-textured-art-1-mve34l2z.jpg`, `golden-mountain-dawn-textured-art-2-mve34n7f.jpg`, `golden-mountain-dawn-textured-art-3-mve34p4u.jpg` (superseded by updated photos)
      - `moonlit-ocean-textured-art-1-mve69kke.jpg` (superseded by updated slot 1 photo)
      - `urban-rhythm-abstract-art-work-1-mvo572ns.jpg`, `urban-rhythm-abstract-art-work-2-mvo57502.jpg`, `urban-rhythm-abstract-art-work-3-mvo57715.jpg` (superseded by updated photos)
  - Verified 0 broken references across `products.json`, `settings.json`, `templates.json`, `index.html`, and `admin-index.html`.


## [Navigation: Auto-Hide Dropdown Menus & Chevron Arrows When Themes Are Removed] - 2026-10-20
### Enhanced in `index.html` & `change_log.md`
- **Automatic Arrow & Dropdown Toggle**:
  - Added `syncDropdown(dm)` helper in JavaScript to inspect whether any category dropdown has links.
  - If all themes are removed from a category (e.g. `THEMES["Religious"]` or `THEMES["Custom Art"]` has 0 themes):
    - The chevron-down arrow (`.cv`) automatically hides (`display: none;`).
    - The dropdown popup container (`.dm`) automatically hides (`display: none;`).
    - The parent item receives `.no-dropdown`, disabling hover animations and chevron rotation.
    - The nav item functions as a clean, direct navigation link to that category section.
  - If themes are present:
    - The chevron-down arrow and dropdown menu automatically show with full hover support.
- **CSS Guardrails for Empty States**:
  - Added `.dm:empty, .dm:not(:has(a)), .dd.no-dropdown .dm { display: none !important; }`.
  - Added `.dd.no-dropdown .cv, .dd:not(:has(.dm a)) .cv, .dd:has(.dm:empty) .cv { display: none !important; }`.
  - Added `.dd.no-dropdown:hover .cv, .dd:not(:has(.dm a)):hover .cv { transform: none !important; }`.
- **Homepage Theme Tile Rows (`#t2`, `#t3`)**:
  - Automatically hidden (`display: none`) and added `.tiles:empty { display: none !important; margin-bottom: 0 !important; }` so removing themes leaves no empty gap above the products grid.

## [Design Implementation: Old Design Spacing, Padding, Corner Radius & Layout] - 2026-10-20
### Updated in `index.html`, `admin-index.html`, `draft/admin-index.html` & `change_log.md`
- **Bento Grid Spacing, Corner Radius & Aesthetics**:
  - Restored `.bt` 4px corner radius (`border-radius: 4px;`), subtle border (`border: 1px solid rgba(0, 0, 0, 0.08);`), soft drop shadow (`box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);`), and warm card background (`background: #e8e1d6;`).
  - Restored soft gradient overlay (`linear-gradient(to top, rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0) 32%);`).
  - Restored left-aligned Inter typography (`left: 14px; right: 14px; bottom: 12px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 600; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);`).
  - Restored grid gap (`12px; margin-bottom: 8px;` and `10px` on mobile/tablet).
  - Synced `.bt-tile-admin` border-radius to 4px in `admin-index.html` and `draft/admin-index.html`.
- **Collections Section Layout & Vertical Spacing**:
  - Restored `#collections` section padding (`36px 0 72px !important;` in CSS and `clamp(28px, 5vw, 64px) 0 72px` in HTML).
  - Removed the bulky "Explore our collections" header so the Bento Grid collage sits cleanly at the top of the storefront under the header, displaying all 8 collections immediately within view.
- **Product Cards & Other Section Dimensions**:
  - Restored `.pc .im img, .mimg img` aspect ratio (`4/5; object-fit: cover;`).
  - Restored `.tri svg, .tri .lucide` size (`42px × 42px; stroke-width: 1.4;`).
  - Restored `.x` modal close button top offset (`6px`).
- **Removed Corner Radius on Bento Grid**:
  - Updated `.bt` in `index.html` from `border-radius: 6px` to `border-radius: 0;` to ensure strict design consistency with the sharp, clean, rectangular aesthetic used across the entire website.
  - Updated `.bt-tile-admin` in `admin-index.html` and `draft/admin-index.html` from `border-radius: 6px` to `border-radius: 0;` so the Bento Grid manager preview matches the live storefront exactly.

## [Code Quality: Clean Formatting, Proper Indentation & Minimalist Structure] - 2026-10-19
### Enhanced in `index.html` & `change_log.md`
- **Clean Structure & Formatting Alignment with `admin-index.html`**:
  - Transformed previously minified, single-line CSS, HTML, and JavaScript blocks into cleanly formatted, 4-space indented code.
  - Added standardized ASCII section banners (`/* ========================================================================== */` and `<!-- ========================================================================== -->`) separating every major logical component.
  - **CSS Styling (`<style>`)**:
    - Grouped into organized sections: CSS Variables & Base Reset, Header & Navigation, Product Cards & Showcases, Studio Philosophy Banner, Category/Theme Tiles, Custom Artwork Request Form, Styling/Hanging Guides, Trust Strip, FAQ Accordion, Store Footer, Quickview Modal & Drawers, Bento Grid, and Responsive Fluid Layout Rules.
  - **HTML Structure (`<body>`)**:
    - Indented all semantic tags, drawers, and modals with clean hierarchy.
    - Preserved exact inline element spacing for brand elements (`CRAFT<i>VEDA</i>`), dropdown navigation links, counter badges, and copyright strings.
  - **JavaScript Logic (`<script>`)**:
    - Grouped into structured modules: Default Config & Settings, Dynamic Taxonomy & Settings Loader, Built-in Catalog & Policies, Utility Helpers & Formatters, Wishlist & Customer Profile, Bento Grid Showcase, Shopping Cart & Checkout, Data Loaders & Parsers, Quickview & Product Modal, Category & Product Full Pages, and Client-Side Router & App Initialization.
    - Verified 100% JavaScript syntax validity using Node VM compiler and validated via local HTTP dev server.

## [Feature Toggle: Hide Customer Profile Button in Storefront Header] - 2026-10-19
### Updated in `index.html` & `change_log.md`
- **Customer Profile Feature Toggle (`index.html`)**:
  - Hidden the profile icon button (`#ubtn`) from the storefront top header via `style="display:none"` accompanied by an explicit code comment.
  - Kept 100% of the underlying profile logic, drawer modal (`openDr("Your profile", ...)`), local storage persistence (`cvp`), and order message auto-fill helper (`who()`) intact in the code.
  - Whenever ready to launch, removing `style="display:none"` immediately restores the profile icon and full functionality without requiring any code rewrites.

## [UI Update: Icon-Only Action Buttons for Artworks & Categories] - 2026-10-19
### Enhanced in `draft/admin-index.html` & `change_log.md`
- **Artworks Section Action Buttons**:
  - Replaced text-based buttons (`Edit`, `Publish`/`Unpublish`, `Delete`) with streamlined Lucide icon buttons:
    - Edit: `<i data-lucide="pen-line"></i>` with `title="Edit artwork"`
    - Publish / Unpublish: Dynamic `<i data-lucide="image-down"></i>` (Unpublish) and `<i data-lucide="image-up"></i>` (Publish) with corresponding tooltip
    - Delete: `<i data-lucide="trash-2"></i>` with `title="Delete artwork"`
  - Updated `.row-actions button` CSS to use `display: inline-flex; align-items: center; justify-content: center;` with compact `5px 8px` padding.
  - Added automatic `initIcons()` call upon table rendering to ensure icons dynamically render across search, filter, and sorting operations.
- **Categories & Themes Tab Simplification**:
  - Removed the redundant "Themes" text button from category items.
  - Made category list rows interactive with `cursor: pointer;` so clicking any category row directly selects that category and updates the sub-themes management panel on the right (`Themes for: [Category Name]`).
  - Replaced the "Rename" text button with an icon-only button using `<i data-lucide="pen-line"></i>`.
  - Retained the icon-only category delete button using `<i data-lucide="trash-2"></i>`.

## [Sync: Update draft/admin-index.html from Production admin-index.html with Login Bypass] - 2026-10-19
### Enhanced in `draft/admin-index.html` & `change_log.md`
- **Synchronized Latest Admin UI & Features into Local Draft**:
  - Brought all latest layout, CSS styles, Lucide vector icons (`plus`, `trash-2`, `arrow-right`, `x`, `check`, etc.), clean sidebar without numbers, and 2-instance Bento card specifications (`1080 × 795 px` short, `1080 × 1200 px` tall) from production `admin-index.html` into `draft/admin-index.html`.
  - **Login Bypassed for Direct UI Testing**:
    - Maintained the local testing bypass block (`STORAGE_KEY`, `SETTINGS_KEY`, local storage cache, instant session start).
    - Kept `#login` hidden by default and omitted the Cloudflare `/api/admin-login` network requirement so the full dashboard UI can be tested immediately in local browser environments (`http://localhost:8000/draft/admin-index.html`).

## [Style Restoration: Original Bento Grid Aesthetics & Interactive Hover Behavior] - 2026-10-19
### Restored in `index.html` & `change_log.md`
- **Restored Typography, Alignment & Micro-Interactions**:
  - Re-applied centered typography with `'Playfair Display', serif` (`font-size: 22px; font-weight: 600; text-align: center; bottom: 16px;`).
  - Restored the interactive hover badge `.bt span:after` displaying `"Explore"` in uppercase letter-spaced font (`color: #F1D3C6; font-size: 11px; letter-spacing: .2em`).
  - Restored the vertical lift animation on card hover (`.bt:hover span { transform: translateY(-6px); }` and `.bt:hover span:after { opacity: 1; transform: none; }`).
  - Restored subtle image scale transition (`.bt:hover img { transform: scale(1.07); }` with `.9s cubic-bezier(.2,.7,.2,1)`).
  - Restored soft gradient overlay (`linear-gradient(to top, rgba(10,22,38,.72), rgba(10,22,38,0) 48%)`).
  - Preserved clean borderless cards with `border-radius: 6px`.
- **Restored Section Header & Layout Spacing**:
  - Restored the centered section title and subtitle (`<div class="sh" style="justify-content:center;text-align:center"><h2>Explore our collections</h2><p class="sub">Every piece is handmade. Choose a collection to begin.</p></div>`).
  - Restored standard layout gap (`14px`) and section padding (`44px 0 72px`).
  - Removed conflicting media query overrides that previously forced small left-aligned sans-serif text.

## [Feature: Complete Storefront Lucide Icons Migration & Bento Border Refinement] - 2026-10-19
### Enhanced in `index.html`, `admin-index.html` & `change_log.md`
- **Storefront-Wide Lucide Vector Icons Migration (`index.html`)**:
  - Replaced all legacy inline SVGs, raw unicode arrows, and HTML entities (`&rsaquo;`, `&#10094;`, `&#10095;`) with official Lucide vector icons (`<i data-lucide="..."></i>`) loaded via the unpkg CDN.
  - **Header & Navigation**:
    - Search (`search`) on desktop header form and mobile search trigger (`#sbtn`).
    - User Profile (`user`), Wishlist (`heart`), Cart (`shopping-bag`), and Mobile Menu (`menu`).
    - Dropdowns: Category (`layout-grid`, `chevron-down`), Religious (`layout-grid`, `chevron-down`), and Custom Art (`palette`, `chevron-down`).
  - **Panels, Drawers & Modals**:
    - Slide-over drawer close (`x` on `#drx`).
    - Cart drawer close (`x` on `#cx`).
    - Quick view modal close (`x` on `#cl`).
    - Back-to-top button icon (`chevron-up` inside `#up span`).
    - Floating & product WhatsApp buttons (`message-circle` with brand green styling).
  - **Product Cards & Catalog Grid**:
    - Quick action buttons on product card hover: Quick View (`eye`), Quick Shop (`shopping-bag`), and Save / Wishlist (`heart`).
    - Dynamic re-initialization `initIcons()` hooked into card rendering across `drawHome()`, `catPage()`, `productPage()`, `showList()`, and `openP()`.
  - **Product Details & Gallery**:
    - Breadcrumb navigation separator updated from `&rsaquo;` to Lucide `chevron-right`.
    - Gallery carousel previous / next buttons updated from `&#10094;` / `&#10095;` to Lucide `chevron-left` and `chevron-right` on both quick preview and full product pages.
    - Product filter trigger on category pages updated to Lucide `sliders-horizontal`.
    - Trust badges on product details updated to Lucide icons: `100% handmade` (`sparkles`), `Original artwork` (`award`), and `Safe packaging` (`package`).
    - Product share bar updated with Lucide `message-circle` and `mail`.
  - **CSS & Responsive Icon Sizing**:
    - Updated CSS selectors to apply to both `svg` and `.lucide` elements across all media queries (`.ib svg, .ib .lucide`, `.srch .lucide`, `.act .lucide`, `.flt .lucide`, `.ga .lucide`, `.tri .lucide`, `.sc .lucide`, `.x .lucide`).
- **Bento Card Border Refinements**:
  - Removed borders from all Bento cards while preserving smooth `border-radius: 6px` across desktop, tablet, and mobile breakpoints (`border: 0; border-radius: 6px;`).

## [Bug Fix: Bento Grid Display & Synchronization Fix on Storefront] - 2026-10-19
### Fixed in `index.html`, `admin-index.html` & `change_log.md`
- **Fixed Zero-Height Box Sizing Collapse on Bento Columns and Tiles**:
  - Identified root cause of blank/invisible Bento Grid: `.bcol` was missing `display: flex; flex-direction: column;`, and `<button class="bt">` elements defaulted to `display: inline-block; width: auto;` with only absolute positioned children (`img`, `::before`, `span`), causing intrinsic width and height to collapse to `0px`.
  - Added `.bcol { display: flex; flex-direction: column; gap: 12px; min-width: 0; }` and `.bt { width: 100%; display: block; position: relative; overflow: hidden; }` across all viewports.
  - Set explicit responsive aspect ratios: `.bt.short` (`1.36 : 1`) and `.bt.tall` (`0.9 : 1`), with tablet overrides (`.tab-short`, `.tab-tall`) and mobile overrides (`.mob-short`, `.mob-tall`).
- **Removed Opacity Hiding on Bento Tiles**:
  - Removed `.rv` class from generated Bento tiles in `renderBento()`. Previously, `.rv` set `opacity: 0; transform: translateY(24px);` waiting on `IntersectionObserver`, which was declared after initial render and failed to trigger on zero-height elements. Tiles now render with instant 100% visibility.
- **Enhanced Settings Loading & Storefront-to-Admin Synchronization**:
  - Updated `loadSettings()` in `index.html` to always fetch fresh remote `settings.json` from the server while merging any active `localStorage` (`cv_settings` / `craftveda_admin_draft_settings`) so administrative changes are immediately visible both locally and across production.
  - Linked `storage` event listener to re-fetch and re-render Bento tiles live whenever changes are saved from `admin-index.html`.
  - Updated default `BENTO` array in `index.html` and `DEFAULT_BENTO` in `admin-index.html` to use verified artwork images rather than obsolete placeholder paths.

## [Feature: Homepage Bento Production Migration & Storefront Real-Time Sync] - 2026-10-19
### Enhanced in `admin-index.html`, `index.html`, `settings.json` & `change_log.md`
- **Homepage Bento Grid Manager Integrated into Production `admin-index.html`**:
  - Fully migrated all Bento Grid Manager capabilities from `draft/admin-index.html` into the main production `admin-index.html` file intended for GitHub deployment.
  - Added Bento Grid Manager CSS styling and layout system (`.bento-manager-layout`, `.bento-preview-wrap`, `.bento-grid-preview`, `.tile-editor-panel`, `.ps-spec-card`, `.move-4way-grid`, etc.).
  - Added `Homepage Bento` navigation entry with Lucide `layout-grid` icon in the production sidebar.
  - Implemented `DEFAULT_BENTO` configuration, `toBentoJpeg()` canvas optimizer, `getTileShape()` multi-screen resolver, `bentoView()`, and `bindBentoEvents()`.
  - Added routing case in `render()` for `view === "bento"`.
- **Preserved Cloudflare Worker Production Authentication**:
  - The real `/api/admin-login`, `/api/admin-logout`, `checkSession()`, session status handling, and `/api/gh/...` GitHub proxy workflows in `admin-index.html` remain 100% intact.
  - Integrated GitHub API image uploads (`putImage("bento/...")`) on custom bento photo uploads while retaining instant local preview caching via `localStorage` (`craftveda_bento_images`).
- **Storefront Real-Time Bento Synchronization (`index.html`)**:
  - Updated `settings.json` to include the default `bento` configuration.
  - Enhanced `index.html`'s `loadSettings()` to read from `cv_settings` in `localStorage` as well as static `settings.json`.
  - Added a `storage` event listener in `index.html` so that saving Bento changes in the dashboard instantly updates the storefront collage live without requiring a manual page refresh.

## [Feature: Complete Portal-Wide Lucide Icons Migration] - 2026-10-19
### Enhanced in `admin-index.html`, `draft/admin-index.html` & `change_log.md`
- **Comprehensive Lucide Icons Integration Across All Admin Views**:
  - Replaced all raw HTML entities (`&rarr;`, `&larr;`, `&#9662;`, `&times;`, `×`), unicode symbols, and emojis with official Lucide vector icons (`<i data-lucide="..."></i>`) for a unified, modern, high-end design aesthetic.
- **Arrows & Chevrons**:
  - Replaced all non-Lucide dropdown chevrons (`&#9662;` / `▾`) on the Primary Action `+ Add artwork` button with Lucide `chevron-down`.
  - Replaced all character arrows (`&rarr;`) with Lucide `arrow-right` icons (e.g., Dashboard "Manage Categories" button and category card links).
  - Cleaned up sort options text (`Low &rarr; High` -> `Low to High`, `High &rarr; Low` -> `High to Low`).
- **Action, Add, Close & Delete Icons**:
  - **Plus Icons (`plus`)**: Applied to Sidebar `+ Add artwork`, Dashboard `+ Add artwork`, Categories `+ Add Category`, Themes `+ Add Theme`, Bento `+ Add Tile`, Form `+ Add custom size`, and unselected category badge chips.
  - **Cancel / Close / Delete Icons (`x` & `trash-2`)**:
    - Replaced bulk bar close `&times;` with Lucide `x`.
    - Replaced size row remove `&times;` with Lucide `x` (`sizeRow`).
    - Replaced theme pill delete `&times;` with Lucide `x`.
    - Replaced form modal cancel with Lucide `x` and save with Lucide `check`.
    - Replaced category delete button with Lucide `trash-2`.
    - Replaced image slot remove button with Lucide `trash-2`.
    - Replaced Bento tile delete button with Lucide `trash-2`.
    - Replaced Bento cover image clear button with Lucide `trash-2`.
- **Device Screen Mode Icons**:
  - Replaced raw emojis (`💻`, `📱`, `📲`) across the Bento manager with Lucide `laptop`, `tablet`, and `smartphone` icons:
    - Screen mode selector pills (Laptop, Tablet, Mobile).
    - Live Storefront Preview header and title badge.
    - Independent Screen Sizing manager inspector rows.
- **Upload & Media Icons**:
  - Replaced text/slot upload placeholders with Lucide `upload` (artwork form image dropzones and Bento cover photo upload).
  - Replaced artwork slot reordering arrows (`&larr;`, `&rarr;`) with Lucide `arrow-left` and `arrow-right`.
  - Replaced 4-way Bento move buttons (`←`, `→`, `↑`, `↓`) with Lucide `arrow-left`, `arrow-right`, `arrow-up`, and `arrow-down`.
- **Specialized Feature Icons**:
  - Replaced magic wand emoji (`🪄`) with Lucide `wand-2` on Bento "Auto-match All From Catalog" and tile "Auto-match" buttons.
  - Replaced sparkles emoji (`✨`) with Lucide `sparkles` on "Draft with AI" button and feedback messages.
  - Replaced warning symbol (`⚠`) with Lucide `alert-circle` on "Needs attention" issue pills.
  - Category badges dynamically update between Lucide `check` (selected) and Lucide `plus` (unselected) with instant SVG generation.
- **Robust Event Handling & Re-initialization**:
  - Centralized `initIcons()` triggers `window.lucide.createIcons()` after any dynamic rendering, modal open, badge toggle, AI generation, slot swap, or size addition.
  - Handlers utilize `.closest()` selector matching to guarantee click events on SVG icons trigger parent button actions reliably.

## [Refinement: Fixed 1080px High-Res Photoshop Specs, Bento Status Bar Removal & Sidebar Number Cleanup] - 2026-10-19
### Enhanced in `draft/admin-index.html`, `admin-index.html` & `change_log.md`
- **Standardized Single High-Res 1080px Photoshop Guide**:
  - Replaced the multi-device dimensional variations with a single standard 1080px base across all screens.
  - Simplified management down to **two fixed instances**:
    - **Short Card:** `1080 × 795 px` (Aspect Ratio: `1.36 : 1`)
    - **Tall Card:** `1080 × 1200 px` (Aspect Ratio: `9 : 10` or `0.9 : 1`)
  - The Photoshop Canvas Guide card cleanly displays the active card's instance (`SHORT CARD` vs `TALL CARD`), exact dimensions, aspect ratio, and High-Res JPEG format.
- **Removed Bento Preview Status Bar**:
  - Completely removed the `"Active Preview: ... Total: 8 tiles"` bottom status bar from the Bento editor layout in [draft/admin-index.html](file:///d:/Documents/Projects/craftveda/draft/admin-index.html) to keep the preview area clean and clutter-free.
- **Removed Sidebar Badge Numbers**:
  - Removed all count badges and numbers from sidebar navigation buttons (**Artworks**, **Categories & Themes**, and **Homepage Bento**) in both [draft/admin-index.html](file:///d:/Documents/Projects/craftveda/draft/admin-index.html) and [admin-index.html](file:///d:/Documents/Projects/craftveda/admin-index.html).
  - Cleaned up JavaScript `render()` functions to eliminate obsolete DOM references (`#sb-art-count`, `#sb-cat-count`, `#sb-bento-count`).

## [Feature: Multi-Category Badges, Dynamic Themes & CSV Multi-Category Import] - 2026-10-19
### Enhanced in `draft/admin-index.html`, `admin-index.html`, `index.html` & `craftveda_artworks_sample.csv`
- **Interactive Multi-Category Badges (Artwork Add/Edit Form)**:
  - Replaced the single `<select>` dropdown with an interactive badge/chip selector (`.cat-badges-grid` and `.cat-badge-btn`).
  - Administrators can select multiple categories for a single artwork (e.g., an artwork can simultaneously belong to *"Religious"*, *"Custom Art"*, and *"Textured Art"*).
  - Badges feature instant visual toggles with active dark theme styling, checkmark/plus indicator icons (`✓` when active, `+` when inactive), and a real-time selected count indicator (`#cat-badge-count`).
  - Validates that at least one category badge is selected before saving with helpful inline guidance.
  - Backward and forward compatible: saves both `categories: ["Religious", "Custom Art"]` (array) and `category: "Religious, Custom Art"` (comma-separated string).
- **Dynamic Category-Grouped Themes Dropdown**:
  - Automatically updates the sub-themes dropdown (`#fth`) based on the currently selected category badges.
  - When multiple categories are active, themes are neatly organized into `<optgroup label="<Category> Themes">` so admins can easily select the style corresponding to any active category.
- **Enhanced AI Description Generation**:
  - `generateAIDescription` now receives all active categories joined by commas, producing richer and more contextual artwork descriptions for cross-category pieces.
- **Storefront Multi-Category Support (`index.html`)**:
  - `fromJSON(j)` parses `categories` array as well as comma/semicolon/pipe delimited category strings into `p.categories`.
  - Homepage category sections (`drawHome()`) and tile fallback matchers (`tileImg()`) use `(p.categories ? p.categories.includes(c) : p.category === c)`.
  - Storefront category routing (`#/cat/<category>`) and search routing (`#/search/<query>`) recognize and index all assigned categories for every piece.
- **Table View Category Pills & Multi-Category Filtering**:
  - Artwork table displays individual styled pill badges (`.cat-pill`) for all categories assigned to each artwork.
  - Category dropdown filter (`#qc`) accurately matches artworks having the filtered category in their `categories` list.
  - Category sorting alphabetically orders artworks by their complete category list.
  - Dashboard category counts (`CATS.map(...)`) and "Needs attention" list count and display all assigned categories.
  - Bulk Move Category (`#bulk-cat-select`) adds the category to existing categories without overwriting previous assignments.
  - Category renaming and deleting updates and verifies artworks using the complete `getItemCategories(i)` list.
- **CSV Multi-Category Import & Updated Sample Template**:
  - Upgraded CSV parser `processCSV()` to split the `Category` column by comma, semicolon, or pipe (e.g., `"Religious, Custom Art"`).
  - Case-insensitively maps each category name to existing catalog categories.
  - Automatically imports artworks with both `categories` array and comma-separated `category` string.
  - Updated in-modal sample CSV template download (`dl-sample-csv`) with multi-category samples.
  - Created physical template file [craftveda_artworks_sample.csv](file:///d:/Documents/Projects/craftveda/craftveda_artworks_sample.csv) in project root demonstrating multi-category rows.

## [Feature: Independent Multi-Screen Bento Sizing & Device Switcher] - 2026-10-19
### Enhanced in `draft/admin-index.html` & `index.html`
- **Removed Pro-Tip Callout**:
  - Completely removed the "Pro-Tip" information card from the Homepage Bento management screen in [draft/admin-index.html](file:///d:/Documents/Projects/craftveda/draft/admin-index.html).
  - Replaced it with a minimal, dark status bar displaying the active screen preview mode, live navigation hints, and total tile count.
- **Dedicated Three-Device Screen Switcher**:
  - Clean three-screen button group (`💻 Laptop`, `📱 Tablet`, `📲 Mobile`) allowing administrators to directly select and switch between **Laptop**, **Tablet**, and **Mobile** screen previews.
  - Interactive preview viewport resizes dynamically:
    - **Laptop View**: Full 4-column storefront bento collage preview.
    - **Tablet View**: Realistic 620px framed tablet preview with 2-column layout.
    - **Mobile View**: Realistic 380px smartphone framed preview with 2-column layout and optimized font hierarchy.
- **Clean Photoshop Canvas Specifications (Note Removed)**:
  - Removed the instructional text callout (`Uploads are saved to images/bento/...`) from the Photoshop specifications guide, leaving a clean, concise dimensions card.
- **Independent Screen Sizing Architecture (Zero Interference)**:
  - Each bento card now stores separate shape specifications for all three screen sizes:
    - `shape`: Laptop / Desktop sizing (`"tall"` vs `"short"`).
    - `shapeTablet`: Tablet screen sizing (`"tall"` vs `"short"`).
    - `shapeMobile`: Mobile screen sizing (`"tall"` vs `"short"`).
  - Changing the size for one device screen **does not interfere** with or alter the other device screens.
  - **3-Row Sizing Manager in Tile Inspector**: Provides direct `Tall` and `Short` buttons for Laptop, Tablet, and Mobile with active screen indicators.
  - **Screen-Aware Corner Resizer**: Clicking or dragging the corner resize handle (`.bt-resize-handle`) on any preview tile automatically updates the sizing for the currently active screen mode.
  - **Dynamic Photoshop Canvas Guide**: Adobe Photoshop setup specifications card dynamically recalculates canvas dimensions and aspect ratios according to the active screen:
    - **Laptop:** 720 × 800 px (Tall, 9:10) / 720 × 530 px (Short, 1.36:1) | 2× Retina: 1080 × 1200 / 1080 × 795 px.
    - **Tablet:** 600 × 667 px (Tall, 9:10) / 600 × 440 px (Short, 1.36:1) | 2× Retina: 900 × 1000 / 900 × 660 px.
    - **Mobile:** 450 × 500 px (Tall, 9:10) / 450 × 330 px (Short, 1.36:1) | 2× Retina: 750 × 833 / 750 × 550 px.
- **Storefront Responsive Synchronization (`index.html`)**:
  - Added media query rules in [index.html](file:///d:/Documents/Projects/craftveda/index.html):
    - `@media(min-width:501px) and (max-width:900px)` applying `.bt.tab-short` and `.bt.tab-tall`.
    - `@media(max-width:500px)` applying `.bt.mob-short` and `.bt.mob-tall`.
  - Updated `applySettings(s)` to capture `shapeTablet` and `shapeMobile` from settings.
  - Updated `renderBento()` to output responsive classes (`bt ${shDesk} tab-${shTab} mob-${shMob} rv`), executing the customized layout seamlessly on laptops, tablets, and phones without layout conflicts.

## [Feature: Interactive Homepage Bento Visual Manager & Canvas Setup Guide] - 2026-10-19
### Added & Enhanced in `draft/admin-index.html` & `index.html` (Local Testing)
- **Interactive Visual Corner Resizer**:
  - Replaced static size buttons with an interactive corner resize handle (`.bt-resize-handle`) located at the bottom-right corner of each Bento card in the live grid preview.
  - Supports both instant click toggling and dynamic drag-resizing between **Tall** (9:10 portrait, 720×800 px) and **Short** (1.36:1 landscape, 720×530 px) with live dimensions tooltip.
- **Selectable Taxonomy (No Manual Text Writing)**:
  - Replaced free-text title input with a grouped Category & Theme selector (`#bento-target-select`) containing all dynamic categories and dependent sub-themes.
  - Selecting an option automatically sets the card display name, configures link routing (`cat` vs `th`), and synchronizes the storefront link destination.
- **Visual Drag-and-Drop 4-Way Reordering**:
  - Implemented HTML5 drag-and-drop on all preview cards with grab grip handles (`.bt-drag-grip`), dragging opacity states, and dropzone indicators (`.drag-over`).
  - Added a 4-way direction pad in the tile inspector (`← Col Left`, `Col Right →`, `↑ Row Up`, `Row Down ↓`) allowing card rearrangement in all directions.
- **Photoshop Canvas Setup Guide**:
  - Embedded a dedicated Adobe Photoshop specifications card (`.ps-spec-card`) above the upload section displaying exact canvas dimensions:
    - **Tall Card:** Recommended 720 × 800 px (9:10 portrait), 2× Retina 1080 × 1200 px.
    - **Short Card:** Recommended 720 × 530 px (1.36:1 landscape), 2× Retina 1080 × 795 px.
  - Specifies image output directory (`images/bento/`) and export guidelines (RGB, 80-85% quality JPEG).
- **Custom Image Uploads to `images/bento/`**:
  - Uploading a custom photo optimizes the image via canvas to high-resolution JPEG, saves the path as `images/bento/<slug>-<shape>.jpg`, and caches it in local draft storage (`craftveda_bento_images`).
  - Created directory [images/bento/](file:///d:/Documents/Projects/craftveda/images/bento/) on disk.
- **Category & Theme Filtered Artwork Gallery**:
  - Filtered artwork photo picker in the tile inspector that automatically isolates artworks matching the selected category or theme.
  - Displays all 3 views per artwork (*Room Mockup*, *Artwork on White*, *Side View*), allowing administrators to choose the best angle as the collage cover with a single click.
  - Includes a secondary collapsible gallery to browse all catalog artworks.
- **Storefront Dynamic Rendering (`index.html`)**:
  - Upgraded `renderBento()` in [index.html](file:///d:/Documents/Projects/craftveda/index.html) to dynamically read `s.bento` from settings and local draft cache (`craftveda_bento_images`), reflecting card reordering, sizing, and custom banner images live on the homepage.

## [Hotfix: Category & Theme Persistence & Cloudflare Proxy Whitelist] - 2026-10-19
### Fixed
- **Cloudflare GitHub API Proxy (`functions/api/gh/[[path]].js`) Whitelist**:
  - Whitelisted `settings.json` and `templates.json` alongside `products.json`. Previously, any PUT or GET request for `settings.json` was rejected with HTTP 400 ("Path not allowed"), causing theme additions/deletions to fail silently and revert back on dashboard reload.
- **Settings State Management & Deep Copy (`admin-index.html`)**:
  - Implemented deep JSON cloning for `settings.themes` during category and theme mutations, preventing mutation leaks.
  - Enhanced `saveSettings()` to automatically fetch the existing GitHub blob SHA if `settingsSha` is null, avoiding 422 ("sha is required") errors from GitHub Contents API.
  - Added multi-tier fallback loading (`gh` API -> `localStorage` -> static fetch) so changes persist seamlessly even during CDN propagation.
- **User Feedback & Exception Handling**:
  - Wrapped all category & theme operations (`add-cat-btn`, `data-ren-cat`, `data-del-cat`, `add-theme-btn`, `data-del-th`) in `try...catch` blocks with `busy(...)` indicators and clear `toast(...)` error reporting.

## [Production Release: Phase 3 — Scale Features & Dynamic Taxonomy] - 2026-10-18
### Deployed to Main Production Files (`admin-index.html` & `index.html`)
- **Authentic Cloudflare Login Screen & Session Auth (Original Flow Restored)**:
    - Retained the exact original login view: `<div id="login" class="login">` displayed on load while `<div id="app" hidden>` remains hidden until verified.
    - Cloudflare session check via `/api/gh/products.json?t=...`: displays password prompt upon 401 response and reveals dashboard when authenticated.
    - Form submission sends password to `/api/admin-login`; logout sends POST to `/api/admin-logout` and resets session.
    - `save()` and `saveSettings()` persist changes directly via GitHub API (`/api/gh/products.json` & `/api/gh/settings.json`) with automated SHA conflict resolution.
- **Ported All Approved Admin Features to Production [admin-index.html](file:///d:/Documents/Projects/craftveda/admin-index.html)**:
  - **Dynamic Sidebar Navigation**: Collapsible dark sidebar (`256px`), open by default on desktop, with a single toggle button (`#sb-toggle`) in the top navigation panel. Redundant cancel button removed from sidebar header.
  - **Clean Navigation Hierarchy**: Streamlined views to **Dashboard**, **Artworks**, and **Categories & Themes**. Removed unused "Reserved Modules" (*Templates & Presets*, *Media Library*) for a clean, lean codebase.
  - **Executive Data Table**: Replaced old card list with modern Data Table containing column headers (`PREVIEW`, `ARTWORK`, `CATEGORY`, `STARTING PRICE`, `STATUS`, `LAST UPDATED`, `ACTIONS`), status badges (`PUBLISHED`, `DRAFT`, `INCOMPLETE`, `FEATURED`), row checkboxes, and floating bulk action bar.
  - **In-Table CSV Export**: Download filtered or visible artworks directly to RFC 4180 CSV via the header **Export** button.
  - **Categories & Themes Tab**: Interactive management for adding, renaming, and deleting categories and dependent sub-themes, fully integrated with `settings.json` via GitHub API persistence.
  - **Dynamic "Needs Attention" Panel**: Automatically evaluates artwork completeness and only appears if items require attention (missing cover image, pricing, or sizes); hidden when catalog is complete.
  - **AI Description Drafting**: Added "✨ Draft with AI" assistant in artwork modal to compose rich, category-aware product descriptions.
  - **Duplicate Button Removed**: Removed duplicate action from table rows and dashboard quick actions to streamline catalog management.
- **Dynamic Category & Theme Logic in Storefront [index.html](file:///d:/Documents/Projects/craftveda/index.html)**:
  - **Eliminated Hardcoded Categories**: All categories, menu collections, faith deities, and custom art styles now load dynamically from [settings.json](file:///d:/Documents/Projects/craftveda/settings.json).
  - **Real-Time Taxonomy Synchronization**:
    - Header Category dropdown (`#ddk`) and Religious dropdown (`#ddr`) render dynamically based on `settings.json`.
    - Custom Art dropdown (`#ddc`) and home style tiles (`#t3`) render dynamically from `settings.themes["Custom Art"]`.
    - Religious deity tiles (`#t2`) render dynamically from `settings.themes["Religious"]`.
    - Footer Collections list (`#fcats`) renders dynamically from `settings.categories`.
    - Mobile menu drawer (`#mnu`) dynamically links all categories, jumping to home sections or opening the category catalog view.
    - Custom order form chips (`#chips`) and select dropdown (`#ct`) reflect all categories and themes, with interactive one-click chip selection.
  - **Zero-Flicker Resilience**: Default fallback data ensures immediate, beautiful page loading even offline or prior to network response, instantly refreshing once `settings.json` is loaded.

---

## [Phase 3 — Scale Features (Draft)] - 2026-10-18
### Added & Implemented in `draft/admin-index.html` (Original `admin-index.html` Untouched)
- **Settings Screen: Categories & Themes Management (Sections 4 & 9)**:
  - Created root [settings.json](file:///d:/Documents/Projects/craftveda/settings.json) containing dynamic `categories` and `themes` data structures.
  - Activated the **Categories & Themes** view in the sidebar with live category count badge.
  - Interactive two-column dashboard:
    - **Categories Panel**: Add new categories, rename existing categories (automatically cascades name changes across all existing artworks and themes), and delete categories (with safeguard against deleting categories that still have assigned artworks).
    - **Themes Panel**: Manage and edit dependent sub-themes/types per category (add, view, and delete themes such as Ganesha, Shiva, Radha Krishna, etc.).
  - Persists changes locally in `localStorage` and updates in-memory arrays so all dropdowns across Add/Edit artwork, list filters, and category cards update immediately.
- **Drag-and-Drop, Reordering & Crop Previews for Images (Section 5.4)**:
  - Enabled direct drag-and-drop file upload onto each of the 3 labeled image slots (*Room Mockup*, *Main Artwork*, *Side View*).
  - Slot actions:
    - **Slot Reordering**: Instant Left/Right swap buttons (`←`, `→`) to reorder uploaded files or existing images between slots without re-uploading from disk.
    - **Remove Action**: One-click remove button (`✕`) on any uploaded image.
  - Visual Crop & Fit indicators:
    - Slot 0 (*Room Mockup*): Marked with `Cover (fills canvas)` badge (cover fit, 1080×1350).
    - Slot 1 & 2 (*Main* & *Side View*): Marked with `Full View (No Crop)` badge (contain fit, 1080×1350).
- **Modern Data Table & In-Table Export (Section 6 & 9)**:
  - Replaced the standalone "Import & Export" sidebar item to avoid UI redundancy, since CSV Import is already accessible from the "+ Add artwork ▾" dropdown ("From CSV").
  - Converted the Artworks list into a modern, sleek **Data Table** inspired by executive dashboard designs:
    - Clean table headers: `PREVIEW`, `ARTWORK`, `CATEGORY`, `STARTING PRICE`, `STATUS`, `LAST UPDATED`, `ACTIONS`.
    - Pill status badges matching design spec: `PUBLISHED` (light green), `DRAFT` (soft gray), `INCOMPLETE` (soft red/amber), and `FEATURED` (terracotta).
    - Top header layout with **`Filters`** toggle button and a direct **`Export`** button with download icon.
    - One-click **Export** button immediately downloads an RFC 4180 CSV of visible/filtered artworks (`craftveda_artworks_[date].csv`).
    - Multi-select row checkboxes and floating bulk action bar seamlessly integrated.
  - **Embedded CSV Batch Importer**:
    - Direct drag-and-drop file area with downloadable sample template (`craftveda_artworks_sample.csv`).
    - Interactive pre-import validation and count preview before committing records to draft.
- **AI Description Drafting Assistant (Sections 3 & 9 - Human-Reviewed)**:
  - Added a **"✨ Draft with AI"** assistant button above the Description field in the Add/Edit artwork modal.
  - Analyzes the artwork's Name, Category, Theme, and Shape to craft rich, poetic, handcrafted collector descriptions highlighting impasto texture relief, medium, ambient light, and room presence.
  - Injected directly into the description textarea with visual confirmation. Strictly human-reviewed — admin can review, edit, or overwrite before saving.
- **Removed Duplicate Button & Picker Flow**:
  - Removed "Duplicate existing artwork" button from Dashboard quick actions toolbar.
  - Removed "Duplicate" action button from Artworks Data Table rows.
  - Cleaned up internal modal form functions (`duplicatePickerModal`, `isDuplicate` flags) to streamline artwork management.
- **Removed Top-Right Publish Status Pill**:
  - Removed `#pub-status-chip` from the sticky top-header to provide a clean, uncluttered interface matching modern minimal dashboards.
- **Dynamic "Needs Attention" Panel on Dashboard**:
  - Made the Needs Attention section dynamic: when all artworks are complete (no action items needed), the panel is completely hidden from view.
  - When any artwork is incomplete (missing cover mockup photo, valid pricing, or sizes), the panel dynamically appears with direct "Fix & Edit" actions.
- **Dynamic Collapsible Sidebar (Single Top-Panel Toggle, Open by Default)**:
  - Sidebar is open by default on desktop (`256px` fixed width with aligned content area).
  - Streamlined to a single, intuitive **Toggle Sidebar** button (`◫`) in the top navigation panel, removing the redundant cancel button from inside the sidebar header.
  - Clicking the top dashboard panel button toggles between open and collapsed states smoothly.
  - Smooth animation: collapsing the sidebar slides it off-screen and expands the main content canvas to 100% full width (`margin-left: 0`).
  - Re-opening shifts content back seamlessly with CSS transitions and adjusts floating bulk action bar positioning.
- **Removed "Reserved Modules" & Codebase Simplification**:
  - Removed "Reserved Modules" section (*Templates & Presets*, *Media Library*) and section headers from the sidebar, keeping only active views: **Dashboard**, **Artworks**, and **Categories & Themes**.
  - Cleaned up obsolete CSS rules and background interval polling logic, reducing file complexity and streamlining the codebase.
- **UI Refinements**:
  - Enhanced typography, card elevations, button micro-interactions, badge contrast, and responsive layout polish.

---

## [Phase 2 — Navigation & List Upgrade (Draft)] - 2026-10-18
### Added & Implemented in `draft/admin-index.html`
- **Collapsible Sidebar Navigation (Section 8)**:
  - Replaced horizontal top bar with a collapsible dark navy sidebar (`--navy: #0F2740`).
  - Added brand header with "CV" monogram logo, "CraftVeda" title, and "Admin Portal" subhead.
  - Active navigation pills with Gmail-style rounded background highlights for **Dashboard** and **Artworks** (with live artwork count badge).
  - Reserved visual placeholders for future modules (*Templates & Presets*, *Categories & Themes*, *Media Library*, *Import & Export*, *Settings*) marked with "Soon" / "Phase 3" pill tags.
  - Pinned sidebar footer with keyboard shortcut hint (`Press N to add artwork`) and test data reset button.
  - Responsive mobile drawer with hamburger toggle button and dismissible dark backdrop overlay.
- **Persistent Publish-Status Indicator (Section 5.5 & 7)**:
  - Replaced disappearing 3.5s toast with a persistent header status chip visible across all views.
  - Automatically tracks Cloudflare Pages rebuild lifecycle (`Saved — publishing to website (~2m)` ➔ `Published 1m ago` ➔ `All changes live`).
  - State and countdown persist across page reloads via `localStorage`.
- **Interactive Dashboard & "Needs Attention" Panel (Section 7)**:
  - Added **"Needs Attention"** panel identifying incomplete artworks (missing cover mockup images, pricing, or sizes) with direct "Fix & Edit" shortcut buttons.
  - Interactive clickable category tiles with arrow indicators that navigate to the Artworks list pre-filtered to that category.
  - Quick action toolbar on dashboard: "+ Add artwork", "Duplicate existing artwork" (with quick picker modal), and "Import from CSV".
- **Artworks List & Bulk Actions (Section 6)**:
  - Multi-select row checkboxes with a master "Select all visible" toggle.
  - Floating bulk action bar docked at bottom when $\ge 1$ artworks are selected:
    - **Bulk Publish**: Marks selected items as published and saves batch in one transaction.
    - **Bulk Unpublish**: Moves selected items to draft.
    - **Move Category**: Bulk reassigns category across all selected artworks.
    - **Bulk Delete**: Removes selected artworks with confirmation.
    - **Deselect All**: Dismisses selection.
  - **Completeness Badges**: Client-side computed `⚠ Incomplete` warning badge with tooltip showing missing fields.
  - **Last Updated Column**: Formats relative timestamps (e.g. `Just now`, `10m ago`, `2h ago`, `Yesterday`) using `updatedAt`.
  - **Sorting Dropdown**: Sort by Recently updated, Name (A–Z), Price (Low to High), Price (High to Low), or Category.
- **Global Keyboard Shortcuts**:
  - `N`: Quick-opens "+ Add artwork" modal from anywhere when not inside a form field.
  - `Escape`: Closes open modals, dropdowns, or mobile sidebar.
- **Phase 1 Preservation**:
  - Full compatibility maintained with shape-based sizing, price preservation, CSV draft import, and local testing bypass.

---

## [Phase 1 & Enhancements — Manual-Entry & CSV Batch Drafts] - 2026-10-18
### Deployed to Production (`main`)
- Pushed commit `9c61b6e` to `origin/main` containing production-ready [admin-index.html](file:///d:/Documents/Projects/craftveda/admin-index.html), [templates.json](file:///d:/Documents/Projects/craftveda/templates.json), and [.gitignore](file:///d:/Documents/Projects/craftveda/.gitignore).
- Real Cloudflare session authentication and GitHub proxy integration (`/api/gh/...`) fully preserved.

### Added & Updated (Latest Changes)
- **CSV Batch Import to Drafts**:
  - Converted "+ Add artwork" button into a split dropdown menu:
    - **Manually**: Opens the standard single-item creation modal.
    - **From CSV**: Opens the CSV batch draft importer.
  - **CSV Parser & Importer**:
    - Supports columns: `Name`, `Category`, `Theme`, `Shape`, `Sizes`, `Description`.
    - If `Sizes` column is left blank in CSV, automatically applies the standard 3 sizes for that artwork's shape.
    - Imports all artworks as **Drafts** (`published: false`) with empty image slots.
    - Provides interactive drag & drop file zone and live parsing preview with count before committing.
    - Includes one-click **"Download Sample CSV Template"** button (`craftveda_artworks_sample.csv`).
- **Cleaned Artwork Name Field**:
  - Removed the name suggestion element from under the name input for a clean, minimal UI.
- **Shape-Based Size Auto-Filling**:
  - **Horizontal Art (3:2 Ratio)**: Auto-fills `24*16 inch`, `36*24 inch`, `48*32 inch`.
  - **Vertical Art (2:3 Ratio)**: Auto-fills `16*24 inch`, `24*36 inch`, `32*48 inch`.
  - **Square Art (1:1 Ratio)**: Auto-fills `24*24 inch`, `36*36 inch`, `48*48 inch`.
- **Price Preservation on Shape Change**: When changing the shape dropdown, dimensions update immediately while preserving any pricing already entered by the admin.
- **Removed Size Preset Badges**: Removed unnecessary preset chips since sizes are now fixed and auto-populated based on shape.

### Previous Phase 1 Additions
- **`templates.json`**: Seeded default category templates (Textured Art, Abstract Art, Vastu, Nature, Religious, Custom Art).
- **Category Selection Auto-Fill**: Automatically fills shape, standard sizes/prices, and description template when selecting a category.
- **Duplicate Artwork Action**: Added "Duplicate" action on each artwork row in the admin list.
- **Inline Field Validation**: Real-time inline error indicators on missing name, duplicate names, invalid size/price rows, and missing room mockup image.
- **Dirty Form Confirmation**: Warns admin before closing or clicking backdrop if form contains unsaved changes.
- **`updatedAt` Timestamp**: Added `updatedAt` ISO string to saved artwork records for future sorting and audit tracking.

---

## [Initial Setup & Local Development] - 2026-10-18
### Added
- **`.gitignore`**: Created comprehensive git ignore rules covering `.env`, `.env.*`, internal audit documentation (`*audit*.md`), `draft/`, `change_log.md`, and editor artifacts.
- **`.env`**: Added template for local environment secrets.
- **Package Cleanup**: Removed unnecessary `package.json` in favor of direct, zero-dependency Python local server (`python -m http.server 8000`).
- **Local Dev Server**: Verified background HTTP server serving CraftVeda on `http://localhost:8000/`.
- **`draft/admin-index.html`**: Created local testing environment with isolated login bypass and direct `/products.json` loading with local storage fallback.
- Removed redundant `draft/index.html` to maintain a single source of truth for draft UI work.
