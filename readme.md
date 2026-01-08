# RouteKeeper — React RouteGuard for role-based and protected routing.


> *Route protection and access management, simplified for React.*

**RouteKeeper** is a React routing utility that manages access and navigation intelligently. It ensures users always reach the right pages based on authentication and roles, simplifying route management and enforcing access control in any application—whether a simple dashboard or a large-scale app.

---

## Features / What It Does

### Declarative Route Guards
- Protect routes based on authentication state (`auth`) and user roles (`userRoles`) without writing repetitive logic.

### Role-Based Access Control (RABC)
- Restrict routes to users with specific roles.
- Supports inheritance across nested routes for flexible access management.

### Public, Private, and Neutral Routes
- **Public:** Accessible to all users; can redirect authenticated users.
- **Private:** Requires authentication, with optional role checks.
- **Neutral:** Always accessible, ignores authentication.

### Nested Routes Support
- Seamlessly works with deeply nested route configurations.
- Respects parent roles and route types.

### Redirect Handling
- Automatically redirect users if they try to access unauthorized routes.
- Supports `pathname`, `search`, `hash`, `state`, `replace`, `relative`, and `preventScrollReset`.

### Lazy-Loaded Routes Support
- Handles `React.lazy` routes with built-in `Suspense` fallbacks.

### Custom Fallback Screens
- **Loading screen:** `loadingScreen`
- **Private route fallback:** `privateFallback`
- **Unauthorized access screen:** `unAuthorized`
- **Not found page:** `notFound`

### Optional Error Boundary
- Wraps your app in an error boundary by default.
- Can be disabled using `disableErrorBoundary`.

### Route Change & Redirect Callbacks
- **onRouteChange:** Triggered when the current route changes.
- **onRedirect:** Triggered whenever a redirect occurs.

### Development Warnings
- Provides helpful console warnings for misconfigured routes, duplicate paths, invalid redirects, and more.

## Quick Start

### Installation

```bash

npm install routekeeper-react


yarn add routekeeper-react


pnpm add routekeeper-react
```

## 30-Second Setup


```tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RouteKeeper } from "routekeeper-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LandingPage from "./components/LandingPage";
import { defineRoutes } from 'routekeeper-react';

const userIsLoggedIn = true; 

const routes = defineRoutes([
  { path: "/", element: <Home />, type: "private" },
  { path: "/login", element: <Login />, type: "public" }
]);

const App = () => {
  return (
    <BrowserRouter>
      <RouteKeeper
        routes={routes}
        auth={userIsLoggedIn}
      />
    </BrowserRouter>
  );
};

export default App;

```

---

## Contributing

Found a bug or want to add a feature? Contributions are welcome!  

1. 🍴 Fork it  
2. 🌟 Star it (pretty please?)  
3. 🔧 Fix it  
4. 📤 PR it  
5. 🎉 Celebrate!  

Please ensure your code follows the existing style and includes clear commit messages.

---

## Documentation

Full docs, examples, and advanced usage are available on the [documentation site](https://github.com/Isaacprogi/routekeeper/docs).


## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Credits

Built by Isaac Anasonye, designed to simplify and standardize routing in React applications.  

RouteKeeper – Protecting your routes since 2025!


---

<div align="center">

**Made something awesome with RouteKeeper?** 

[⭐ Star on GitHub](https://github.com/Isaacprogi/routekeeper-react) | 
[📢 Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20RouteKeeper!) | 
[💬 Join the Discussion](https://github.com/Isaacprogi/routekeeper-react/discussions) | 
[🔗 Connect on LinkedIn](https://www.linkedin.com/in/isaacanasonye)


</div>