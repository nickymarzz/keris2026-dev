# KERIS Website

Official website for **KERIS** (*Kelantan Education Resource Initiative for Students*) — a student-led organisation that empowers Kelantanese scholars in their post-SPM academic journey and scholarship applications.

Built with **React + Vite**, **TailwindCSS**, **Supabase**, and deployed on **Vercel**.

---

## Tech Stack

| Layer       | Tech                                      |
|-------------|-------------------------------------------|
| Frontend    | React 18, Vite, React Router v6           |
| Styling     | TailwindCSS + Custom CSS tokens           |
| Backend/DB  | Supabase (PostgreSQL, Auth, Storage)      |
| State       | Zustand                                   |
| Charts      | Recharts                                  |
| PDF Export  | html2pdf.js                               |
| Deployment  | Vercel                                    |

---

## Quick Start (Local Development)

### 1. Clone & Enter Project

```bash
git clone https://github.com/nickymarzz/keris2026-dev.git
cd keris2026-dev
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to create your `.env` file:

```bash
cp .env.example .env
```

Fill in your project credentials from your **Supabase Dashboard → Project Settings → API**:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Optional: Set custom admin passphrase (defaults to keris2026 if omitted)
VITE_ADMIN_PASSWORD=keris2026
```

> **Note:** The modern Supabase SDK uses `VITE_SUPABASE_PUBLISHABLE_KEY`. `VITE_SUPABASE_ANON_KEY` is also supported as a legacy fallback.

---

### 4. Supabase Database & Storage Setup

Run the SQL migration script provided in [`supabase/schema.sql`](supabase/schema.sql):

1. Go to your **Supabase Dashboard → SQL Editor** (`>_` in the left sidebar).
2. Click **New query**.
3. Copy the contents of [`supabase/schema.sql`](supabase/schema.sql) and paste it into the editor.
4. Click **Run** (or press `Ctrl + Enter`).

This creates all required tables (`scholarships`, `scholars`, `committee`, `news_entries`), sets up Row Level Security (RLS) policies, and creates the 4 public storage buckets for media uploads.

---

### 5. Seed Sample Data (Optional)

Populate your database with realistic scholarships, scholars, committee members, and news entries. Because the database is secured with RLS preventing public inserts, you must use one of the following methods:

**Option A: SQL Editor (Recommended & Easiest)**
1. Go to your **Supabase Dashboard → SQL Editor**.
2. Open [`supabase/seed.sql`](supabase/seed.sql), copy everything, and paste it into the editor.
3. Click **Run**. (Since this runs as a superuser, it perfectly bypasses RLS).

**Option B: Terminal Script (`npm run seed`)**
If you prefer running the script from your terminal, you must provide your Service Role Key to bypass the RLS blocks:
1. Go to your **Supabase Dashboard → Project Settings → API**.
2. Copy the **`service_role` (secret)** key.
3. Open your `.env` file and add:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key
   ```
4. Run the seed script:
   ```bash
   npm run seed
   ```
---

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Admin Portal Access

The Admin Portal is located at `/admin` (also accessible via the link in the footer).

You can log in via either method:

1. **Passphrase Login**: Enter the passphrase specified in `VITE_ADMIN_PASSWORD` in your `.env` (defaults to `keris2026`).
2. **Supabase Account**: In your Supabase Dashboard, go to **Authentication → Users → Add User** (Create user with email + password). You can then sign in directly with those credentials.

---

## Pages & Routes

| Route                  | Access     | Description                                                        |
|------------------------|------------|--------------------------------------------------------------------|
| `/`                    | Public     | Landing page, impact report & committee showcase                   |
| `/news`                | Public     | News & announcements feed                                          |
| `/news/:id`            | Public     | News article detail                                                |
| `/scholars`            | Public     | Scholars directory with search and filters                         |
| `/scholars/:id`        | Public     | Individual scholar profile                                         |
| `/scholarships`        | Public     | Scholarship hub with category filters                              |
| `/scholarships/:id`    | Public     | Scholarship details & application links                            |
| `/resume`              | Public     | Standardized resume templates for scholarship applications         |
| `/essay`               | Public     | Curated scholarship essay repository & writing guides              |
| `/admin`               | Protected  | Admin dashboard                                                    |
| `/admin/scholars`      | Protected  | Add, edit, or delete scholars                                      |
| `/admin/scholarships`  | Protected  | Add, edit, or delete scholarships                                  |
| `/admin/committee`     | Protected  | Add, edit, or delete committee members                             |
| `/admin/news`          | Protected  | Add, edit, or delete news & event posts                            |

---

## Deploying to Vercel

```bash
npm run build   # Test build locally first
```

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. In Vercel Project Settings, add the **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` or `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD` (optional custom passphrase)
4. In Supabase → **Auth → URL Configuration**, add your Vercel domain as a Redirect URL:

   <https://your-site.vercel.app>

5. Click **Deploy**

> `vercel.json` is already configured to rewrite all routes to `index.html` for client-side routing.
---

## Brand Palette & Design Tokens

| Token    | Hex Value | Purpose                        |
|:---------|:----------|:-------------------------------|
| Gold     | `#E6A122` | Primary accent, icons, CTAs    |
| Crimson  | `#840E20` | Buttons, badges, highlights    |
| Maroon   | `#290101` | Deep primary background        |
| Wine     | `#591D1F` | Mid-layer background & cards   |
| Cream    | `#FDF6E3` | Primary text and headings      |

### Typography

- **Headings & UI Labels**: League Spartan (Google Fonts)
- **Body & Story Text**: Times New Roman / Georgia
