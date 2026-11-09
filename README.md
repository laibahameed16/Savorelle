# Savorelle - Restaurant website (Angular + TypeScript + Tailwind CSS)

Angular 22 (standalone components, signals, lazy-loaded routes) with Tailwind CSS v4.

## Run it
```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/savorelle
```
Requires Node 20.19+ (or 22+).

## Pages
| Route | Page |
|---|---|
| `/` | Landing page (hero, dishes carousel, services, chefs, reviews, reservation form, CTA) |
| `/menu` | Menu with category tabs, search, sorting |
| `/menu/:id` | Dish details, quantity picker, related dishes |
| `/about` | Story, animated stats, values, chefs (`#team`) |
| `/experiences` | Tasting menu, private dining, events, gift card builder |
| `/gallery` | Filterable gallery with keyboard-friendly lightbox |
| `/reserve` | Full reservation form with validation, confirmation code, saved bookings |
| `/contact` | Contact form, live open/closed status, hours |
| `/cart` | Order summary, quantity controls, checkout |

## Interactivity
Scroll-reveal, 3D tilt cards, count-up stats, carousels, favorites, cart badge (persisted in localStorage),
toast notifications, mobile slide-down menu, scroll progress bar, back-to-top, page transitions.
Animations respect `prefers-reduced-motion`.

## Structure
```
src/app/core      data, services (cart, favorites, bookings, toasts), directives
src/app/shared    navbar, footer, cta button, carousel, dish card, icons
src/app/pages     one file per page
public/img        images cropped from the original design
```
Edit menu items, chefs, reviews and gallery in `src/app/core/data.ts`.
Brand colors and fonts live in the `@theme` block in `src/styles.css`.

## Images
All images in `public/img` were upscaled (2-6x), denoised and sharpened. `*-plate.jpg` files are square crops centred on
each plate so the circular cards and the spinning animation look clean. For true HD quality, replace any file with a
higher-resolution original using the same name (plates: keep the plate centred, square crop).

## Plate animations (menu, home carousel, dish page)
Each dish has an `anim` value in `src/app/core/data.ts`: `spin` (clockwise), `spin-rev` (counter-clockwise) or `float`
(gentle bobbing + one full turn on hover). Speeds and keyframes live at the bottom of `src/styles.css`.
Reduced-motion users get no animation.

## Theme, languages, orders
- **Dark / Light mode**: toggle in the navbar (circular reveal animation). Choice is saved in `localStorage` (`sv-theme`). Colours are CSS variables (`--color-bg`, `--color-fg`, `--color-card` ...) in `src/styles.css`.
- **Languages**: English, Arabic (RTL) and Chinese. Switch from the globe button in the navbar (`sv-lang`). All text is translated with the `t` pipe;
  translations live in `src/app/core/dict.ts` (`'English text': [arabic, chinese]`). Add a line there to translate new text; missing keys fall back to English.
- **My Orders** (`/orders`): every order placed from the cart is saved with items, totals, address and payment. Status moves automatically
  (received -> preparing -> on the way -> delivered, ~5 min demo timeline in `OrderService`). Filter tabs, expandable details with a live tracker, reorder, cancel and remove.
- Hero plates cross-fade between full-plate photos; menu plates spin / float (see `anim` in `data.ts`).

## Performance & scrolling
- Mouse-wheel scrolling is smoothed by `src/app/core/smooth-scroll.ts` (trackpad/touch keep native scrolling; disabled for reduced-motion).
- Removed animated blur filters / animated box-shadows / backdrop blur, plate animations pause when off-screen (`appInView`), the scroll progress bar is written once per frame, and images were re-encoded lighter (~3 MB total).
- Navbar shows every link from 1024px up; the burger menu only appears on tablets and phones.
