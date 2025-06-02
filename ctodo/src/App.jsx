import { Routes, Route, Navigate } from 'react-router-dom';
import Authenticate from './Auth/Authenticate';
import Todo from './components/Todo';

export default function App() {
  return (
    <Routes>
      <Route path="/todo" element={<Todo />} />
      <Route path="/" element={<Authenticate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
