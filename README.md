# CartIQ Assist — AI-Powered Grocery Decision Engine

> Helping busy urban shoppers make better grocery decisions with minimum changes and maximum nutritional impact.

![Architecture](https://img.shields.io/badge/Architecture-Multi--Agent-blueviolet) ![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB) ![GCP](https://img.shields.io/badge/Cloud-Google%20Cloud-4285F4) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│  (Vite + Tailwind v4 · Firebase Auth · Firebase Hosting)    │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐  │
│  │Onboarding│  │Cart Input│  │Results │  │Impact Charts │  │
│  └──────────┘  └──────────┘  └────────┘  └──────────────┘  │
│                       │                                     │
│              Data Access Layer (DAL)                         │
│         (No raw Firestore SDK in components)                │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP
                        ▼
┌───────────────────────────────────────────────────────────┐
│              Orchestrator (Cloud Run :8080)                │
│         Fans out to agents, collects results              │
│                                                           │
│    ┌──────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐  │
│    │Cart Parse│  │Behavior  │  │Context │  │Optimize  │  │
│    │  :8081   │  │  :8082   │  │ :8083  │  │  :8084   │  │
│    └─────┬────┘  └────┬─────┘  └───┬────┘  └────┬─────┘  │
│          │            │            │             │         │
│   Open Food     Firestore     Time/Season   Constraint    │
│   Facts API     History       Signals       Solver        │
└──────────────────────────────────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌───────────┐
    │Firestore │  │Cloud     │  │Vertex AI  │
    │(profiles,│  │Vision API│  │(Gemini)   │
    │history,  │  │(OCR)     │  │(optional) │
    │feedback) │  │          │  │           │
    └──────────┘  └──────────┘  └───────────┘
```

### Agent Roles

| Agent | Port | Role |
|-------|------|------|
| **Cart Parser** | 8081 | Classifies items, looks up nutrition via bundled DB + Open Food Facts API |
| **Behavior Analysis** | 8082 | Reads Firestore purchase history, detects snack dependency, protein deficit |
| **Context Engine** | 8083 | Injects day/time, season, lifestyle, cooking willingness signals |
| **Optimization** | 8084 | Constraint solver: produces 3-5 swaps prioritizing protein gap closure |
| **Orchestrator** | 8080 | Fans out to all agents via HTTP, aggregates results for frontend |

---

## 📂 Project Structure

```
challenge/
├── frontend/                   # React + Vite + Tailwind v4
│   ├── src/
│   │   ├── agents/             # Local agent implementations (browser fallback)
│   │   │   ├── cartParser.js
│   │   │   ├── behaviorAgent.js
│   │   │   ├── contextEngine.js
│   │   │   └── optimizationAgent.js
│   │   ├── components/         # Reusable UI components
│   │   │   ├── CartInput.jsx   # Text + image upload input
│   │   │   ├── CartSummary.jsx # Nutrition stats + item tags
│   │   │   ├── InsightCard.jsx # Behavior + context insight
│   │   │   ├── SuggestionCard.jsx # ADD/REPLACE/REMOVE cards
│   │   │   ├── ImpactChart.jsx # Before vs After comparison
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Auth + demo mode
│   │   │   ├── Onboarding.jsx  # 3-screen onboarding
│   │   │   └── Dashboard.jsx   # Main analysis view
│   │   ├── context/            # React context providers
│   │   ├── services/           # Firebase config, DAL, API client
│   │   └── data/               # Bundled grocery dataset (100+ items)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── orchestrator/           # Fan-out orchestrator
│   │   ├── index.js
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── cart-parser/            # Cart Parser Agent
│   │   ├── index.js
│   │   ├── groceryDB.json
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── behavior-agent/         # Behavior Analysis Agent
│   │   ├── index.js
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── context-engine/         # Context Engine Agent
│   │   ├── index.js
│   │   ├── package.json
│   │   └── Dockerfile
│   └── optimization/           # Optimization Agent
│       ├── index.js
│       ├── package.json
│       └── Dockerfile
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- npm 9+

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The frontend includes **local agent implementations** that run entirely in the browser, so it works without the backend services. Click **"Try Demo"** on the landing page to skip Firebase Auth.

### 2. Backend (optional, for full Cloud Run architecture)
```bash
# Install deps for each service
cd backend/orchestrator && npm install
cd ../cart-parser && npm install
cd ../behavior-agent && npm install
cd ../context-engine && npm install
cd ../optimization && npm install

# Run all services (use separate terminals)
cd backend/orchestrator && npm run dev    # :8080
cd backend/cart-parser && npm run dev     # :8081
cd backend/behavior-agent && npm run dev  # :8082
cd backend/context-engine && npm run dev  # :8083
cd backend/optimization && npm run dev    # :8084
```

---

## ☁️ GCP Deployment

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Google Sign-In provider
3. Enable **Cloud Firestore** (start in test mode)
4. Create a `.env` file in `frontend/`:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_ID=000000000
VITE_FIREBASE_APP_ID=1:000:web:000
```

### Cloud Build & Cloud Run Deployment
We've included a `cloudbuild.yaml` file that automatically builds and pushes all 5 microservice containers at once.

```bash
# 1. Set your project
export PROJECT_ID=your-gcp-project
gcloud config set project $PROJECT_ID

# 2. Submit the build to Cloud Build (builds all 5 images)
gcloud builds submit --config cloudbuild.yaml .

# 3. Deploy each service to Cloud Run
for service in orchestrator cart-parser behavior-agent context-engine optimization; do
  gcloud run deploy cartiq-$service \
    --image gcr.io/$PROJECT_ID/cartiq-$service \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
done
```

Then update the orchestrator's environment variables with each service URL:
```bash
gcloud run services update cartiq-orchestrator \
  --set-env-vars "CART_PARSER_URL=https://cartiq-cart-parser-xxx.run.app,BEHAVIOR_URL=https://cartiq-behavior-agent-xxx.run.app,CONTEXT_URL=https://cartiq-context-engine-xxx.run.app,OPTIMIZATION_URL=https://cartiq-optimization-xxx.run.app"
```

### Firebase Hosting
```bash
cd frontend
npm run build
firebase init hosting   # select your project, set public dir to "dist"
firebase deploy --only hosting
```

### Cloud Vision API (OCR)
1. Enable the Cloud Vision API in your GCP project
2. The orchestrator service handles OCR via `@google-cloud/vision`
3. Cloud Run services automatically authenticate via service account

---

## 🎯 Demo Scenario

**Input:** `Maggi, chips, biscuits, white bread, butter, cola, eggs, banana`

**Output:**
- Cart is **62% processed food**, protein deficit detected
- 3-5 suggestions:
  1. 🔄 **REPLACE** butter → peanut butter — *Spread swap, +14g protein/week*
  2. 🔄 **REPLACE** chips → roasted nuts — *Same crunch, +18g protein/week*
  3. 🔄 **REPLACE** Maggi → oats — *Same 5-min prep, +9g protein/week*
  4. ❌ **REMOVE** cola — *Zero nutrition, save ₹40/week*
  5. 🔄 **REPLACE** biscuits → dates — *Natural sweetness, no refined sugar*
- **Before:** 12% protein, 62% junk
- **After:** 31% protein, 10% junk
- **Effort:** unchanged

---

## 🔧 Google Services Used

| Service | Purpose |
|---------|---------|
| **Firestore** | User profiles, purchase history, feedback, "never suggest" lists |
| **Cloud Run** | Hosts all 5 agent APIs as serverless microservices |
| **Cloud Vision API** | OCR for offline bill/receipt scanning |
| **Vertex AI (Gemini)** | Optional: natural language reasoning for swap explanations |
| **Firebase Hosting** | Deploys the React frontend |
| **Firebase Auth** | Google Sign-In for user authentication |

---

## 📊 Data Sources

1. **Bundled Dataset** — 100+ common Indian grocery items with full macros (protein, carbs, fat, calories)
2. **Open Food Facts API** — Fallback lookup for items not in the local dataset
3. **Mock Purchase History** — Simulated data for first-time/demo users

---

## 🛡️ Code Quality

- ✅ Each agent is a **separate Cloud Run service** with clean REST API
- ✅ Agents communicate via **HTTP** (decoupled, independently deployable)
- ✅ Frontend calls an **orchestrator** that fans out to agents
- ✅ All Firestore operations go through a **Data Access Layer** (`services/dataLayer.js`)
- ✅ No raw Firebase SDK calls in UI components
- ✅ **Dockerfiles** included for every backend service
- ✅ Local agent fallbacks for offline/demo operation