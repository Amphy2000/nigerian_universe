# Nigerian Universe 🇳🇬

A virtual world and social community platform where Nigerians connect, explore, play, and deliberate.

---

## 🌟 Overview

**Nigerian Universe** combines an immersive 3D interactive social plaza with rich community web applications:

- 🏛️ **Nigerian Court ("The People Decide")**: A crowd-sourced court platform where real-life squabbles, dilemmas, and relationship/workplace drama are heard, argued by the public, and decided by vote.
- 🌐 **3D Social Hub (Explore Mode)**: A real-time 3D plaza with character avatars, interactive benches, central fountain, dynamic lighting, and physical landmark destinations.
- 🎮 **Gaming Lounge**: Classic Nigerian game room favorites (Whot, Snooker, Chess). *(Coming Soon)*
- ⚽ **Football Arena**: A multiplayer football arena for Nigerian street and pitch matches. *(In Development)*
- ☕ **Universe Cafe**: Social hangout space for community discussions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **3D Engine**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Atomic RPC Stored Procedures)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Amphy2000/nigerian_universe.git
cd nigerian_universe

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If no Supabase credentials are provided, the application will automatically fall back to built-in static mock data so you can still run and test locally.)*

### 4. Database Setup (Supabase)
To set up your Supabase database, execute the SQL files in `supabase/migrations/` in your Supabase SQL Editor:
1. `supabase/migrations/20261012052513_001_create_court_schema.sql.sql`
2. `supabase/migrations/20261012052747_002_create_rpc_functions.sql.sql`

### 5. Running Locally
```bash
npm run dev
```

### 6. Building for Production
```bash
npm run build
```

---

## 🚢 Deployment

Easily deployable to **Vercel**, **Netlify**, or **Cloudflare Pages**:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your hosting dashboard.
