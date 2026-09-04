import { Link, Navigate, Route, Routes } from 'react-router';
import { TasksPage } from './features/tasks/TasksPage';
import { ProductsPage } from './features/products/ProductsPage';
import { AuthStatus, requireAuth } from './auth';

// Tasks are private: an anonymous visitor is redirected to Auth0 before the page renders.
const ProtectedTasksPage = requireAuth(TasksPage);

export default function App() {
  return (
    <>
      <nav className="app-nav">
        <div className="app-nav-links">
          <Link to="/products">Products</Link>
          <Link to="/tasks">Tasks</Link>
        </div>
        <AuthStatus />
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/tasks" element={<ProtectedTasksPage />} />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </>
  )
}
