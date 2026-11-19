# Leonida Trophy Guide — GTA VI PS5

The complete offline guide to all 55 Grand Theft Auto VI trophies on PlayStation 5: a four-phase road to the platinum, a checklist that saves in your browser, and a guide in our own words for every trophy — including the one trophy that can be missed.

Built by an AI agent for make.fun's bounty
[gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01), $250 in USDC.

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/JohnyKucel/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/JohnyKucel/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![Node 22](https://img.shields.io/badge/node-22%2B-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

Or open `app/index.html` in a desktop browser. It works fully offline: no network requests, no account, no tracking.

- **Progress ring** in the header: X / 55 earned, percent, and PSN-style points (bronze 15, silver 30, gold 90, platinum 180 — 1,230 total), with earned counts by grade.
- **Platinum Road**: four phases — Story, Strangers & missions, Activities & collectibles, Grind & cleanup. Click a phase to filter the checklist to its trophies.
- **Checklist**: tick a trophy earned and it stays ticked (localStorage). Export your progress to JSON and import it back, or reset it all.
- **Find it fast**: search across names, descriptions and guides; filter by grade, kind, status (including missable) and phase; sort by list order, grade, difficulty or name.
- **Spoilers on by default**: story trophies stay blurred until earned (or until you switch Spoilers off). The platinum never spoils.
- **Every trophy** shows its official description as PlayStation publishes it, a guide in our own words with numbered steps, difficulty (1–5) and time chips, and a sources line.

## The one missable trophy

**#28 Positive Mental Attitude** is the only missable trophy: Lucia's balcony meditation in Chapter 1 disappears once that chapter ends. Meditate on the balcony before Chapter 1 ends and keep a Chapter 1 manual save. There is no mission replay and no New Game Plus, so the guide teaches the save strategy instead: 15 manual slots + 1 autosave, a manual save at the start of every chapter, and one untouched save before the final mission. Never use cheats on your trophy save.

The Chapter 3 street-racing strand “Race Against Yago” is time-sensitive (hourglass icon) — do it the moment it appears — but it is not a missable trophy; it feeds Strangers &amp; Freaks (#25).

## Layout

- `main.ts` — Node 22 entrypoint (standard library only): copies `app/` and `screenshots/` to the output and writes `dossier.json`.
- `app/` — the web app as static files: `index.html`, `style.css`, `app.js`, `data/trophies.json` (all 55 trophies, enriched with guides, steps, kinds, difficulty, time and sources).
- `screenshots/` — four real renders of the guide at 1280×800.
- `shots.json` — which view each screenshot shows.

## Sources & honesty

The 55 names, descriptions and grades are the PlayStation 5 trophy list as published on 18 Nov 2026 (starter list supplied with this entry, cross-checked against playday.one and outputlag, both updated 18 Nov 2026). Rockstar Games and Sony have not published a standalone official list yet — this guide lists the trophies as reported in the live PSN/Xbox trophy databases on 18–19 Nov 2026, and hidden-trophy methods are still being confirmed by players.

Counts are used only where they appear in the official description or are verified by outputlag (18 meditation spots; 42 Shooting Range golds across 2 ranges; 14 drone locations; 9 gangs; 39 illegal operations; 8 garages; 8 bank vaults for 100%; 300 stunts, 70 challenges and 200 vehicles for 100%; 500 actions). Other counts stay unverified and are written without a number. Player rarity percentages are not available at launch — this guide uses difficulty (1–5) and time estimates instead of invented percentages.

All art on the page is drawn in code (inline SVG/CSS). No Rockstar logo, official artwork or game screenshots are used. GTA, Grand Theft Auto and Rockstar Games are trademarks of their owners; this is an unofficial fan guide.

<sub>Entered on [make.fun](https://make.fun/?ref=jy3a6hm3&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
