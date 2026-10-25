<div align="center">

# Monika Kumari — Developer Portfolio

**A personal portfolio for my work, skills, and journey in software engineering.**

[![React](https://img.shields.io/badge/React-18-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![AI](https://img.shields.io/badge/AI-Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)

</div>

---

## About

I’m a Computer Science and Technology student at SAGE University, Indore, building toward a career in software engineering. This portfolio brings together my background, technical skills, selected projects, certifications, and ways to get in touch.

The site is built with React and custom CSS. It also includes an AI portfolio assistant powered by the Gemini API, with the API key kept on the Express server.

## Explore the portfolio

- **Home** — Introduction and quick links to work and contact details.
- **About** — Background and education timeline.
- **Skills** — Programming languages, web technologies, databases, tools, and CS foundations.
- **Experience** — Certifications and job simulations.
- **Projects** — Filterable project cards for web development and AI/ML work.
- **Resume** — Resume section.
- **Contact** — Social links and an EmailJS-powered contact form.
- **AI chat** — Ask questions about the portfolio and its owner. The assistant uses the supplied profile information, supports follow-up questions, and can read replies aloud using browser speech features.
- **Responsive design** — Layout adapts to desktop and mobile screens, with light and dark themes.

## Built with

| Area | Technologies |
| --- | --- |
| Frontend | React 18, JavaScript, CSS |
| Icons | React Icons |
| AI assistant | Gemini API, Axios |
| Server | Node.js, Express |
| Contact form | EmailJS |
| Deployment | Render Web Service |

## Run locally

### Requirements

- Node.js 20 or later
- npm
- A Gemini API key for the AI chat
- EmailJS service, template, and public key for the contact form

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/garimabhayanaa/portfolio.git
   cd portfolio
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Edit `.env.local` and provide the values for the variables listed below.

4. Start the API server in one terminal:

   ```bash
   node --env-file=.env.local server.js
   ```

5. Start the React development server in a second terminal:

   ```bash
   npm start
   ```

The site opens at `http://localhost:3000`. The React development server proxies `/api` requests to the Express server on port `5000`.

## Environment variables

| Variable | Used by | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Express server | Secret key used by the server to call Gemini. Keep it server-side; do not rename it to a `REACT_APP_*` variable. |
| `REACT_APP_SERVICE_ID` | React app | EmailJS service ID. |
| `REACT_APP_TEMPLATE_ID` | React app | EmailJS template ID. |
| `REACT_APP_PUBLIC_KEY` | React app | EmailJS public key. |

Never commit `.env.local` or real API credentials. The EmailJS public key is used in the browser by design; configure allowed origins and abuse protections in the EmailJS dashboard.

## Deploy to Render

Deploy as a **Web Service** so Express can serve the React build and handle Gemini requests.

1. Push the project to a GitHub repository.
2. In Render, choose **New → Blueprint** and connect the repository to apply [`render.yaml`](./render.yaml), or create a **Web Service** manually with the settings below. Do not create a Static Site: it cannot run the chat API.
3. For a manual Web Service, use these settings:

   | Setting | Value |
   | --- | --- |
   | Runtime | Node |
   | Build command | `npm install && npm run build` |
   | Start command | `node server.js` |
   | Health check path | `/api/health` |

4. Add these environment variables in the Render service settings:
   - `GEMINI_API_KEY`
   - `REACT_APP_SERVICE_ID`
   - `REACT_APP_TEMPLATE_ID`
   - `REACT_APP_PUBLIC_KEY`
5. Deploy the service. Render builds the frontend and Express serves it from the generated `build` directory.

The Gemini key must be set as `GEMINI_API_KEY` in Render—not as `REACT_APP_GEMINI_API_KEY`. Variables with the `REACT_APP_` prefix are included in the browser build, so use that prefix only for the EmailJS settings that the client requires.

## Available commands

| Command | Description |
| --- | --- |
| `npm start` | Start the React development server. |
| `npm run build` | Create an optimized production build in `build/`. |
| `npm test` | Run the Create React App test runner. |
| `node --env-file=.env.local server.js` | Start the Express API and production static server locally. |

## Project structure

```text
.
├── public/                 # Static assets and HTML entry point
├── src/
│   ├── components/         # Portfolio sections and chat
│   ├── stylesheets/        # Component and application styles
│   ├── App.js              # Application layout and navigation
│   └── index.js            # React entry point
├── server.js               # Gemini API proxy and production web server
├── .env.example            # Environment variable template
└── package.json            # Dependencies and scripts
```

## Get in touch

- **Email:** [monikakumari4687@gmail.com](mailto:monikakumari4687@gmail.com)
- **GitHub:** [Monikakumari765](https://github.com/Monikakumari765)
- **LinkedIn:** [Monika Kumari](https://www.linkedin.com/in/monika-kumari-988420394/)
- **LeetCode:** [Monikakumari765](https://leetcode.com/u/Monikakumari765/)
