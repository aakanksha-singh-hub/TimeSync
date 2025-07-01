# TimeSync Core - Streamlined World Clock & Widgets

A clean, focused world clock application with timezone conversion and embeddable widgets. Built for developers who need essential timezone features without bloat.

## 📽️ Demo Video

[![Watch the demo](https://img.youtube.com/vi/sVTSd1LP7gk/0.jpg)](https://youtu.be/sVTSd1LP7gk)


## 🌍 Core Features

### World Clock + Time Conversion
- **Multiple timezone support** - Compare times across cities worldwide
- **Real-time updates** - Live clock with automatic refresh
- **12/24 hour toggle** - Flexible time format options  
- **Manual date/time input** - Custom time conversion for planning

### Widget Generator
- **Embed code (iframe)** - Copy-paste ready for websites
- **Size/theme customization** - Small, medium, large with light/dark themes
- **Shareable URLs** - Direct links for easy sharing

### Calendar Integration
- **Export to Google Calendar** - One-click calendar events
- **Export to Outlook** - Microsoft calendar support
- **ICS download** - Universal calendar file format

## Quick Start

### Use Online
Visit [time-sync-sigma.vercel.app](https://time-sync-sigma.vercel.app) to start converting times instantly.

### Embed a Widget
```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo&theme=auto&size=medium"
  width="500"
  height="250"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
></iframe>
```

### Run Locally
```bash
git clone <repository-url>
cd timesync
npm install
npm run dev
```

## Widget Parameters

| Parameter     | Values                        | Default                 |
| ------------- | ----------------------------- | ----------------------- |
| `cities`      | `New+York,London,Tokyo`       | `New+York,London`       |
| `theme`       | `light`, `dark`, `auto`       | `auto`                  |
| `size`        | `small`, `medium`, `large`    | `medium`                |
| `time`        | `2025-07-07T14:00Z`           | current time            |
| `show24Hour`  | `true`, `false`               | `true`                  |
| `showSeconds` | `true`, `false`               | `false`                 |

## Widget Sizes

| Size    | Dimensions | Max Cities | Best For             |
| ------- | ---------- | ---------- | -------------------- |
| Small   | 300×180px  | 2          | Sidebars, cards      |
| Medium  | 500×250px  | 4          | Blog posts, articles |
| Large   | 700×350px  | 6          | Main content         |

## Tech Stack
- React 18 + TypeScript
- Tailwind CSS  
- Luxon (timezone handling)
- Radix UI components
- Vite (build tool)

## Contributing

```bash
git clone <repository-url>
cd timesync
npm install
npm run dev
```

© 2025 TimeSync Core. Focused on what matters.

**Example URLs:**
- Basic: `.../embed?cities=New+York,London,Tokyo`
- Dark theme: `.../embed?cities=San+Francisco,Berlin,Singapore&theme=dark&size=large`
- Custom time: `.../embed?cities=Sydney,New+York&time=2025-07-07T14:00Z&theme=light`

## Widget Sizes

| Size    | Dimensions | Max Cities | Best For             |
| ------- | ---------- | ---------- | -------------------- |
| Small   | 300×180px  | 2          | Sidebars, cards      |
| Medium  | 500×250px  | 4          | Blog posts, articles |
| Large   | 700×350px  | 6          | Main content         |

## Example Embeds

**Blog Post Widget:**
```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo&theme=light&size=medium"
  width="500"
  height="250"
  frameborder="0"
></iframe>
```

**Meeting Scheduler:**
```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=San+Francisco,London,Singapore&time=2025-07-07T14:00Z&theme=auto&size=large"
  width="700"
  height="350"
  frameborder="0"
></iframe>
```

**Notion:**
1. Copy the iframe URL
2. In Notion, type `/embed`
3. Paste the URL

## Tech Stack
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI
- Luxon (time zones)
- Zustand (state)

## Contributing

Pull requests are welcome. To get started:
```bash
git clone https://github.com/yourusername/timesync.git
cd timesync
npm install
npm run dev
```

© 2025 TimeSync. Built for developers.
