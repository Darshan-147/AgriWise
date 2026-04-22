# Frontend Development Scripts & Commands

## 📦 Available NPM Scripts

```bash
# Development
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint

# Code Quality
npm run format       # Format code with Prettier (optional - add to package.json)
npm run format:check # Check if code is formatted (optional)
```

## 🚀 Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

- Browser opens at http://localhost:5173
- Hot Module Reload (HMR) enabled - changes reflect instantly
- Console shows Vite dev server ready

### 2. Code Organization

- Follow feature-based folder structure
- Keep components focused and single-responsibility
- Use custom hooks for logic extraction
- Centralize constants and config

### 3. Make Changes

- Edit files in `src/` folder
- Changes auto-reload in browser
- Check browser console for errors
- Use logger utility for debugging

### 4. Build for Production

```bash
npm run build
```

- Generates optimized build in `dist/` folder
- Min-maxed CSS, JS bundles
- Ready for deployment

### 5. Preview Production Build

```bash
npm run preview
```

- Serves the built production files locally
- Useful to test before deployment

## 🔧 Environment Setup

### Environment Variables (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_REGISTRATION_URL=http://localhost:5000/auth2/signup
VITE_LOGIN_URL=http://localhost:5000/auth2/login
# ... other endpoints
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 📝 Code Quality Standards

### ESLint

```bash
npm run lint  # Check for issues
```

### Prettier (Manual setup)

Add to package.json:

```json
"scripts": {
  "format": "prettier --write \"src/**/*.{jsx,js,css,md}\"",
  "format:check": "prettier --check \"src/**/*.{jsx,js,css,md}\""
}
```

Then use:

```bash
npm run format      # Auto-format code
npm run format:check # Check formatting
```

## 🐛 Debugging

### Using Logger

```javascript
import { logger } from '@/utils';

logger.debug('Debug message', data);
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Check Console tab for errors/logs
3. Use Network tab to inspect API calls
4. Use React DevTools extension for component inspection

## ⚡ Performance Tips

1. **Lazy load components**

```javascript
import { lazy, Suspense } from 'react';

const Component = lazy(() => import('./Component'));

<Suspense fallback={<Loader />}>
  <Component />
</Suspense>;
```

2. **Memoize components**

```javascript
import { memo } from 'react';

export default memo(MyComponent);
```

3. **Use useCallback for handlers**

```javascript
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

4. **Optimize bundle size**

- Tree-shake unused imports
- Use dynamic imports for routes
- Monitor bundle with `npm run build`

## 🔗 Useful Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

## ✅ Pre-commit Checklist

Before committing code:

- [ ] No console errors in browser
- [ ] Code formatted with Prettier
- [ ] ESLint passes (`npm run lint`)
- [ ] All imports use new constants/utils
- [ ] No hardcoded API URLs or strings
- [ ] PropTypes or TypeScript types added
- [ ] Comments explain complex logic

## 🚨 Common Issues & Solutions

| Issue                 | Solution                                       |
| --------------------- | ---------------------------------------------- |
| Port 5173 in use      | Change port in vite.config.js                  |
| Changes not reloading | Clear browser cache, restart dev server        |
| Import errors         | Use `@/` alias or relative paths               |
| API 404 errors        | Check backend is running on port 5000          |
| CORS errors           | Verify backend CORS config                     |
| Build fails           | Check for console errors, missing dependencies |

## 📚 Next Steps

1. Read [FRONTEND_OPTIMIZATION_GUIDE.md](./FRONTEND_OPTIMIZATION_GUIDE.md)
2. Review [FEATURES_STRUCTURE.md](./src/FEATURES_STRUCTURE.md)
3. Check [Constants Documentation](./src/constants/)
4. Review [Utils Documentation](./src/utils/)
