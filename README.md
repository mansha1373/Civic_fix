# CivicFix (React + Vite)

Landing page for the CivicFix citizen issue-reporting project.

## Run in VS Code
1. Install Node.js 18+ from https://nodejs.org
2. Unzip, then in VS Code: **File > Open Folder** > `civicfix`
3. Open the terminal (**Ctrl + `**) and run:
   ```
   npm install
   npm run dev
   ```
4. Open the link shown (usually http://localhost:5173)

`npm run build` makes a production build in `dist/`.

## Structure
```
index.html            page shell + Google Fonts
src/main.jsx          entry point
src/App.jsx           page layout
src/config.js         headline, links, image URLs (edit here)
src/pages/            Home, Login (/auth), Signup (/signup), Dashboard (/dashboard)
src/components/       Navbar, Hero, Steps, Impact, ImpactMap, Footer, TransitionProvider (wave)
src/auth/             AuthContext (localStorage demo login)
src/data/             steps, stats, demo reports
src/hooks/            scroll animations (GSAP + Lenis), banner parallax
src/styles/             civicfix.css motion.css, footer.css, auth.css (wave + login)
```
Note: the three images (banner, pines, clouds) load from framerusercontent.com. To host them yourself, put them in `public/` and change the paths in `src/config.js`.

## Login / Signup
Works without a server: accounts are saved in the browser's localStorage (demo only). To use a real backend, replace `signup()` and `login()` in `src/auth/AuthContext.jsx` with API calls.
If you deploy to a static host, add a rewrite so every path serves `index.html` (needed for /auth, /signup).

## Google sign-in (setup, 3 minutes)
The "Continue with Google" button on /auth and /signup needs your own Google Client ID (free):
1. Go to https://console.cloud.google.com > create/select a project > **APIs & Services > Credentials**.
2. **Create credentials > OAuth client ID > Web application**.
3. Under **Authorized JavaScript origins** add `http://localhost:5173` (and your live site URL when deployed).
4. Copy the Client ID, then copy `.env.example` to `.env` and paste it:
   `VITE_GOOGLE_CLIENT_ID=123...apps.googleusercontent.com`
5. Restart `npm run dev`. After Google login you land on the dashboard saying **Welcome, <your name>**.
If the app's OAuth consent screen is in "Testing" mode, add your Gmail under **Test users**.
Note: the demo trusts the Google token in the browser. For production, verify it on your backend.

## Map
Click any sector to see how much has improved there: overall %, roads / waste / drainage / lights, before vs now, and average fix time. The buttons above the map recolour it by category. Data is illustrative, edit `src/data/areas.js`.
