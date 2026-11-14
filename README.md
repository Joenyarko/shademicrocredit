# Shade Micro-Credit Enterprise — Official Multi-Page Website

A modern, high-performance multi-page static website for **Shade Micro-Credit Enterprise (SME)** in Accra, Ghana.

> **Slogan:** *“Financial Shade — Count On Us!”*

---

## 🎨 Brand System & Design Standards
* **Two Exact Green Shades From The Logo:**
  - **Primary Deep Teal / Pine:** `#008083` (Roof shield motif, navbar, headings, primary buttons)
  - **Vibrant Emerald / Mint Green:** `#01a793` / `#02c39a` (SME letters, highlights, accents, hover borders)
  - **Dark Obsidian Teal:** `#003738` (Hero gradients & footer)
  - **Pure White & Off-White:** `#ffffff` / `#f7faf9` (High-contrast card surfaces)
* **Strict Squared Geometry:** Zero border radius everywhere (`border-radius: 0px !important`).
* **Subtle Shadows:** Refined box shadows (`0 4px 20px -2px rgba(0, 40, 40, 0.08)`) and crisp 2D button hover effects.
* **Typography & Icons:** High-end fintech typography (`Space Grotesk` + `Plus Jakarta Sans`). No AI/clipart icons; values and packages use geometric numbers (`01`, `02`, `03`, `04`).
* **Social Media Icons Only:** Pristine SVG icons for WhatsApp, Facebook, LinkedIn, X/Twitter, and Instagram.
* **Authentic Ghanaian Race Imagery:** High-resolution photographs featuring authentic Black Ghanaian entrepreneurs, market women, artisans, and microfinance officers in real West African commercial settings.

---

## 📁 Multi-Page Architecture

| File | Purpose | Key Content |
|---|---|---|
| [index.html](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/index.html) | **Home Page** | Full hero banner with mounted navbar, connected 3-column **Instant Benefit Ribbon**, company overview, core values, popular loan packages, community stories, and CTA. |
| [about.html](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/about.html) | **About Us** | Official Mission and Vision statements, Detailed Core Values (Integrity, Reliability, Customer-Centricity, Innovation), and Logo Concept Breakdown (Roof, Lock, SME). |
| [services.html](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/services.html) | **Credit Solutions** | Full loan packages (Business Growth, Individual Credit, Market Stock), 3-step application workflow, and **Interactive Loan Calculator with Month-by-Month Amortization Schedule Table**. |
| [faqs.html](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/faqs.html) | **FAQs & Eligibility** | Pre-qualification requirements (Ghana Card, Proof of Trade, Address), and interactive Accordion covering rates, disbursement, and policies. |
| [contact.html](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/contact.html) | **Branch Location & Contact** | Branch address in Lartebiokorshie, phone numbers, operating hours, quick inquiry form, and **embedded Google Map iframe of Eduardo Mohdlana Road opposite Mohdlana Pre-School**. |

---

## 🔍 SEO & Crawlability Assets
* **Sitemap:** [sitemap.xml](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/sitemap.xml) indexed with priorities and update frequencies.
* **Robots File:** [robots.txt](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/robots.txt) allowing full Googlebot/search engine crawling.
* **Favicons:** Multiple resolutions generated from the official SME roof mark (`favicon.ico`, `favicon-32x32.png`, `favicon-16x16.png`, `apple-touch-icon.png`).
* **Metadata on All Pages:** Canonical URLs, Open Graph tags, Twitter Cards, and `Schema.org/FinancialService` JSON-LD structured data for Google rich snippets and local map results.

---

## 📱 Mobile Responsiveness
Engineered and tested for all device widths (320px, 375px, 414px, 768px, 1024px, 1440px+):
* Mobile slide-out drawer navigation with hamburger toggle.
* Responsive multi-column grid layouts that collapse into clean stacked cards.
* Pinned floating WhatsApp quick-chat button.
* Squared cookie consent banner with `localStorage` persistence.

---

## 🚀 How to View
Double-click [index.html](file:///c:/Users/joeny/OneDrive/Desktop/ShadeMicrocredit/index.html) in your file manager or start a local server with:
```powershell
python -m http.server 8080
```
and navigate to `http://localhost:8080`.
