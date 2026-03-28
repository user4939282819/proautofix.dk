# ProAutoFix.dk — Website

Statisk website til ProAutoFix autoværksted i Albertslund.
Bygget til Google PageSpeed 100/100 og deployeret via Cloudflare Pages.

---

## 🗂 Projektstruktur

```
proautofix/
├── index.html                   ← Forside
├── sitemap.xml                  ← SEO sitemap
├── robots.txt                   ← Søgemaskinedirektiver
├── _headers                     ← Cloudflare security headers
├── _redirects                   ← Cloudflare URL-redirects
├── css/
│   └── style.css                ← Global stylesheet
├── js/
│   └── main.js                  ← Cookie consent + nav + animations
├── images/
│   └── favicon.svg              ← Favicon (erstat med rigtig logo)
├── privatlivspolitik/
│   └── index.html
├── cookiepolitik/
│   └── index.html
├── handelsbetingelser/
│   └── index.html
├── priser/                      ← TODO: prisberegner side
├── book-tid/                    ← TODO: booking formular
├── kontakt/                     ← TODO: kontaktformular
├── om-os/                       ← TODO: om os
├── blog/                        ← TODO: blog
├── services/                    ← TODO: alle ydelsessider
└── autovaerksted-*/             ← TODO: lokale SEO sider
```

---

## 🚀 Deploy til Cloudflare Pages

### 1. Push til GitHub

```bash
git init
git add .
git commit -m "Initial ProAutoFix website"
git remote add origin https://github.com/[dit-username]/proautofix.dk.git
git push -u origin main
```

### 2. Cloudflare Pages opsætning

1. Gå til [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Klik **Pages** → **Create a project** → **Connect to Git**
3. Vælg dit GitHub repository `proautofix.dk`
4. Build settings:
   - **Framework preset:** None
   - **Build command:** (ingen — statisk site)
   - **Build output directory:** `/` (rod-mappen)
5. Klik **Save and Deploy**

### 3. Tilknyt dit domæne

1. I Cloudflare Pages → dit projekt → **Custom domains**
2. Tilføj `proautofix.dk` og `www.proautofix.dk`
3. Cloudflare håndterer automatisk SSL-certifikat

---

## ✏️ Hvad skal opdateres med rigtige data

Søg efter `[PLACEHOLDER]` i alle filer og erstat:

| Placeholder | Erstat med |
|---|---|
| `+45 00 00 00 00` | Rigtigt telefonnummer |
| `[ADRESSE]` | Rigtig adresse |
| `[XXXXXXXX]` | CVR-nummer |
| `info@proautofix.dk` | Rigtig e-mail |
| Stock images (Unsplash URLs) | Rigtige fotos af værksted |
| Trustpilot/Google review links | Rigtige review-sider |
| Årstal i "siden XXXX" | Rigtigt årstal |
| Statistikker (2.400+ kunder, 10+ år) | Rigtige tal |

---

## 💰 Prisberegner — opdater priser

Åbn `/js/main.js` og find `const PRICES = {`.
Opdater alle prisinterval-arrays med mekanikernes rigtige priser.

Format: `[min_pris, max_pris]` i DKK inkl. moms og arbejdsløn.

---

## 📄 Sider der mangler at blive bygget (Phase 2+)

- [ ] `/priser/` — Fuld prisberegner side
- [ ] `/book-tid/` — Booking formular
- [ ] `/kontakt/` — Kontaktformular
- [ ] `/om-os/` — Om mekanikeren
- [ ] `/services/` — Serviceoversigt
- [ ] `/services/bremser/` — Bremser ydelsesside
- [ ] `/services/daekskifte/` — Dæk ydelsesside
- [ ] `/services/olieskift/` — Olieskift ydelsesside
- [ ] (+ 7 flere service-sider)
- [ ] `/autovaerksted-albertslund/` — Lokal SEO side
- [ ] (+ 7 flere lokale SEO sider)
- [ ] `/blog/` + 15 blogsider
- [ ] 404.html — Fejlside

---

## 🎯 Google PageSpeed — 100/100 opskrift

Websitet er optimeret til 100/100 på alle Lighthouse parametre:

- ✅ Ingen render-blocking scripts (alt er `defer`)
- ✅ Fonts via `preconnect`
- ✅ Alle billeder har `width` + `height` (nul CLS)
- ✅ `loading="lazy"` på alle billeder under fold
- ✅ `loading="eager"` + `fetchpriority="high"` på hero billede
- ✅ Cloudflare CDN (globalt, automatisk)
- ✅ Immutable cache headers på CSS/JS/images
- ✅ Semantisk HTML (h1→h2→h3 hierarki)
- ✅ ARIA labels på alle interaktive elementer
- ✅ Canonical tags på alle sider
- ✅ Structured data (JSON-LD) på forside

**Når rigtige billeder tilføjes:** Konverter alle til WebP format.
Brug: `cwebp input.jpg -o output.webp -q 82`

---

## 📊 SEO Checkliste efter launch

- [ ] Google Search Console: tilføj proautofix.dk og indsend sitemap
- [ ] Google Business Profile: opret/opdater med link til website
- [ ] Trustpilot: opret virksomhedsprofil og indsæt rigtig link
- [ ] Google Analytics 4: opret og sæt GA4 Measurement ID i `main.js`
- [ ] Backlinks: få nævnt på lokale erhvervsportaler (DBA, Guloggratis, etc.)
