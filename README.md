# ⚡ MotionForge

> **Free, client-side motion graphics & animation studio for video editors.**
> Customize animated graphs, 3D pie charts, counters, lower thirds, and callouts — then export with **Alpha Transparency** or **Green Screen** directly to your video editing timeline.

---

## ✨ Features

- **🎬 Video Editor Ready**: Export in native **WebM with Alpha Transparency** (drag-and-drop overlay for DaVinci Resolve & Premiere Pro) or **Green Screen (#00FF00)** for CapCut and mobile apps.
- **📊 Rich Animation Templates**:
  - **Growth Bar Chart**: Dynamic rising bars with glowing gradient fills and real-time values.
  - **Smooth Curve Graph**: Bezier curve path drawing with gradient underfill and milestone tags.
  - **3D Isometric Pie Chart**: Extruded 3D cylinder with curved rim shading, rotation entrance, and floating percentage badges.
  - **Metric Counter Odometer**: Rolling numeric counters, custom prefixes/suffixes (`$`, `k`, `devs`, `%`), and trend badges.
  - **Cinematic Lower Third**: Sleek name and role broadcast overlay with line-wipe reveal.
  - **YouTube Subscribe Pop**: Interactive button click compression, subscribed checkmark, and ringing notification bell.
- **🎨 Full Customization**:
  - Live data editing (add/remove bars, change numbers, edit titles).
  - 1-click theme presets (*Cyber Indigo, Sunset Glow, Emerald Fintech, Studio Neon, Minimal Mono*) + custom color pickers.
  - Timeline controls: Play, pause, loop, scrub, and frame-by-frame step.
  - Adjustable duration (1.5s – 6.0s) and framerate (30 / 60 FPS).
  - Aspect ratios: **16:9 Landscape**, **9:16 Vertical (Shorts/Reels)**, and **1:1 Square**.
- **💸 100% Free & Zero Server Costs**:
  - All animations and video encodings happen **directly in the user's browser GPU** using the HTML5 Canvas API and WebCodecs/MediaRecorder.
  - Zero backend server required. Can be hosted for free forever on GitHub Pages, Cloudflare Pages, or Vercel.

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/motionforge.git
cd motionforge

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 🌐 Deploy to GitHub Pages (Free)

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Initial commit: MotionForge studio"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/motionforge.git
   git push -u origin main
   ```
2. Go to your GitHub repository **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
4. GitHub will automatically build and deploy the app to `https://<YOUR_USERNAME>.github.io/motionforge/`!

---

## 🛠️ Built With

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide Icons**
- **HTML5 Canvas 2D & WebCodecs API**

---

## 📄 License

MIT License — Feel free to use in personal and commercial video projects!
