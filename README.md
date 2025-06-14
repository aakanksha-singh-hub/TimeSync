# TimeSync - Time Zone Converter

A modern, user-friendly time zone converter built with React and Vite. TimeSync helps you easily convert times between different time zones with a beautiful, intuitive interface.

## Features

- 🌍 Convert times between different time zones
- 🏙️ Select from a list of major cities/time zones
- 📅 Choose a specific date and time
- ⚡ Use current time with one click
- 📋 Copy the converted time to clipboard
- 🔄 Swap between source and target time zones
- 🎨 Beautiful, modern UI with smooth animations
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/timesync.git
cd timesync
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

1. Select a source time zone from the "From" dropdown
2. Choose a date using the calendar picker
3. Enter a time or use the "Use Current Time" button
4. Select a target time zone from the "To" dropdown
5. The converted time will be displayed automatically
6. Click the "Copy" button to copy the converted time to your clipboard
7. Use the swap button (↔️) to quickly switch between time zones

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- date-fns for date manipulation
- Lucide React for icons

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
timesync/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── lib/           # Utility functions
│   └── hooks/         # Custom React hooks
├── public/            # Static assets
└── index.html         # Entry HTML file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [date-fns](https://date-fns.org/) for date manipulation utilities
- [Lucide Icons](https://lucide.dev/) for the icon set
