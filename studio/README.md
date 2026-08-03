# AVVM AI DESIGN STUDIO — prototype

`/studio` is an independent, browser-only prototype. It does **not** modify or call AVVM’s live order, payment, pricing, policy, personal-data, or PG-review flows.

## Included MVP flows

1. **AVVM Brand System** — creates and edits a reusable `brand-system.json` with colors, typography, layout, component direction, voice, and vertical/horizontal safe zones.
2. **One-Prompt Campaign** — uses a product image and product direction to compose a linked landing-page preview, 1:1 social ad, 16:9 banner, email, copy, CTA, and storyboard package.
3. **Motion Studio** — parses an SRT source, detects numeric/comparison/sequence/CTA cues, lays them on an editable timeline, and previews subtitle + graphics in 9:16, 1:1, or 16:9 in the browser.
4. **Logo Studio** — turns a brand name, direction, and optional reference image into three editable local vector directions. Choose either a static logo package or a static logo plus browser-based logo-reveal scene, then export SVG and project JSON.
5. **AVVM Shorts Studio** — a consumer-facing, four-step flow at `/studio/quick/` for small businesses to make a free 9:16 planning pack from one to five product images, an offer, and a target customer.
6. **Template Library + Exports** — applies ten starter templates and exports the campaign, brand system, or motion project as real JSON downloads.

## Run locally

No package installation or build step is required.

```bash
cd /Users/dongkukyoon/Documents/Codex/avvm-studio
python3 -m http.server 4173
```

Open [http://localhost:4173/studio/](http://localhost:4173/studio/).

For the consumer flow, open [http://localhost:4173/studio/quick/](http://localhost:4173/studio/quick/). It is also linked as **광고 만들기** in the Studio navigation.

The included test material is at:

- `studio/data/demo-motion.srt`
- `studio/data/demo-project.json`
- Existing AVVM sample media is referenced read-only from the repository root (for example `sample-product-input-v2.png`).

## Verification checklist

### Brand System

1. Open **브랜드 시스템**.
2. Change any color, spacing, safe-zone, or typography token.
3. Confirm that the system preview changes immediately.
4. Click **버전 저장** and verify an entry under **내보내기**.
5. Click **brand-system.json** to download the current system.

### One-Prompt Campaign

1. On **프로젝트**, attach a local image or use the AVVM demo request.
2. Change the prompt and click **캠페인 만들기**.
3. In **캠페인**, switch among Landing / 1:1 / 16:9 / Email / Storyboard.
4. Edit the inspector fields and confirm the central canvas updates.
5. Download the Campaign Pack JSON.

### Motion Studio

1. Open **모션** and click **데모**, or choose `studio/data/demo-motion.srt`.
2. Click **타임코드 분석**.
3. Play the browser preview, then select timeline clips to edit text, timing, position, scale, and graphic template.
4. Turn on **안전영역** and switch among the three ratios.
5. Download the Motion Project JSON.

### Logo Studio

1. Open **로고 만들기** and enter a brand name, tagline, category, and desired impression.
2. Optionally select a local sketch or reference image. Its name is recorded only in the browser; the file is not uploaded or analysed by an external service in this MVP.
3. Choose one of the three directions: Wordmark, Monogram, or Emblem.
4. To order only a logo, leave **움직이는 로고 리빌** unchecked. To include a browser motion preview and a Motion Studio scene, enable the add-on.
5. Export the static logo as SVG or save the combined choice as `avvm-logo-project.json`.

The displayed logo package price (`₩19,900`) and logo-reveal add-on (`+ ₩9,900`) are prototype product settings only. They do not call, change, or create any live AVVM payment or order flow.

### AVVM Shorts Studio (consumer flow)

1. Open **광고 만들기** or `/studio/quick/`.
2. Select one of five industries, then add up to five local JPG, PNG, or WEBP product images with a product name, offer, and target audience.
3. Choose UGC review, problem/solution, or comparison format, then 15 or 25 seconds.
4. The browser composes three hooks, a scene storyboard, caption/TTS script, CTA, post caption, hashtags, and a 9:16 motion preview.
5. The planning-pack JSON download works. HD video, watermark removal, and download delivery stay visibly locked until secure server adapters, a renderer, and credits are connected.

This screen never sends selected images, calls an AI provider, creates a payment, or renders an MP4. It also includes the required advertising notice: do not present fabricated testimonials or unverified claims, and disclose sponsored/affiliate relationships.

## AI integration boundary

`studio.js` exposes `window.AVVMStudioAdapters` with `analyseBrand()` and `createCampaign()` methods. They deliberately run in `demo` mode and do not transmit source files. The Shorts Studio Planning Pack exports a separate adapter manifest for Gemini or equivalent copy generation, Higgsfield video, TTS, Remotion/server MP4 rendering, and payment/credit handling.

When a real provider is selected later, replace only those adapter methods with authenticated server calls. Keep API keys server-side; never put them in this static module. A live provider integration should add explicit customer consent before a logo, image, video, SRT, or document is uploaded.

## MP4 rendering extension

The current prototype intentionally has no fake MP4 renderer. Browser preview and JSON export work now. For MP4 delivery, add a separate rendering service such as Remotion:

1. Create a server-side renderer project outside the live AVVM payment flow.
2. Map exported `avvm-motion-project/v0.1` scenes to Remotion compositions.
3. Render in a job queue and return a time-limited download URL.
4. Add project ownership, consent, retention/deletion, retry, and usage-cost limits before enabling customer rendering.

## Constraints and next work

- Uploaded files stay only in the current browser session; Blob URLs are not persisted.
- The brand analysis and campaign composer are intentional local demo logic, not provider-backed generation.
- Logo Studio creates editable local SVG directions and a browser preview. It does not yet generate a raster logo with an external AI model or render an MP4 logo-reveal file.
- Shorts Studio is a local planning prototype. Its hooks, storyboards, and captions use transparent deterministic demo logic, while high-resolution video, watermark removal, and delivery remain disabled until server-side adapters are intentionally connected.
- The prototype uses CSS/SVG-like HTML animation rather than Remotion because the existing AVVM repository is a dependency-free static site.
- Next priority: server-side Brand System persistence, permissioned AI adapters, render queue, authenticated projects, and selective merge into a protected production route only after review.
