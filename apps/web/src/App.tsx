import { Navigate, Route, Routes } from 'react-router';
import { TasksPage } from './features/tasks/TasksPage';
import { ProductsPage } from './features/products/ProductsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="*" element={<p>Page not found</p>} />
    </Routes>
  )
}
