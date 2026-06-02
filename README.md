# FITRIX — Premium Gym Website

A clean, modern gym website built with vanilla HTML, CSS and JavaScript.

## Tech Stack
- HTML5 (semantic markup)
- CSS3 (custom properties, flexbox, grid, clamp())
- Vanilla JavaScript (no frameworks, no dependencies)
- Google Fonts: Bebas Neue + Poppins

## Color Palette
| Role | Name | Hex |
|------|------|-----|
| Base (60%) | Obsidian Black | `#0B0B0C` |
| Structure (30%) | Platinum Silver | `#F3F4F6` |
| Accent (10%) | Champagne Gold | `#D4AF37` |

## File Structure
```
FITRIX/
├── index.html
├── about.html
├── services.html
├── trainers.html
├── pricing.html
├── contact.html
├── css/
│   ├── style.css        Global styles and CSS variables
│   ├── animations.css   Keyframes and scroll animation classes
│   └── responsive.css   All media queries
├── js/
│   ├── main.js          Navbar scroll, hamburger menu
│   ├── animations.js    IntersectionObserver scroll animations
│   └── bmi.js           BMI calculator (contact page)
└── assets/
    └── images/
        ├── hero/
        ├── trainers/
        ├── gallery/
        └── icons/
```

## To Add a Real Hero Background
1. Drop your gym photo into `assets/images/hero/`
2. In `index.html`, uncomment the `<img class="hero__bg" ...>` block
3. Update the `src` attribute to your image filename
4. Delete the `<div class="hero__bg-fallback">` line below it

## To Change Any Color Site-Wide
Open `css/style.css` and edit the values inside `:root { }` at the top.
That's it — one change updates every page instantly.