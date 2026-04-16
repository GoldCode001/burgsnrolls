# Burgs N Rolls — Food Ordering Website

## Overview

A clean, modern, light-mode food ordering website for **Burgs & Rolls** restaurant. Customers browse a menu organized by category, add items to a cart, then place their order directly via WhatsApp with a pre-typed message.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/burgs-n-rolls)
- **API framework**: Express 5 (artifacts/api-server, unused currently)
- **Database**: PostgreSQL + Drizzle ORM (unused currently)

## Key Files

- `artifacts/burgs-n-rolls/src/App.tsx` — Main app with cart state and category filtering
- `artifacts/burgs-n-rolls/src/data/menu.ts` — All menu items, categories, ingredients, prices
- `artifacts/burgs-n-rolls/src/components/MenuCard.tsx` — Food tile component
- `artifacts/burgs-n-rolls/src/components/CartDrawer.tsx` — Slide-out cart with WhatsApp ordering
- `artifacts/burgs-n-rolls/public/d1.jpeg` — D1 B&R Special Wrap image
- `artifacts/burgs-n-rolls/public/d2.jpeg` — D2 Chicken Popcorn image

## WhatsApp Number

The restaurant WhatsApp number is set in `CartDrawer.tsx` as `WHATSAPP_NUMBER`. Update this to the real number.

## Features

- Menu tiles organized by category: Wraps & Durumlar, Kids Menu (Anisha's Friends), Salads
- Each tile: code badge, food image (or placeholder), name, ingredients, price, Add to Cart button
- Sticky header with cart button showing item count
- Slide-out cart drawer with item list and totals
- "Order via WhatsApp" button generates a pre-typed wa.me message with the full order

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/burgs-n-rolls run dev` — run frontend locally

## Adding More Food Items

Edit `artifacts/burgs-n-rolls/src/data/menu.ts` — add to `menuItems` array.
Add images to `artifacts/burgs-n-rolls/public/` and reference by filename (e.g. `"/d3.jpeg"`).
