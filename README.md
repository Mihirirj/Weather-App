# React Weather App

A responsive weather application built with React that allows users to search for current weather conditions and hourly forecasts for cities worldwide. Users can also get weather information for their current location.

[![Weather App Screenshot]([![Weatherapp](https://github.com/user-attachments/assets/a71af196-0f6d-4060-b1dd-c7167e35e448)
])]((LINK_TO_YOUR_SCREENSHOT_HERE))
*Screenshot of the Weather App in action.*

---

## Live Demo

Check out the live version of the app here: **[YOUR_DEMO_LINK_HERE]**

---

## Features

*   **Current Weather Display:** Shows temperature, weather description, "feels like" temperature, humidity, and wind speed.
*   **Hourly Forecast:** Provides an 셔-hour forecast with temperature and weather icons for upcoming times.
*   **Interactive Hourly Forecast:** Click on an hourly forecast item to see its specific details in the main display area.
*   **City Search:** Users can search for weather by city name.
*   **Current Location Weather:** Fetches weather data based on the user's current geolocation (requires browser permission).
*   **Dynamic Weather Icons:** Displays different icons based on the weather conditions.
*   **Responsive Design:** Adapts to different screen sizes for a good user experience on desktop, tablet, and mobile devices.
*   **Automatic Refresh:** (Optional: Mention if you've fully implemented and tested this) Weather data for the last searched city refreshes periodically.

---

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast frontend build tool.
*   **JavaScript (ES6+):** Core programming language.
*   **CSS3:** For styling the application, including Flexbox and Grid for layout.
*   **OpenWeatherMap API:** Used to fetch current weather data, hourly forecasts, and for geocoding city names.
*   **HTML5:** Markup language.
*   **Git & GitHub:** For version control and hosting the repository.

---

## Setup and Installation

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/YourRepositoryName.git
    cd YourRepositoryName
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up Environment Variables:**
    *   Create a `.env` file in the root of the project.
    *   Add your OpenWeatherMap API key to it:
        ```
        VITE_OPENWEATHERMAP_API_KEY=your_actual_api_key_here
        ```
    *   You can get a free API key from [OpenWeatherMap](https://openweathermap.org/api).

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The application will typically be available at `http://localhost:5173`.

---

## Project Structure (Brief Overview)
