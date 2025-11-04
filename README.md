# 📊 Excel Analytics Platform - Full Stack

A modern, full-stack web application for Excel data analysis with interactive visualizations and AI-powered insights.

## 🏗️ Architecture

```
Excel Analytics Platform - Full Stack/
├── 🎨 client/              # Frontend (Next.js/React)
│   ├── app/               # Pages & Components
│   ├── components/        # UI Components
│   ├── lib/api.js         # API Calls to Server
│   ├── package.json       # Frontend Dependencies
│   └── .env.local         # Frontend Config
│
├── 🔧 server/              # Backend (Node.js/Express)
│   ├── models/User.js     # MongoDB Models
│   ├── routes/            # API Endpoints
│   ├── config/database.js # DB Connection
│   ├── uploads/           # File Storage
│   ├── package.json       # Backend Dependencies
│   ├── server.js          # Main Server
│   └── .env               # Backend Config
│
└── README.md              # Documentation
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Environment Setup

**Server (.env):**
```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

⚠️ **Security Note**: Never commit your actual credentials to version control. Use environment variables for production.

**Client (.env.local):**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers

**Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

## 🛠️ Tech Stack

### Frontend (Client)
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components
- **Recharts** - Data visualization

### Backend (Server)
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **SheetJS** - Excel processing

## 📱 Features

- User authentication (JWT)
- Excel file upload & processing
- Interactive data visualizations
- Real-time chart updates
- Export functionality
- Responsive design

## 🔧 Development

The application runs on two separate servers:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

API communication happens through the `/api` endpoints on the backend server.
What agreat project
