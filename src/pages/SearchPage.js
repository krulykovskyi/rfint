import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search, Logout, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import {
  setSearchResults,
  setSearchQuery,
  setLoading,
  setError,
} from '../store/slices/dataSlice';
import { searchSignals } from '../services/firestoreService';

const SearchPage = () => {
  const [nameQuery, setNameQuery] = useState('');
  const [minFreq, setMinFreq] = useState('');
  const [maxFreq, setMaxFreq] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { searchResults, searchQuery, loading, error } = useSelector(
    state => state.data
  );
  const { user, isAdmin } = useSelector(state => state.auth);

  useEffect(() => {
    handleSearch({});
  }, []);

  const handleSearch = async (
    params = { name: nameQuery, minFreq, maxFreq }
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setSearchQuery(params));
      const results = await searchSignals(params);
      dispatch(setSearchResults(results));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    handleSearch();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Search Database
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.email}
          </Typography>
          {isAdmin && (
            <Button
              color="inherit"
              onClick={goToAdmin}
              startIcon={<AdminPanelSettings />}
              sx={{ mr: 1 }}
            >
              Admin
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Items
        </Typography>

        {/* Search Form */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box component="form" onSubmit={handleSearchSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={nameQuery}
                  onChange={e => setNameQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Freq"
                  variant="outlined"
                  value={minFreq}
                  onChange={e => setMinFreq(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Freq"
                  variant="outlined"
                  value={maxFreq}
                  onChange={e => setMaxFreq(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Current Search Query */}
        {searchQuery && Object.keys(searchQuery).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Name: ${searchQuery.name || ''} Freq: ${searchQuery.minFreq || ''}-${searchQuery.maxFreq || ''}`}
              onDelete={() => {
                setNameQuery('');
                setMinFreq('');
                setMaxFreq('');
                handleSearch({});
              }}
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results */}
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {searchResults.length} result(s) found
            </Typography>

            <Grid container spacing={3}>
              {searchResults.map(item => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {item.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created:{' '}
                        {item.createdAt?.toDate
                          ? item.createdAt.toDate().toLocaleDateString()
                          : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {searchResults.length === 0 && !loading && (
              <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  No items found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Try adjusting your search terms or browse all items by leaving
                  the search field empty.
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default SearchPage;
