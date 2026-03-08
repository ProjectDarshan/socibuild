# SociBuild - Master Your Social Skills with AI

SociBuild is a comprehensive social skills building application powered by Google's Gemini AI and RunAnywhere's AI SDK. Practice conversations, improve your communication style, and gain insights into social dynamics through interactive AI-driven lessons and roleplay scenarios.

## Features

### 🎯 Smart Dashboard
- **Daily AI Tips**: Get personalized social advice every day.
- **Progress Tracking**: Visualize your social IQ growth over time.
- **Daily Challenges**: Complete small tasks to level up your social skills.
- **Scenario Recommendations**: AI-curated practice scenarios based on your needs.

### 💬 AI Roleplay & Practice
- **Realistic Scenarios**: Practice networking, job interviews, dates, and difficult conversations.
- **Real-time Feedback**: Receive instant analysis on your tone, clarity, and empathy.
- **Persona Variety**: Interact with diverse AI personalities to prepare for any situation.

### 👤 User Profile & Customization
- **Personalized Avatar**: Set your profile picture via URL or OAuth.
- **Progress History**: Track your completed lessons and achievements.
- **Secure Authentication**: Log in seamlessly with Google or email.

### 🛠️ Technical Highlights
- **Full-Stack Architecture**: Built with React (Frontend) and Express (Backend).
- **Secure OAuth**: Implements robust Google OAuth 2.0 with server-side token exchange.
- **Responsive Design**: Fully optimized for mobile and desktop experiences.
- **Dark Mode**: Native support for light and dark themes.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A Google Cloud Project with OAuth credentials
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/social-iq.git
   cd social-iq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Lucide React
- **Backend:** Express.js, Node.js
- **AI:** Google Gemini API (@google/genai)
- **Authentication:** OAuth 2.0 (Google)

## Project Structure

```
/
├── components/          # Reusable UI components
│   ├── Login.tsx        # Authentication & OAuth handling
│   ├── Sidebar.tsx      # Navigation & Layout
│   └── ...
├── services/            # API services
│   └── gemini.ts        # AI integration logic
├── App.tsx              # Main application component
├── server.ts            # Express backend & API routes
├── types.ts             # TypeScript interfaces
├── data.ts              # Static data & constants
├── index.css            # Global styles & Tailwind imports
└── vite.config.ts       # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
