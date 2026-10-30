# Simple D&D Sheets

A tiny character creator for a simplified version of D&D. Runs fully in the browser: no backend, no login, no costs.
Characters are saved in your browser's local storage.

## Features
- Name, species, class, alignment (dropdowns with standard values + free text), picture
- The 6 ability scores with modifiers, one proficiency (rolls with that stat have advantage)
- HP in a blank broken heart for pencil (current left of the crack, max right), Armor Class, empty armor square for printed armor cards
- **Arcana**: mana pool that replaces cantrips and spell slots — circles on the sheet for paper chips.
  Spells cost 1–3 arcana; each extra arcana adds the spell's multiplier dice (e.g. `2d6` + `1d6` per extra).
- Up to 8 basic attacks (weapon or spell), each with a damage type icon
  (bludgeoning, piercing, nature, fire, water, light, dark, mental); the inventory shrinks to keep one page
- Empty inventory lines for pencil notes
- Additional abilities (passive / attack / spell) exported as separate **A5 landscape cards**
- Word export: character sheet always fits on one A4 page
- English / German, themes: Classic and Fall

## Run locally
Open `index.html` in a browser (or serve the folder with any static server).

## Deploy on Vercel
1. On [vercel.com](https://vercel.com) choose **Add New → Project** and import this repo.
2. Framework preset: **Other**. Leave build command and output directory empty.
3. Deploy. That's it.

## Adding a theme
Add an entry to `THEMES` in `app.js` and a matching `body[data-theme="…"]` block in `style.css`.
