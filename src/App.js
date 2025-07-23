import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import SearchPage from './pages/SearchPage';
import AdminPage from './pages/AdminPage';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Routes>
              {/* Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Search Route - Available to all authenticated users */}
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Route - Available only to admin users */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect to search page */}
              <Route path="/" element={<Navigate to="/search" replace />} />

              {/* Catch all other routes and redirect to search */}
              <Route path="*" element={<Navigate to="/search" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
