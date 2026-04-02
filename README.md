# IdeaTesseract - Multi-Dimensional Business Architect

IdeaTesseract is an advanced AI-powered business architect that transforms abstract ideas into comprehensive, multi-dimensional business plans and strategic roadmaps.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key (Get one at [aistudio.google.com](https://aistudio.google.com/))

### Installation

1. Clone the repository or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Create a `.env` file in the root directory.
   - Copy the contents from `.env.example` and fill in your Gemini API Key.

### Development

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build

Build the project for production:
```bash
npm run build
```
Start the production server:
```bash
NODE_ENV=production npm start
```

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS 4.
- **Backend:** Node.js, Express.
- **AI:** Google Gemini API (`@google/genai`).
- **Animations:** Framer Motion (`motion/react`).
- **SEO:** `react-helmet-async`, dynamic sitemaps, and structured data.

## 📂 Project Structure

- `src/`: React frontend source code.
- `src/pages/`: Main application pages (Home, StepDetails).
- `src/components/`: Reusable UI components.
- `server.ts`: Express backend server handling API routes and Vite middleware.
- `public/`: Static assets (manifest, robots.txt, sitemap).

## 📄 License

MIT License. See `LICENSE` for more details.
