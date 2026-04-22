# Frontend - Bluelock

Modern React 18 + Vite + Tailwind CSS frontend for the Bluelock agricultural credit platform.

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # ✨ Centralized configuration
│   ├── context/             # Global state (React Context)
│   ├── features/            # Feature modules (after optimization)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # API service layer
│   ├── utils/               # ✨ Utility functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── .env                     # Environment variables
├── .prettierrc              # Prettier config
├── vite.config.js           # Vite config
└── tailwind.config.js       # Tailwind config
```

## 🚀 Features

✅ **Authentication**

- Email/password signup
- OTP email verification
- Login with role-based access
- Forgot password & reset
- Persistent sessions with JWT

✅ **User Management**

- Farmer dashboard
- Agent dashboard
- Profile management
- Role switching

✅ **Credit Risk Assessment**

- Risk prediction with ML model
- Risk score display
- Data visualization

✅ **Multi-language Support**

- English, Hindi, Gujarati, Marathi, Punjabi, Tamil, Telugu

✅ **Modern UI/UX**

- Responsive design (Tailwind CSS)
- Smooth animations (GSAP, Framer Motion)
- Loading states & error handling
- Toast notifications

## 🛠️ Technology Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **i18next** - Internationalization
- **GSAP & Framer Motion** - Animations
- **Radix UI** - Headless components
- **Recharts** - Data visualization

## 📖 Documentation

- **[FRONTEND_OPTIMIZATION_GUIDE.md](./FRONTEND_OPTIMIZATION_GUIDE.md)** - Architecture & structure
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - Development workflow
- **[src/FEATURES_STRUCTURE.md](./src/FEATURES_STRUCTURE.md)** - Component best practices
- **[ACTION_PLAN.md](../ACTION_PLAN.md)** - Optimization tasks

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Other endpoints are auto-configured from this base URL.

## 📝 Development Commands

```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run format        # Format code (if configured)
```

## 🎨 Code Organization

### Constants

```javascript
import { API_ENDPOINTS, ROUTES, USER_ROLES } from '@/constants';
```

### Utilities

```javascript
import { logger, handleError, validateEmail, authStorage, debounce } from '@/utils';
```

### Services

```javascript
import { authService, creditService } from '@/services/api';
```

## 🧪 Testing Auth Flow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Go to http://localhost:5173
4. Sign up → Verify OTP → Login
5. Dashboard should load

## 🐛 Debugging

### Check logs

```javascript
import { logger } from '@/utils';
logger.debug('Message', data); // Only in dev
logger.info('Info');
logger.error('Error', error);
```

### Browser DevTools

- Open: F12
- Network: Check API calls have Bearer token
- Console: Check for errors/logs
- React DevTools: Inspect components

## 📱 Responsive Design

Breakpoints (Tailwind):

- Mobile: 640px
- Tablet: 768px
- Laptop: 1024px
- Desktop: 1280px

## 🚨 Common Issues

| Issue                 | Solution                      |
| --------------------- | ----------------------------- |
| Port 5173 in use      | Change in vite.config.js      |
| API 404 errors        | Check backend is running      |
| CORS errors           | Check backend CORS config     |
| Import errors         | Check file paths use @/ alias |
| Changes not reloading | Clear cache, restart server   |

## 📚 Best Practices

1. Use constants for all hardcoded values
2. Use storage utility instead of localStorage
3. Use error handler for API errors
4. Use logger for debugging
5. Use validation utilities for forms
6. Keep components focused & small
7. Extract logic to custom hooks
8. Use feature-based folder structure

## 🔗 Resources

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [i18next](https://www.i18next.com/)

## 📞 Support

For issues or questions:

1. Check documentation files
2. Check browser console (F12)
3. Check network tab for API errors
4. Review error messages in UI

## ✅ Production Checklist

- [ ] All environment variables set
- [ ] Backend API running
- [ ] CORS properly configured
- [ ] Error handling tested
- [ ] Auth flow tested
- [ ] All features tested
- [ ] No console errors
- [ ] Build passes: `npm run build`
- [ ] Performance optimized
- [ ] Security review done

---

**Made with ❤️ for Bluelock - Agricultural Credit Platform**
