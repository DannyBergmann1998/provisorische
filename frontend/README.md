# Handy & PC Service – Vollständige Web-Plattform

Eine vollständige, produktionsreife Web-Plattform für ein Reparaturgeschäft mit Reparatur-System, Ankauf, Online-Shop und Admin-Panel.

---

## Tech Stack

| Schicht        | Technologie                              |
|----------------|------------------------------------------|
| Framework      | Next.js 14 (App Router)                  |
| Styling        | TailwindCSS                              |
| Datenbank      | PostgreSQL + Prisma ORM                  |
| Auth           | JWT (jose) + Argon2id + Refresh Tokens  |
| E-Mail         | Nodemailer (SMTP)                        |
| Zahlung        | Stripe (Checkout Sessions + Webhooks)    |
| PDF            | @react-pdf/renderer                      |
| State          | Zustand (Cart) + TanStack Query          |
| 2FA            | Speakeasy (TOTP)                         |
| Validierung    | Zod + React Hook Form                    |

---

## Projektstruktur

```
handyundpcservice/
├── prisma/
│   ├── schema.prisma        # Datenbankschema (8 Tabellen, Enums, Indizes)
│   └── seed.ts              # Seed-Daten (Admin, Kategorien, Produkte)
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login, Register, Passwort, E-Mail-Bestätigung
│   │   ├── (dashboard)/     # Nutzerdashboard (Reparaturen, Bestellungen, Profil)
│   │   ├── admin/           # Admin-Panel (Nutzer, Produkte, Analytik)
│   │   ├── api/             # REST API Routes
│   │   │   ├── auth/        # Auth-Endpunkte (Register, Login, Refresh, 2FA)
│   │   │   ├── repairs/     # Reparatur-API
│   │   │   ├── buybacks/    # Ankauf-API
│   │   │   ├── shop/        # Shop (Produkte, Warenkorb, Checkout, Webhook)
│   │   │   ├── admin/       # Admin-API (RBAC-geschützt)
│   │   │   └── contact/     # Kontaktformular
│   │   ├── repair/          # Reparatur-Buchungsseite
│   │   ├── buyback/         # Ankauf-Seite
│   │   ├── shop/            # Online-Shop
│   │   ├── cart/            # Warenkorb
│   │   ├── checkout/        # Checkout + Erfolgsseite
│   │   ├── impressum/       # Rechtliche Seiten
│   │   ├── datenschutz/
│   │   ├── agb/
│   │   ├── layout.tsx       # Root Layout
│   │   └── page.tsx         # Landing Page
│   ├── components/
│   │   ├── ui/              # Navbar, Badge, ...
│   │   ├── landing/         # Hero, Services, Trust, Testimonials, About, Contact, Footer
│   │   ├── dashboard/       # Sidebar
│   │   ├── admin/           # AdminSidebar
│   │   └── shop/            # ProductCard
│   ├── hooks/
│   │   └── useAuth.ts       # Auth-Hook (TanStack Query)
│   ├── lib/
│   │   ├── auth.ts          # JWT, Cookies, Session
│   │   ├── db.ts            # Prisma-Client (Singleton)
│   │   ├── email.ts         # E-Mail-Templates (Nodemailer)
│   │   ├── pdf.ts           # PDF-Generierung (React PDF)
│   │   ├── rate-limit.ts    # In-Memory Rate Limiter
│   │   ├── stripe.ts        # Stripe-Integration
│   │   ├── utils.ts         # Helpers (formatPrice, formatDate, API-Responses)
│   │   └── validations.ts   # Zod-Schemas
│   ├── middleware.ts         # Route-Protection (JWT + RBAC)
│   ├── store/
│   │   └── cartStore.ts     # Zustand Cart Store (persistiert)
│   └── types/
│       └── index.ts         # TypeScript-Typen + Preistabellen
├── .env.example
├── next.config.ts            # Security Headers, Image Domains
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Setup & Installation

### 1. Voraussetzungen

- Node.js 18+
- PostgreSQL-Datenbank (lokal oder remote)
- SMTP-Server (z.B. Gmail App-Passwort)
- Stripe-Account

### 2. Installation

```bash
# Repository klonen / Ordner öffnen
cd handyundpcservice

# Abhängigkeiten installieren
npm install

# .env Datei erstellen
cp .env.example .env
```

### 3. .env Datei befüllen

```env
# Datenbank
DATABASE_URL="postgresql://user:password@localhost:5432/handyundpcservice"

# JWT (32+ Zeichen, zufällig generiert)
JWT_ACCESS_SECRET=dein-geheimer-access-schluessel-min-256-bit
JWT_REFRESH_SECRET=dein-geheimer-refresh-schluessel-min-256-bit

# E-Mail (Gmail Beispiel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=deine@gmail.com
SMTP_PASS=dein-app-passwort        # In Gmail unter "App-Passwörter" generieren

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Datenbank einrichten

```bash
# Prisma-Schema auf die Datenbank pushen
npm run db:push

# Oder mit Migrations (für Produktion empfohlen)
npm run db:migrate

# Seed-Daten einspielen (Admin-Nutzer + Beispielprodukte)
npm run db:seed

# Datenbank-GUI starten (optional)
npm run db:studio
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Jetzt unter **http://localhost:3000** erreichbar.

---

## Stripe Webhook (lokal testen)

```bash
# Stripe CLI installieren
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Webhook weiterleiten
stripe listen --forward-to localhost:3000/api/shop/checkout/webhook
```

Den ausgegebenen `whsec_...` Key in `.env` als `STRIPE_WEBHOOK_SECRET` eintragen.

---

## Standard-Zugangsdaten (nach Seed)

| Feld     | Wert                              |
|----------|-----------------------------------|
| E-Mail   | admin@handyundpcservice.de        |
| Passwort | Admin!2024Secure (aus .env ändern)|
| Rolle    | SUPERADMIN                        |

**Admin-Panel:** http://localhost:3000/admin

---

## API-Übersicht

### Auth
| Methode | Route                        | Beschreibung              | Auth |
|---------|------------------------------|---------------------------|------|
| POST    | /api/auth/register           | Registrierung             | –    |
| POST    | /api/auth/login              | Anmeldung + 2FA           | –    |
| POST    | /api/auth/logout             | Abmelden                  | –    |
| POST    | /api/auth/refresh            | Token erneuern            | –    |
| GET     | /api/auth/verify-email       | E-Mail bestätigen         | –    |
| POST    | /api/auth/forgot-password    | Passwort zurücksetzen     | –    |
| POST    | /api/auth/reset-password     | Neues Passwort setzen     | –    |
| GET     | /api/auth/me                 | Eigenes Profil            | ✓    |
| PATCH   | /api/auth/me                 | Profil bearbeiten         | ✓    |
| GET/POST/DELETE | /api/auth/2fa/setup  | 2FA verwalten             | ✓    |

### Reparatur
| Methode | Route                   | Beschreibung            | Auth  |
|---------|-------------------------|-------------------------|-------|
| GET     | /api/repairs            | Meine Reparaturen       | ✓     |
| POST    | /api/repairs            | Reparatur anfragen      | ✓     |
| GET     | /api/repairs/[id]       | Reparatur details       | ✓     |

### Ankauf
| Methode | Route                   | Beschreibung            | Auth  |
|---------|-------------------------|-------------------------|-------|
| GET     | /api/buybacks           | Meine Ankäufe           | ✓     |
| POST    | /api/buybacks           | Ankauf anfragen         | ✓     |

### Shop
| Methode | Route                        | Beschreibung              | Auth  |
|---------|------------------------------|---------------------------|-------|
| GET     | /api/shop/products           | Produkte (öffentlich)     | –     |
| GET     | /api/shop/products/[id]      | Produkt-Detail            | –     |
| GET     | /api/shop/categories         | Kategorien                | –     |
| GET     | /api/shop/orders             | Meine Bestellungen        | ✓     |
| POST    | /api/shop/checkout           | Checkout-Session erstellen| ✓     |
| POST    | /api/shop/checkout/webhook   | Stripe Webhook            | –     |

### Admin (RBAC: ADMIN / SUPERADMIN)
| Methode      | Route                         | Beschreibung           |
|--------------|-------------------------------|------------------------|
| GET          | /api/admin/users              | Nutzerliste            |
| GET          | /api/admin/repairs            | Alle Reparaturen       |
| PATCH        | /api/admin/repairs/[id]       | Status/Preis ändern    |
| GET          | /api/admin/buybacks           | Alle Ankäufe           |
| PATCH        | /api/admin/buybacks/[id]      | Ankauf bearbeiten      |
| GET/POST     | /api/admin/products           | Produkte verwalten     |
| PATCH/DELETE | /api/admin/products/[id]      | Produkt bearbeiten     |
| GET          | /api/admin/analytics          | Statistiken + Charts   |
| GET          | /api/admin/invoices/[id]      | Rechnung als PDF       |

---

## Sicherheitsfeatures

- **Passwort-Hashing:** Argon2id mit memory=64MB, time=3, parallel=4
- **JWT:** Kurze Access Tokens (15min) + Rotating Refresh Tokens (7 Tage)
- **httpOnly Cookies:** Keine Token-Exposition im JavaScript
- **Rate Limiting:** Auth: 10/15min, API: 100/min, Upload: 20/h
- **RBAC:** Middleware prüft Rolle für alle Admin-Routen
- **SQL Injection:** Prisma ORM (parameterisierte Queries)
- **XSS:** React escaping + Content-Security-Policy Headers
- **CSRF:** SameSite=Lax Cookies + Origin-Prüfung
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, etc.
- **Input Validierung:** Zod auf Server + Client
- **Brute Force:** Rate Limiting + Timing-Attack-Schutz bei Login
- **Token Revocation:** Refresh Tokens in DB mit Widerruf-Funktion
- **E-Mail Enumeration:** Immer gleiche Antwort bei "Passwort vergessen"

---

## Deployment (Vercel + Supabase)

### 1. Datenbank (Supabase)

1. Account auf supabase.com erstellen
2. Neues Projekt erstellen
3. Connection String kopieren (Settings → Database → Connection String)
4. In `.env`: `DATABASE_URL="postgresql://..."`

### 2. Vercel Deployment

```bash
# Vercel CLI installieren
npm i -g vercel

# Deploy
vercel

# Oder: GitHub Repo verbinden auf vercel.com
```

### 3. Environment Variables in Vercel

In Vercel Dashboard → Settings → Environment Variables alle `.env` Werte eintragen:
- Alle JWT_*, SMTP_*, STRIPE_*, DATABASE_URL, NEXT_PUBLIC_* Variablen

### 4. Stripe Webhook für Produktion

```
Stripe Dashboard → Webhooks → Add endpoint
URL: https://deine-domain.vercel.app/api/shop/checkout/webhook
Events: checkout.session.completed, payment_intent.payment_failed
```

### 5. Datenbank migrieren

```bash
# Lokal gegen die Produktions-DB
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npx prisma db seed
```

---

## Datenbankschema (Übersicht)

```
User ──────── RefreshToken
User ──────── VerificationToken
User ──────── PasswordReset
User ──────── Repair ──── Upload
User ──────── Buyback ─── Upload
User ──────── Order ───── OrderItem ─── Product ─── Category
User ──────── Invoice
Order ─────── Payment
Order ─────── Invoice
Repair ─────── Invoice
```

**Rollen:** CUSTOMER | TECHNICIAN | ADMIN | SUPERADMIN

---

## Erweiterungen (Optional)

- **Cloudinary** für Bild-Upload (statt lokalem Speicher)
- **Redis** für Rate Limiting (Multi-Instance-fähig)
- **Resend** statt SMTP für bessere E-Mail-Zustellung
- **Push-Notifications** bei Status-Updates
- **Google Maps** in Kontaktsektion einbinden
- **PayPal** als zusätzliche Zahlungsoption
- **i18n** für Mehrsprachigkeit (next-intl)

---

*Erstellt mit Next.js 14, TypeScript, Prisma, Stripe, TailwindCSS*
