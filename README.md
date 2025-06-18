# 🌍 TimeSync - Beautiful World Clock Widgets

> **Create beautiful, embeddable world clock widgets with time zone conversion, real-time updates, and calendar integration. Perfect for blogs, Notion, and websites.**

[![Demo](https://img.shields.io/badge/🌐_Live_Demo-time--sync--sigma.vercel.app-blue?style=for-the-badge)](https://time-sync-sigma.vercel.app)
[![GitHub](https://img.shields.io/github/stars/yourusername/timesync?style=for-the-badge)](https://github.com/yourusername/timesync)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

## 🚀 Features

### 🧭 **Core Features**

- **🌍 Global City Search** - Find any city instantly with smart fuzzy search
- **🔄 Real-Time Sync** - Always accurate, live updating times
- **🔗 Shareable Embeds** - One-click iframe widgets for any website
- **📅 Calendar Integration** - Export to Google Calendar, Outlook, or ICS
- **🎨 Beautiful Themes** - Light, dark, and auto modes
- **📱 Mobile Responsive** - Perfect on any device

### 🛠️ **Embed Features**

- **Multiple Sizes** - Small, Medium, Large, and Full-Width presets
- **Live Preview** - See exactly how your widget will look
- **Copy & Paste** - Ready-to-use iframe code
- **Custom Time Support** - Show "what time will it be" scenarios
- **Responsive Design** - Adapts perfectly to any container
- **No Overflow** - Clean, properly scaled content

### 💼 **Professional Tools**

- **Embed Generator** - Visual tool with live preview
- **Multiple Export Formats** - iframe, HTML, Markdown
- **Calendar Export** - Meeting scheduling with timezone conversion
- **Shareable URLs** - Direct links with custom parameters
- **Accessibility** - WCAG compliant, keyboard navigation
- **Performance** - Optimized for fast loading

## 🎯 Perfect For

- **📝 Bloggers** - Add live world clocks to posts
- **📚 Documentation** - Show meeting times globally
- **🏢 Teams** - Coordinate across time zones
- **🎓 Educators** - Teach about global time zones
- **💻 Developers** - Embed in dashboards and apps
- **📋 Notion Users** - Rich time zone widgets

## 🚀 Quick Start

### 1. **Use Online (Recommended)**

Visit **[time-sync-sigma.vercel.app](https://time-sync-sigma.vercel.app)** and start creating widgets immediately!

### 2. **Embed a Widget**

```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo&theme=auto&size=medium"
  width="500"
  height="250"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
>
</iframe>
```

### 3. **Run Locally**

```bash
# Clone the repository
git clone https://github.com/yourusername/timesync.git
cd timesync

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Embed Parameters

Create custom widgets using URL parameters:

| Parameter     | Description                    | Values                                   | Default                 |
| ------------- | ------------------------------ | ---------------------------------------- | ----------------------- |
| `cities`      | Comma-separated city names/IDs | `New+York,London,Tokyo`                  | `new-york,london,tokyo` |
| `theme`       | Widget theme                   | `light`, `dark`, `auto`                  | `auto`                  |
| `size`        | Widget size preset             | `small`, `medium`, `large`, `full-width` | `medium`                |
| `time`        | Custom time (ISO format)       | `2025-07-07T14:00Z`                      | current time            |
| `show24Hour`  | 24-hour format                 | `true`, `false`                          | `true`                  |
| `showSeconds` | Include seconds                | `true`, `false`                          | `false`                 |

### **Example URLs**

```
# Basic widget with 3 cities
https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo

# Dark theme, large size
https://time-sync-sigma.vercel.app/embed?cities=San+Francisco,Berlin,Singapore&theme=dark&size=large

# Custom time scenario
https://time-sync-sigma.vercel.app/embed?cities=Sydney,New+York&time=2025-07-07T14:00Z&theme=light

# Full-width responsive widget
https://time-sync-sigma.vercel.app/embed?cities=Los+Angeles,Chicago,New+York,London,Paris,Tokyo&size=full-width
```

## 📐 Widget Sizes

| Size           | Dimensions | Max Cities | Best For                 |
| -------------- | ---------- | ---------- | ------------------------ |
| **Small**      | 300×180px  | 2          | Sidebars, cards          |
| **Medium**     | 500×250px  | 4          | Blog posts, articles     |
| **Large**      | 700×350px  | 6          | Main content, dashboards |
| **Full-Width** | 100%×200px | 8          | Headers, full sections   |

## 🎨 Widget Examples

### **Blog Post Widget**

```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo&theme=light&size=medium"
  width="500"
  height="250"
  frameborder="0"
>
</iframe>
```

### **Meeting Scheduler**

```html
<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=San+Francisco,London,Singapore&time=2025-07-07T14:00Z&theme=auto&size=large"
  width="700"
  height="350"
  frameborder="0"
>
</iframe>
```

### **Notion Embed**

1. Copy the iframe URL: `https://time-sync-sigma.vercel.app/embed?cities=...`
2. In Notion, type `/embed`
3. Paste the URL
4. Adjust size as needed

### **GitHub README**

```markdown
<!-- Live World Clock -->
<iframe 
  src="https://time-sync-sigma.vercel.app/embed?cities=San+Francisco,New+York,London,Tokyo&theme=light&size=large" 
  width="700" 
  height="350" 
  frameborder="0">
</iframe>
```

## 🏗️ Architecture

**Frontend Stack:**

- ⚛️ **React 18** with TypeScript
- 🎨 **Tailwind CSS** for styling
- 🎭 **Framer Motion** for animations
- 🧩 **Radix UI** for accessible components
- ⏰ **Luxon** for timezone handling
- 🗂️ **Zustand** for state management

**Features:**

- 🔍 **Smart Search** with Fuse.js fuzzy matching
- 📱 **Responsive Design** with CSS Grid/Flexbox
- ♿ **Accessibility** with ARIA labels and keyboard nav
- 🎯 **Performance** optimized with code splitting
- 🌈 **Theming** with CSS custom properties

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**

```bash
# Fork and clone the repo
git clone https://github.com/yourusername/timesync.git
cd timesync

# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   ├── EmbedGenerator/ # Embed widget generator
│   ├── TimeSync/       # Main time conversion components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # Static data (cities, timezones)
└── styles/             # Global styles
```

### **Contributing Guidelines**

1. 🍴 Fork the repository
2. 🌱 Create a feature branch: `git checkout -b feature/amazing-feature`
3. 📝 Commit changes: `git commit -m 'Add amazing feature'`
4. 📤 Push to branch: `git push origin feature/amazing-feature`
5. 🔄 Open a Pull Request

## 🐛 Issues & Support

- 🐛 **Bug Reports**: [Create an issue](https://github.com/yourusername/timesync/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/timesync/discussions)
- 📧 **Email**: support@timesync.app
- 💬 **Discord**: [Join our community](https://discord.gg/timesync)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- 🎨 **Design**: Inspired by modern design systems
- 🌍 **Timezone Data**: Powered by IANA Time Zone Database
- 🎭 **Animations**: Enhanced with Framer Motion
- ♿ **Accessibility**: Built with Radix UI primitives

## 🚀 Deployment

### **Vercel (Recommended)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/timesync)

### **Manual Deployment**

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
# Or use the included deployment scripts:

# Deploy to Netlify
npm run deploy:netlify

# Deploy to GitHub Pages
npm run deploy:gh-pages
```

## 📈 Analytics & Usage

TimeSync includes privacy-friendly analytics to understand usage patterns:

- 📊 **Widget Views**: Track embed performance
- 🌍 **Popular Cities**: See most-used locations
- 📱 **Device Types**: Optimize for your audience
- 🎨 **Theme Preferences**: Understand user preferences

_All analytics are anonymized and GDPR compliant._

## 🎯 Roadmap

### **Coming Soon**

- [ ] 🌐 **Multi-language Support** - i18n for global users
- [ ] 📊 **Analytics Dashboard** - Usage insights for embeds
- [ ] 🔔 **Notifications** - Meeting reminders across timezones
- [ ] 🎨 **Custom Themes** - Brand colors and fonts
- [ ] 📱 **Mobile Apps** - Native iOS and Android apps

### **Future Ideas**

- [ ] 🤖 **API Access** - Programmatic widget generation
- [ ] 🔌 **Integrations** - Slack, Teams, Discord bots
- [ ] 📅 **Calendar Sync** - Two-way calendar integration
- [ ] 🌦️ **Weather Integration** - Show weather with time
- [ ] 📍 **Geolocation** - Auto-detect user timezone

---

<div align="center">

### **Ready to sync the world? 🌍**

**[Try TimeSync Now](https://time-sync-sigma.vercel.app)** • **[Create Widget](https://time-sync-sigma.vercel.app/app)** • **[View Docs](https://github.com/yourusername/timesync)**

_Built with ❤️ for global teams_

</div>
