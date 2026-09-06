# Iron Log

A lightweight, offline-first workout tracker. No accounts, no server, no dependencies —
one folder of static files you can host free on GitHub Pages and install on your phone.

## What it does

**Training**
- Start a workout with a live session timer
- Add exercises from a library of **111 exercises** (barbell, dumbbell, machine, cable, bodyweight, cardio)
- Log any number of sets per exercise with weight × reps
- **Separate left/right weights** for dumbbell work when your hands need different loads
- Mark sets as warm-up, drop set, or taken to failure — warm-ups are excluded from records
- Rest timer starts automatically when you tick a set off, with ±15s and skip
- Every set row shows what you did last time, so you always know what to beat
- Personal-record alerts the moment you log a heavier set

**Exercise library**
Every exercise includes, in plain language:
- what it is and what it builds
- how to set up the bench/machine/weights
- step-by-step instructions
- coaching tips
- **safety and precautions** — the specific ways each movement goes wrong
- common mistakes
- your own history, records and progress chart for that lift

**Progress**
- Weight progression charts per exercise: top set, estimated 1RM, volume, or total reps
- Time ranges (all time / 3 months / 30 days)
- Personal records: heaviest set, best estimated 1RM, most reps, best session volume
- Per-exercise strength goals with a progress bar
- Weekly training volume, sets per muscle group, workout frequency
- Bodyweight tracking

**AI Coach** (optional)
A robot button in the bottom-right corner opens a chat with an AI coach that can see
your workout history, personal records and exercise library. It can review your
training, build plans, and — with a confirmation tap — add exercises to your library,
add exercises to the workout in progress, or save routines. Requires a one-time setup
(see below).

**Also**
- Routines — save a set of exercises and start it in one tap
- Repeat any previous workout
- kg / lb, dark & light themes, sound + vibration alerts, screen-wake during rests
- Barbell plate calculator and 1RM calculator
- JSON export / import for backups
- Works fully offline once loaded; installable to your home screen

## Setting up the AI coach

Two things make this more than a one-line integration, and both are unavoidable:

1. **NVIDIA's API cannot be called from a browser.** It sends no CORS headers, so the
   request is blocked before it leaves the page. Verified — a direct `fetch` fails with
   `TypeError: Failed to fetch`.
2. **An API key in a static site is public.** Anything shipped to the browser can be read
   from the page source. On a public repo, a hardcoded key is simply given away.

A small proxy fixes both: it adds the CORS headers, and it holds the key server-side so
the key never reaches the browser or the repository. `proxy/cloudflare-worker.js` is that
proxy — about 100 lines, and Cloudflare's free tier allows 100,000 requests a day.

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free, no card).
2. **Compute (Workers) → Create → Start from Hello World → Deploy.**
3. **Edit code**, replace everything with the contents of `proxy/cloudflare-worker.js`, Deploy.
4. **Settings → Variables and Secrets → Add** (some dashboards call this
   *Settings → Variables*, with an **Encrypt** button instead of a type dropdown;
   it only appears after the Worker's first deploy):
   - `NVIDIA_API_KEY` — type **Secret**, value is your `nvapi-…` key
   - `ALLOWED_ORIGIN` — type **Text**, value `https://YOUR-USERNAME.github.io`

   Then **Deploy** again.

   `ALLOWED_ORIGIN` is **optional** — without it the proxy accepts any origin,
   which is fine to get going. If you cannot find that screen at all, set
   `FALLBACK_API_KEY` and `FALLBACK_ALLOWED_ORIGIN` at the top of the Worker code
   instead. Edit those only in the Cloudflare editor; never commit a key to this
   repo.
5. In the app: **Settings → AI Coach → Set up**, paste your Worker URL with
   `/v1/chat/completions` on the end, and **leave the API key field empty** — the Worker
   holds it. Tap **Test connection**.

The Worker also restricts which models can be requested and caps `max_tokens`, so a
leaked Worker URL cannot be used to run arbitrary jobs on your account.

The app's key field exists for the case where you run it somewhere without CORS
restrictions. Anything typed there stays in `localStorage` on that device only and is
stripped from exported backups.

## Your data

Everything is stored in your browser's `localStorage` on your own device. There is no
backend and nothing is uploaded — with one exception: if you enable the AI coach, your
chat messages and a summary of your training (recent workouts, personal records,
exercise names, bodyweight) are sent to NVIDIA's API to answer each question. Clearing your browser data for the site will
erase your log, so use **Settings → Export backup** now and then.

## Running it locally

Any static file server works. From this folder:

```bash
python3 -m http.server 8777
```

Then open `http://localhost:8777`.

(Opening `index.html` directly via `file://` will not work — ES modules and the service
worker both require `http://` or `https://`.)

## Deploying to GitHub Pages

1. Create a new **public** repository on github.com (do not add a README — this folder already has one).
2. Push this folder to it:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`. Save.
4. Wait about a minute. Your app is live at
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`

### Install it on your phone

Open that URL on your phone, then:
- **iPhone (Safari):** Share → *Add to Home Screen*
- **Android (Chrome):** menu → *Install app* / *Add to Home screen*

It then launches full-screen with no browser chrome and works without a connection.

### After you make changes

Bump `CACHE` in `sw.js` (e.g. `ironlog-v2`) before pushing, so installed copies pick up
the new version instead of serving the cached one.

## Project layout

```
index.html              app shell
manifest.webmanifest    PWA metadata
sw.js                   service worker (offline cache)
css/app.css             all styling
js/app.js               router + tab bar
js/store.js             state, persistence, analytics
js/util.js              formatting and training math
js/ui.js                sheets, toasts, SVG charts
js/timer.js             rest timer, audio, wake lock
js/ai.js                AI client, context building, action parsing
js/data/exercises.js    the exercise library
js/views/               train · library · progress · history · settings · picker · exercise · chat
proxy/                  Cloudflare Worker that holds the API key and adds CORS
```

No build step. No npm. Edit a file, reload the page.

## Notes on the numbers

- **Estimated 1RM** uses the Epley formula (`weight × (1 + reps/30)`), capped at 15 reps
  because estimates get unreliable on long sets.
- **Volume** is total weight moved: for two-dumbbell exercises both dumbbells count.
- For sets logged with different left/right weights, the tracked working weight is the
  average of the two hands.
