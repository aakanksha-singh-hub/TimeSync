# TimeZone Converter

A globally intelligent time zone converter that allows users to enter any city name worldwide and instantly resolve it to the correct time zone, accounting for daylight saving time and historical changes.

## Features

- **Fuzzy Search Input**: Users can search for city names (e.g., “New York”, “Tokyo”, “Nairobi”) and dynamically map them to their corresponding IANA time zones (e.g., America/New_York, Asia/Tokyo).
- **Current Local Time Display**: On city selection, the app displays the current local time, UTC offset, and allows users to select a custom date/time for past or future conversions.
- **Time Comparison View**: Users can add multiple cities to a comparison view, reorder or pin them, and see how a selected reference time (e.g., “Monday 3 PM in London”) maps across all added cities.
- **Real-Time Clocks**: The application features real-time ticking clocks for present times.
- **Shareable Links**: Users can generate shareable time comparison links.
- **12/24-Hour Format Toggle**: Users can toggle between 12-hour and 24-hour formats.
- **Responsive and Accessible UI**: The UI is fully responsive, elegant, and accessible, supporting dark mode, keyboard navigation, screen readers, and touch devices.

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type safety and better development experience.
- **Tailwind CSS**: For styling and responsive design.
- **Luxon / date-fns-tz / moment-timezone**: For handling time zone logic.
- **Zustand / Redux**: For state management.
- **Geo-tz / OpenCage Geocoding API / Google Maps Time Zone API**: For accurate lat-long-to-timezone resolution.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/timezone-converter.git
   ```
2. Navigate to the project directory:
   ```
   cd timezone-converter
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Usage

- Enter a city name in the search input to find its corresponding time zone.
- Select a city to view its current local time and UTC offset.
- Add multiple cities to compare their times against a selected reference time.
- Use the theme toggle to switch between light and dark modes.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.