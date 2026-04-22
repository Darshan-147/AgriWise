/\*\*

- Frontend Feature Structure
-
- FEATURES folder organization guide
-
- Each feature is self-contained with its own:
- - Components (specific to that feature)
- - Hooks (custom hooks for that feature)
- - Services (API calls specific to that feature)
- - Utils (feature-specific utilities)
- - Styles (feature-specific styles)
- - Types (TypeScript types for that feature)
    \*/

// ============================================
// CREDIT/RISK SCORING FEATURE
// ============================================
// Location: src/features/credit/

/_
features/credit/
├── components/
│ ├── RiskForm.jsx # Risk data form
│ ├── RiskScoreCard.jsx # Display risk score
│ └── RiskChart.jsx # Risk visualization
├── hooks/
│ ├── useRiskCalculation.js
│ └── useRiskData.js
├── services/
│ └── riskService.js # API calls for credit
├── types/
│ └── risk.types.js # Risk-related types
├── utils/
│ └── riskCalculators.js # Risk calculation logic
├── styles/
│ └── risk.css
├── Ai.jsx # Main AI prediction component
└── Form.jsx # Risk form component
_/

// Usage Example:
import RiskForm from '@/features/credit/components/RiskForm';
import { useRiskCalculation } from '@/features/credit/hooks';
import { riskService } from '@/features/credit/services/riskService';

// ============================================
// HOME PAGE FEATURE
// ============================================
// Location: src/features/home/

/_
features/home/
├── components/
│ ├── HeroSection.jsx
│ ├── FeaturesList.jsx
│ ├── TestimonialSection.jsx
│ └── CTASection.jsx
├── sections/
│ ├── About.jsx
│ ├── HowItWorks.jsx
│ └── Contact.jsx
├── Navbar.jsx # Navigation component
├── Home.jsx # Main home page
└── styles/
└── home.css
_/

// Usage Example:
import Home from '@/features/home/Home';
import Navbar from '@/features/home/Navbar';

// ============================================
// COMPONENT STRUCTURE BEST PRACTICES
// ============================================

/\*
Component Anatomy:

1. Imports (organized by type)
   - React/Libraries
   - Custom hooks
   - Components
   - Utils
   - Constants
   - Styles

2. Component definition
3. PropTypes or TypeScript types
4. Hooks (useState, useEffect, etc.)
5. Event handlers
6. JSX return
7. Export
   \*/

// GOOD COMPONENT EXAMPLE:
export function ExampleComponent({ title, onSubmit }) {
const [state, setState] = useState(null);

// Custom hooks
const { data, loading } = useCustomHook();

// Effects
useEffect(() => {
// Side effects
}, []);

// Handlers
const handleClick = () => {
// Handler logic
};

// Render
return (

<div className="component">
<h1>{title}</h1>
{loading && <Loader />}
{/_ JSX _/}
</div>
);
}

// ============================================
// HOOKS NAMING CONVENTION
// ============================================

/\*

- Custom hooks start with "use"
- Examples:
  - useAuth() # Auth context
  - useForm() # Form handling
  - useAsync() # Async operations
  - useDebounce() # Debounced values
  - useLocalStorage() # Local storage
    \*/

// ============================================
// SERVICE/API LAYER ORGANIZATION
// ============================================

/\*
services/
├── api.jsx # Base axios instance
├── auth-service.js # Auth API calls
├── credit-service.js # Credit API calls
├── data-service.js # Data API calls
└── user-service.js # User API calls

Each service should export:

- Named exports for each API method
- Proper error handling
- Request/response logging
  \*/

// Example:
export const creditService = {
storeRiskData: async (riskData) => {
try {
const response = await api.post('/credit/store', riskData);
logger.info('Risk data stored');
return response.data;
} catch (error) {
logger.error('Failed to store risk data:', error);
throw handleError(error);
}
},
};

// ============================================
// HOOKS ORGANIZATION
// ============================================

/\*
hooks/
├── useAuth.js # Auth state
├── useForm.js # Form handling
├── useAsync.js # Async operations
├── useDebounce.js # Debounce values
└── useLocalStorage.js # Local storage

Convention: Each hook in its own file
\*/

// Example Hook:
import { useCallback } from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within AuthProvider');
}
return context;
}

// ============================================
// COMPONENT IMPORT ORGANIZATION
// ============================================

/\*
Best practice import order:

1. React/External libraries
   import React, { useState, useEffect } from 'react';
   import { useNavigate } from 'react-router-dom';

2. Internal components
   import Button from '@/components/common/Button';
   import Loader from '@/components/common/Loader';

3. Custom hooks
   import { useAuth } from '@/hooks/useAuth';

4. Services/API
   import { authService } from '@/services/api';

5. Utils
   import { handleError, logger } from '@/utils';

6. Constants
   import { ROUTES, ERROR_MESSAGES } from '@/constants';

7. Styles
   import './Component.css';
   \*/

// ============================================
// FILE NAMING CONVENTIONS
// ============================================

/\*
✅ DO:

- PascalCase for components: Button.jsx, LoginForm.jsx
- camelCase for utilities: validation.js, helpers.js
- lowercase for constants: api.constants.js
- kebab-case for folders: auth-service, custom-hooks

❌ DON'T:

- homeComp/ (use features/home/)
- Farmers/ (use features/credit/)
- Input.jsx in root (move to components/common/)
- Approutes/ (delete, it's unused)
  \*/

// ============================================
// TESTING STRUCTURE (Future)
// ============================================

/\*
When adding tests:

src/
├── **tests**/
│ ├── utils/
│ │ └── validation.test.js
│ ├── hooks/
│ │ └── useAuth.test.js
│ └── components/
│ └── Button.test.jsx
\*/

export default {};
