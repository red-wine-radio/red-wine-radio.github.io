# Red Wine Radio Web Player

## Description

This project is a simple web-based radio player. It allows users to listen to the live stream of the radio station directly from a web browser. The application provides a basic interface displaying the currently playing track, volume controls, and the ability to interact with the radio station's content.

## Features

- **Radio Player:** Plays live audio stream.
- **Track Information:** Displays the current track's artist and title.
- **Volume Control:** Adjust the audio volume using the noUiSlider.
- **Track History:** Shows the last played tracks.
- **Social Media Links:** Includes links to the station's social media profiles (Instagram, Facebook, Telegram).
- **Google Analytics Integration:** Tracks user interactions and player usage with Google Analytics.

## Project Setup

1. **Clone the Repository:**
    ```
    git clone https://github.com/your-username/red-wine-radio-web-player.git
    ```

2. **Install Dependencies:**
    - Ensure you have [Node.js](https://nodejs.org/) installed.
    - Run the following commands to install dependencies:
      ```
      npm install
      ```

3. **Run the Application:**
    - Start the application using:
      ```
      npm start
      ```

    - This will launch the radio player locally at `http://localhost:3000`.

4. **Customization:**
    - Replace the **Google Analytics tracking ID** in the script with your own.
    - Modify the player URL in the audio tag to point to your radio stream URL if necessary.

## Google Analytics Integration

1. **Create a Google Analytics account** and obtain your **Tracking ID**.
2. Replace the placeholder in the script with your tracking ID.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
