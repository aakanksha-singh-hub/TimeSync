# TimeSync - World Clock Widgets

Create embeddable world clock widgets with time zone conversion, real-time updates, and calendar integration. Perfect for blogs, Notion, and websites.

[Live Demo](https://time-sync-sigma.vercel.app)

## Features

- Search for any city
- Real-time time zone comparison
- Shareable widgets (iframe)
- Calendar export (Google, Outlook, ICS)
- Light, dark, and auto themes (toggle in top bar)
- Mobile responsive
- Manual date and time input for custom conversions

## Quick Start

### Use Online
Go to [time-sync-sigma.vercel.app](https://time-sync-sigma.vercel.app) to create widgets instantly.

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
git clone https://github.com/yourusername/timesync.git
cd timesync
npm install
npm run dev
```

## Widget Options

| Parameter     | Description                    | Values                        | Default                 |
| ------------- | ------------------------------ | ----------------------------- | ----------------------- |
| `cities`      | Comma-separated city names/IDs | `New+York,London,Tokyo`       | `new-york,london,tokyo` |
| `theme`       | Widget theme                   | `light`, `dark`, `auto`       | `auto`                  |
| `size`        | Widget size preset             | `small`, `medium`, `large`    | `medium`                |
| `time`        | Custom time (ISO format)       | `2025-07-07T14:00Z`           | current time            |
| `show24Hour`  | 24-hour format                 | `true`, `false`               | `true`                  |
| `showSeconds` | Include seconds                | `true`, `false`               | `false`                 |

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
