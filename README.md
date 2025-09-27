# 🧭 Course Compass

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-blue?logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

**Course Compass** is an AI-powered web application designed to help students and professionals navigate the vast world of online education. It provides aggregated reviews, AI-powered insights, and personalized learning paths to help users find the best online courses for their goals.

---

## ✨ Key Features

*   **AI-Powered Review Summaries**: Utilizes the Google Gemini API to analyze thousands of user reviews for a course and generate a concise, easy-to-read summary of the pros and cons.
*   **Personalized AI Learning Paths**: Users can describe their career goals, and the AI will generate a custom, step-by-step learning path, suggesting topics and skills to master.
*   **Comprehensive Course Search**: A powerful and intuitive interface to search for courses by title, description, or subject.
*   **Advanced Filtering**: Filter courses by platform, subject, skill level, price, and language to narrow down the perfect choice.
*   **AI-Driven Recommendations**: Get intelligent course suggestions based on your interests and saved courses.
*   **User Dashboard & Wishlist**: A personalized dashboard to manage saved courses (wishlist) and view recommendations. (Note: Authentication is mocked for demonstration purposes).
*   **Modern, Responsive UI**: A sleek, dark-mode interface built with Tailwind CSS that looks great on any device.

## 🚀 Live Demo

[**You can view a live demo of the project here.**](https://your-vercel-deployment-link.vercel.app)

*(Replace `your-vercel-deployment-link.vercel.app` with your actual Vercel URL after deploying.)*

## 📸 Screenshots

| Homepage                                                                                               | Courses Page with Filters                                                                                      |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| <img src="https://i.imgur.com/your-homepage-screenshot.png" alt="Homepage Screenshot">                   | <img src="https://i.imgur.com/your-coursespage-screenshot.png" alt="Courses Page Screenshot">                  |
| **Course Detail Page with AI Summary**                                                                 | **AI Learning Path Generator**                                                                                 |
| <img src="https://i.imgur.com/your-coursedetail-screenshot.png" alt="Course Detail Page Screenshot">     | <img src="https://i.imgur.com/your-learningpath-screenshot.png" alt="AI Learning Path Generator Screenshot"> |

*(To make this look great, take screenshots of your app, upload them to an image hosting service like [Imgur](https://imgur.com/), and replace the placeholder links.)*

## 🛠️ Tech Stack

*   **Frontend**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
*   **AI Integration**: [Google Gemini API (@google/genai)](https://ai.google.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Deployment**: [Vercel](https://vercel.com/)

## ⚙️ Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A Google Gemini API Key. You can get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of your project and add your Google Gemini API key:
    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 🚀 Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com/).

1.  **Push your code to a Git provider** (GitHub, GitLab, Bitbucket).
2.  **Import your project into Vercel.** Vercel will automatically detect the Vite configuration and set the build commands correctly.
3.  **Configure Environment Variables:**
    *   In your Vercel project settings, navigate to "Settings" -> "Environment Variables".
    *   Add a new variable with the name `VITE_API_KEY` and paste your Gemini API key as the value.
4.  **Deploy!** Vercel will build and deploy your application. Any subsequent pushes to your main branch will trigger automatic redeployments.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
