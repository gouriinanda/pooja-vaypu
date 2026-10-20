# Pooja Vaypu (പൂജ വെയ്പ്പ്) 🪔

A warm, traditional Kerala web app for the sacred Saraswati Pooja tradition — designed especially for digital readers with PDF books.

During Kerala's Navaratri festival:
- **Durgashtami (Pooja Vaypu)**: Books are offered at the altar of Goddess Saraswati, and all studies are paused.
- **Mahanavami**: Books rest with Devi, receiving divine sanctification and blessings.
- **Vijayadashami (Pooja Eduppu & Vidyarambham)**: The books are received back with blessings, studies resume, and auspicious words are traced on raw rice.

---

## 🏗️ Architecture & Tech Stack

- **Backend (`/server`)**:
  - Node.js + Express
  - MongoDB Atlas via Mongoose
  - Multer for secure PDF uploads (strict PDF validation, 20MB limit)
  - CORS, Dotenv, Static uploads serving
- **Frontend (`/client`)**:
  - React (Vite)
  - React Router
  - Plain CSS with authentic Kerala temple aesthetics (cream background, deep red, gold accents, warm glows)
  - HTML5 Canvas for the Vidyarambham raw rice tray
  - Scalable Vector Graphics (SVG) for the traditional Nilavilakku and floral garland

---

## 📁 Project Structure

```text
poojavepp/
├── server/
│   ├── models/
│   │   └── Book.js               # Mongoose schema for PDF books
│   ├── routes/
│   │   └── books.js              # Upload, fetch, place toggle, bulk return, delete
│   ├── uploads/                  # Uploaded PDF files
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env                      # MongoDB URI & Port configuration
└── client/
    ├── public/
    │   └── assets/               # Place saraswati.jpg, bell.mp3, chant.mp3 here
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation between Shelf, Altar, and Vidyarambham
    │   │   ├── Nilavilakku.jsx   # Vector Kerala standing lamp with flickering flame
    │   │   ├── Garland.jsx       # Marigold and Jasmine floral garland
    │   │   ├── OfferingsTray.jsx # Flowers, Incense, Tilak, Bell & Chant player
    │   │   ├── CountdownBanner.jsx # Real-time countdown & Demo mode override
    │   │   └── Footer.jsx        # Devotional footer
    │   ├── pages/
    │   │   ├── ShelfPage.jsx     # Wooden shelf with vertical book spines
    │   │   ├── AltarPage.jsx     # Decorated Saraswati Devi pooja altar
    │   │   └── VidyarambhamPage.jsx # Tactile raw rice drawing tray
    │   ├── api.js                # Centralized backend API client
    │   ├── config.js             # Festival dates configuration
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css             # Traditional temple aesthetics
    └── package.json
```

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd server
npm install
```

Configure `server/.env`:
```env
PORT=5000
# For local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/pooja_vaypu

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pooja_vaypu?retryWrites=true&w=majority
```

Start the backend:
```bash
node server.js
# Or with auto-reload:
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🎨 Adding Custom Media Assets

Place your media files in `client/public/assets/` using these exact filenames:
1. `saraswati.jpg`: Portrait of Goddess Saraswati (placed inside the altar frame).
2. `bell.mp3`: Sacred temple bell chime (rings when clicking the Bell offering).
3. `chant.mp3`: Devotional Saraswati Vandana / Stotram (loops when playing the chant player).

*(If any file is missing, the app handles it gracefully without crashing, displaying a friendly prompt).*

---

## 📅 Changing Festival Dates

In `client/src/config.js`, update the festival dates:
```javascript
export const POOJA_VAYPU_DATE = "2026-10-18";
export const POOJA_EDUPPU_DATE = "2026-10-21";
```
On the Altar page, you can use the interactive **🧪 Demo Mode Override** to instantly test all 3 states:
- **Before Vaypu**: Days remaining until books are placed.
- **Between Dates (Locked 🔒)**: Live countdown to Pooja Eduppu; books are locked on the altar.
- **Pooja Eduppu (Unlocked ✨)**: Books can be taken back, or returned all at once with one click.

---

## 🌐 Deployment Guide

### Backend on Render (Web Service)
1. Push your repository to GitHub.
2. Create a **New Web Service** on [Render](https://render.com/).
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node server.js`.
6. Add Environment Variable:
   - `MONGO_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`).
   - `PORT`: `5000` (or Render will provide one).

### Frontend on Vercel or Netlify
1. Create a new project pointing to your GitHub repository.
2. Set **Root Directory** to `client`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: Your deployed Render backend URL (e.g. `https://pooja-vaypu-api.onrender.com`).
