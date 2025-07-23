import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add, Edit, Delete, Logout } from '@mui/icons-material';

import { useAuth } from '../contexts/AuthContext';
import {
  setAdminData,
  setLoading,
  setError,
  addAdminItem,
  updateAdminItem,
  deleteAdminItem,
} from '../store/slices/dataSlice';
import {
  getAllSignals,
  addSignal,
  updateSignal,
  deleteSignal,
} from '../services/firestoreService';

const AdminPage = () => {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { adminData, loading, error } = useSelector(state => state.data);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      dispatch(setLoading(true));
      const items = await getAllSignals();
      dispatch(setAdminData(items));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const handleOpen = (item = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? { name: item.name, description: item.description }
        : { name: '', description: '' }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = await updateSignal(editingItem.id, formData, user.uid);
        dispatch(updateAdminItem(updatedItem));
      } else {
        // Add new item
        const newItem = await addSignal(formData, user.uid);
        dispatch(addAdminItem(newItem));
      }
      handleClose();
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const handleDelete = async itemId => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteSignal(itemId);
        dispatch(deleteAdminItem(itemId));
      } catch (error) {
        dispatch(setError(error.message));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Welcome, {user?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Manage Items
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add New Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminData.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOpen(item)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(item.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingItem ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminPage;
