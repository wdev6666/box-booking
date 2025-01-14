import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Component imports
import UserScreen from './user/home';
import ProviderBox from './pages/ProviderBox';

export default function AppRouter() {
  const auth = useSelector((state) => state.auth);
  const role = auth?.user?.user_metadata?.role;

  return (
    <Router>
      <Routes>
        {/* Define routes for 'User' */}
        {role === 'User' && (
          <>
            <Route path="/user/home" element={<UserHome />} />
            <Route path="*" element={<Navigate to="/user/home" replace />} />
          </>
        )}

        {/* Define routes for 'Provider' */}
        {role === 'Provider' && (
          <>
            <Route path="/provider/box" element={<ProviderBox />} />
            <Route path="*" element={<Navigate to="/provider/box" replace />} />
          </>
        )}

        {/* Fallback for undefined role */}
        {role === undefined && (
          <Route path="*" element={<div>Access Denied: Role not defined</div>} />
        )}
      </Routes>
    </Router>
  );
}
