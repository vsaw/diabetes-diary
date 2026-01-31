# Diabetes Diary: Premium Health Tracker

A modern, high-performance web application designed for tracking health metrics with a focus on blood sugar and ovulation phases. Built with **Vue 3** and optimized for **PWA** (Progressive Web App) compatibility.

## ✨ Features

- **Interactive Calendar**: At-a-glance monthly view with quick-access health icons.
- **Smart Health Tracking**: 
  - **Blood Sugar**: Log ratings with visual indicators (Too low → Too high).
  - **Ovulation Phases**: Track biological phases (Follicular, Ovulation, Luteal, Menstrual).
  - **Comments**: Add detailed notes for any day.
- **Real-Time Updates**: Instant sync between day details and the calendar view.
- **Mobile First**: Perfectly responsive UI optimized for one-handed portrait usage on 375px+ screens.
- **Offline Capable**: PWA support via `vite-plugin-pwa`.
- **Private Data**: All data is stored locally in your browser using **IndexedDB**.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
# (Assuming you are in the project folder)

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Accessible at `http://localhost:5173` (or the port specified by Vite).

### Production Build
```bash
npm run build
```
Generates production assets in the `dist/` directory.

## 🌐 Deployment

For deployment instructions to **Strato.de** or similar webhosting services, please refer to the [Strato Deployment Guide](.gemini/antigravity/brain/c30f9ad1-09b8-4f34-b558-fa9706ef6564/strato_deployment_guide.md).

## 🛠 Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Storage**: IndexedDB (Native browser database)
- **Platform**: PWA
- **Styling**: Vanilla CSS (Modern CSS variables & Grid/Flexbox)

---
*Built with focus on Precision and Privacy.*
