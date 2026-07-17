# Midnight Cravings 🌙

**[🔴 Live Demo: Try it here!](https://midnight-cravings-odga.onrender.com/)**

https://midnight-cravings-odga.onrender.com

Midnight Cravings is a web application that acts as your personal AI kitchen friend. Whether you have a sudden midnight craving or unexpected guests, simply type in the ingredients you have on hand, and it will magically generate a delicious recipe for you!

## Features
- **AI-Powered Recipes:** Uses the Google Gemini AI to intelligently create recipes based on what you have.
- **Ingredient Tags:** Easily enter multiple ingredients using a dynamic tag-based input system.
- **Modern UI:** A beautiful, responsive interface featuring pastel glassmorphism aesthetics.

## Tech Stack
- **Frontend:** Pure HTML, CSS , JavaScript
- **Backend:** Node.js, Express
- **AI Integration:** `@google/generative-ai` SDK

## How to Run Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```bash
   node server.js
   ```
5. Open your browser and navigate to `http://localhost:3000`.
