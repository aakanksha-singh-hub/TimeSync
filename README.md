# ⚡ TimeSync Core — Streamlined World Clock & Widgets

**Convert time zones instantly and create beautiful, embeddable world clock widgets.**  
Perfect for remote teams, content creators, and global coordination.

---

## 📽️ Demo Video

[![Watch the demo](https://img.youtube.com/vi/sVTSd1LP7gk/0.jpg)](https://youtu.be/sVTSd1LP7gk)

---

## 🌍 Beautiful World Clock — Widgets for Everyone

TimeSync Core helps you:
- **Convert time across zones instantly**
- **Create embeddable world clock widgets**
- **Schedule with precision**

**Perfect for:**
- Remote teams  
- Content creators  
- Global scheduling  

---

## 🚀 Try It Now

- 🔗 [Try Converter](https://time-sync-sigma.vercel.app)
- 📌 [Create Widget](https://time-sync-sigma.vercel.app)
- 🎥 [View Demo](https://time-sync-sigma.vercel.app)

---

## 🗺️ Core Highlights

✅ **🌍 Global City Search** — Find any city instantly (500+ cities worldwide)  
✅ **🔄 Real-Time Sync** — Live clocks update every second  
✅ **🔗 Shareable Embeds** — One-click embed codes for blogs, Notion, websites  
✅ **Responsive Widgets** — Beautiful, responsive design for any screen  
✅ **Light & Dark Themes** — Match your style or site  
✅ **Custom Time Input** — Pick a custom date/time to plan meetings precisely  
✅ **Calendar Friendly** — Schedule and share events with timezone clarity

---

## 🕑 Example Live Widget

**Live World Clock:**

```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo&ref=India&time=2025-07-07T14:00Z&theme=dark&size=medium"
  width="100%"
  height="250"
  frameborder="0"
></iframe>
```

---

## ⚙️ Widget Parameters

| Parameter     | Values                     | Default           |
| ------------- | -------------------------- | ----------------- |
| `cities`      | `New+York,London,Tokyo`    | `New+York,London` |
| `theme`       | `light`, `dark`, `auto`    | `auto`            |
| `size`        | `small`, `medium`, `large` | `medium`          |
| `time`        | `2025-07-07T14:00Z`        | Current time      |
| `show24Hour`  | `true`, `false`            | `true`            |
| `showSeconds` | `true`, `false`            | `false`           |

---

## 📏 Widget Sizes

| Size   | Dimensions | Max Cities | Best For             |
| ------ | ---------- | ---------- | -------------------- |
| Small  | 300×180px  | 2          | Sidebars, cards      |
| Medium | 500×250px  | 4          | Blog posts, articles |
| Large  | 700×350px  | 6          | Main content areas   |

---

## 🧩 Example Embeds

**Medium Widget**

```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo&theme=light&size=medium"
  width="500"
  height="250"
  frameborder="0"
></iframe>
```

**Large Widget with Custom Time**

```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=San+Francisco,London,Singapore&time=2025-07-07T14:00Z&theme=dark&size=large"
  width="700"
  height="350"
  frameborder="0"
></iframe>
```

**Embed in Notion**

1. Copy the iframe URL  
2. In Notion, type `/embed`  
3. Paste the URL

---

## ⚡ Tech Stack

* React 18 + TypeScript  
* Tailwind CSS  
* Framer Motion  
* Zustand (state management)  
* Luxon (time zones)  
* Radix UI  
* Vite (build tool)

---

## 🤝 Contributing

Pull requests welcome!

```bash
git clone https://github.com/YOUR_USERNAME/timesync.git
cd timesync
npm install
npm run dev
```

---

© 2025 **TimeSync Core** — Focused, fast, and built for developers.
