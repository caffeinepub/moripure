# MoriPure

## Current State
New project. No existing backend or frontend code.

## Requested Changes (Diff)

### Add
- Full landing page for MoriPure, a premium moringa powder brand
- Header with brand name "MoriPure" and tagline "Pure Moringa. Pure Health."
- Navigation: Home, Benefits, Products, About, Contact (smooth scroll to sections)
- Hero section: "100% Natural Moringa Powder" headline, subtext, "Order Now" CTA button
- "Why MoriPure?" section with brand description
- Health Benefits section: Boost Immunity, High in Vitamins & Iron, Helps Energy & Metabolism, Natural Detox
- Products section with 3 product cards:
  - 100g Moringa Powder - ₹199
  - 250g Moringa Powder - ₹399
  - 500g Moringa Powder - ₹699
  - Each with a "Buy Now" button (triggers a simple order/inquiry modal or toast)
- Contact section: Email support@moripure.com, Phone +91 9876543210
- Footer: © 2026 MoriPure. All Rights Reserved.
- A hero/product image generated via AI

### Modify
- None

### Remove
- None

## Implementation Plan
1. Generate a hero image of moringa powder/leaves for use in the landing page
2. Generate Motoko backend with a simple order inquiry submission (name, email, product, message) stored on-chain
3. Build React frontend matching the layout above:
   - Sticky top navigation with smooth scroll anchors
   - Hero section with generated image
   - Benefits, Products, Contact sections
   - Order inquiry modal triggered from "Buy Now" / "Order Now" buttons
   - Contact form or display
   - Deterministic data-ocid markers on all interactive elements
