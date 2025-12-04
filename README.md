# Tech Learning Hub 🚀

A comprehensive MERN stack application for discovering, learning, and tracking progress on modern technologies. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🎯 Core Learning Features
- **Technology Catalog**: Browse and discover trending and popular technologies
- **Structured Roadmaps**: Step-by-step learning paths with curated resources
- **Progress Tracking**: Monitor your learning journey with detailed analytics
- **Favourites System**: Save technologies for quick access and future learning
- **Personalized Recommendations**: Get suggestions based on your interests and experience

### 👤 User Management
- **JWT Authentication**: Secure login and registration system
- **Profile Management**: Update your profile, interests, and experience level
- **Learning Stats**: Track completed technologies, learning streaks, and hours spent
- **Achievement System**: Earn badges and level up as you progress

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Toast Notifications**: Get instant feedback on your actions
- **Loading States**: Beautiful skeletons and loading indicators
- **Modern UI**: Glass morphism effects, gradients, and smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom components
- **React Router**: Client-side routing
- **React Hook Form**: Form handling with validation
- **React Hot Toast**: Notification system
- **Lucide React**: Beautiful icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: Object Data Modeling (ODM)
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation
- **Rate Limiting**: API protection

## 📁 Project Structure

```
NeoCube/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Button, Card, ProgressRing, etc.
│   │   │   ├── auth/           # Login, Signup forms
│   │   │   └── Layout.jsx      # Main layout component
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Technologies.jsx
│   │   │   ├── TechnologyDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Favourites.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/           # API service functions
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── styles/             # Global styles
│   │   │   └── globals.css
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # App entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Technology.js
│   │   │   └── Analytics.js
│   │   ├── controllers/        # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── techController.js
│   │   │   └── progressController.js
│   │   ├── routes/             # Express routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── technologies.js
│   │   │   └── progress.js
│   │   ├── middleware/         # Custom middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validation.js
│   │   ├── config/             # Configuration files
│   │   │   ├── db.js
│   │   │   ├── cors.js
│   │   │   └── env.js
│   │   ├── utils/              # Helper functions
│   │   │   ├── jwt.js
│   │   │   └── validators.js
│   │   ├── seedData/           # Initial technology data
│   │   │   ├── technologies.json
│   │   │   └── seedScript.js
│   │   └── server.js           # Server entry point
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NeoCube
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Backend environment variables
   cd ../server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

   ```bash
   # Frontend environment variables
   cd ../client
   cp .env.example .env
   # Edit .env with your API URL
   ```

5. **Seed the database with technology data**
   ```bash
   cd ../server
   npm run seed
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   # Server will run on http://localhost:5000
   ```

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

### Production Build

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### User Endpoints
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/favourites` - Get user favourites
- `POST /api/v1/users/favourites/:techId` - Add to favourites
- `DELETE /api/v1/users/favourites/:techId` - Remove from favourites
- `GET /api/v1/users/dashboard` - Get dashboard data

### Technology Endpoints
- `GET /api/v1/technologies` - Get all technologies (with filtering)
- `GET /api/v1/technologies/trending` - Get trending technologies
- `GET /api/v1/technologies/:slug` - Get single technology
- `GET /api/v1/technologies/categories` - Get categories
- `GET /api/v1/technologies/tags` - Get tags

### Progress Endpoints
- `GET /api/v1/progress/:techId` - Get user progress for technology
- `POST /api/v1/progress/:techId` - Update progress
- `POST /api/v1/progress/:techId/step/:stepId` - Update individual step

## 🎯 Key Features Implemented

### ✅ Authentication System
- User registration with form validation
- JWT-based login with secure token storage
- Protected routes with authentication guards
- Password strength indicators and validation

### ✅ Technology Catalog
- Browse technologies with search and filtering
- Technology detail pages with roadmaps
- Categorized by difficulty and subject area
- Trending technologies section

### ✅ Progress Tracking
- Step-by-step roadmap completion
- Visual progress indicators (progress bars and rings)
- Learning statistics and analytics
- Achievement tracking and level system

### ✅ User Profile & Dashboard
- Personalized dashboard with learning stats
- Profile management with interests and experience level
- Learning history and progress visualization
- Favourites management system

### ✅ Modern UI/UX
- Dark/light theme toggle with system detection
- Fully responsive design for all devices
- Loading skeletons and smooth transitions
- Toast notifications for user feedback
- Glass morphism and gradient effects

### ✅ Advanced Features
- Real-time search and filtering
- Pagination for large datasets
- Error handling and validation
- Rate limiting for API protection
- Analytics tracking for user actions

## 🔧 Development Notes

### Database Schema
- **User Model**: Stores user information, progress, favourites, and statistics
- **Technology Model**: Contains technology data, roadmaps, and metadata
- **Analytics Model**: Tracks user interactions for insights

### State Management
- React Context for authentication, theme, and notifications
- Local storage for theme preferences and auth tokens
- Form state management with React Hook Form

### Performance Optimizations
- Lazy loading of route components
- Debounced search functionality
- Efficient API calls with caching
- Optimized database queries with indexing

### Security Features
- JWT authentication with secure token handling
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting and CORS protection
- Environment variable configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the MERN stack (MongoDB, Express, React, Node.js)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- UI components inspired by modern design systems

---

**Happy Learning! 🎓**