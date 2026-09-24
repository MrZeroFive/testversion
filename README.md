# PPS School Tools

A single-page web app (attendance, fee receipts, and fee reminders) for Punjkora
Public High School, ready to host for free on **GitHub Pages** and installable
as an app from Chrome (or any Chromium browser) on desktop or mobile.

## 📁 What's in this folder

```
index.html          the app itself (unchanged logic, just new <head> links)
manifest.json        the web app manifest — tells the browser the app name & icons
sw.js                 tiny service worker — required for the browser's "Install" option
favicon.ico           classic favicon (shown in browser tabs)
.nojekyll             tells GitHub Pages not to run Jekyll on this repo
icons/                your uploaded checklist icon, resized to every size browsers need
  icon-16.png … icon-512.png
  source.png          your original uploaded image, kept for reference
```

## 🚀 1. Publish it on GitHub Pages

1. Create a new **public** GitHub repository (e.g. `pps-school-tools`).
2. Upload **all files in this folder**, keeping the `icons/` folder structure intact
   (drag-and-drop on github.com works, or use `git`):
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Pick branch **main** and folder **/ (root)**, then **Save**.
6. After a minute or two, your site will be live at:
   ```
   https://<your-username>.github.io/<your-repo>/
   ```

That's it — no build step, no server needed.

## 📲 2. Install it as an app (uses your icon)

Once the site is live over HTTPS (GitHub Pages gives you this automatically):

- **Chrome on desktop**: open the site → click the **install icon** (⊕) in the
  address bar, or Menu (⋮) → **Cast, save, and share → Install page as app**.
- **Chrome on Android**: open the site → Menu (⋮) → **Add to Home screen** /
  **Install app**.
- **Safari on iPhone/iPad**: open the site → Share button → **Add to Home Screen**.
- **Edge**: address bar → **Apps icon** → **Install this site as an app**.

In every case the browser reads `manifest.json`, which points at your uploaded
checklist icon (resized to 16px–512px in `icons/`), so that icon is what shows
up as the app's icon on the home screen, taskbar, or dock — not a generic globe.

## 🔧 How the icon is wired up

- `manifest.json` lists every icon size Android/desktop installs can ask for.
- `index.html` also has `<link>` tags for `favicon.ico` and `apple-touch-icon`
  so the icon shows correctly in browser tabs and on iOS home screens too.
- `sw.js` is a minimal service worker. Modern Chrome wants a service worker
  present before it offers the "Install" button, and as a bonus it caches the
  app shell so the tools still open if the connection drops.

## ✏️ Updating the icon later

If you ever want to swap the icon:
1. Replace `icons/source.png` with your new image (a square image, ideally at
   least 512×512px, works best).
2. Re-generate the sized copies (any online "PWA icon generator" or an image
   editor works) and overwrite the files in `icons/` with the same filenames.
3. Bump `CACHE_NAME` in `sw.js` (e.g. `"pps-school-tools-v2"`) so returning
   users' browsers pick up the new icon instead of the cached old one.
4. Commit and push — GitHub Pages updates automatically.

## ℹ️ Notes

- The app's own functionality (attendance, fee receipt builder, fee reminder,
  Google Drive sync, WhatsApp/SMS messages) is unchanged from your upload —
  only the `<head>` of `index.html` gained the icon/manifest links, plus a
  small service-worker registration snippet just before `</body>`.
- If you use a **project site** (`https://<user>.github.io/<repo>/`, not a
  root `<user>.github.io` repo), all paths here are relative, so no changes
  are needed either way.
