import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Grid,
  Menu,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { companyService } from '../../services/api';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCompanies(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadCompanies = async (search = '') => {
    try {
      setLoading(true);
      const data = await companyService.getAll(search || null);
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/company/add');
  };

  const handleEdit = (id) => {
    navigate(`/company/edit/${id}`);
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete) {
      try {
        await companyService.delete(companyToDelete.companyId);
        loadCompanies(searchTerm);
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Error deleting company. Please try again.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterApply = () => {
    // Apply date filter logic here
    loadCompanies(searchTerm);
    handleFilterClose();
  };

  const handleFilterClear = () => {
    setStartDate(null);
    setEndDate(null);
    loadCompanies(searchTerm);
    handleFilterClose();
  };

  const hasActiveFilter = startDate || endDate;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3, fontWeight: 'bold', fontSize: '2.5rem' }}>
          Master Data
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by Company Name, GST Number, or PAN Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant={hasActiveFilter ? 'contained' : 'outlined'}
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            color={hasActiveFilter ? 'primary' : 'inherit'}
            sx={{
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: hasActiveFilter ? undefined : 'rgba(0, 0, 0, 0.04)'
              },
              '&:focus': {
                backgroundColor: hasActiveFilter ? undefined : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            Add Company
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { p: 2, minWidth: 300 }
        }}
      >
        <DialogTitle sx={{ p: 0, pb: 2, fontSize: '1.3rem' }}>Date Filter</DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 280 }}>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            fullWidth
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
              },
            }}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            fullWidth
            value={endDate || ''}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 1 }}>
            <Button size="small" onClick={handleFilterClear} sx={{ fontSize: '1.1rem' }}>
              Clear
            </Button>
            <Button size="small" variant="contained" onClick={handleFilterApply} sx={{ fontSize: '1.1rem' }}>
              Apply
            </Button>
          </Box>
        </Box>
      </Menu>

      <TableContainer 
        component={Paper}
        sx={{
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <Table sx={{ borderCollapse: 'separate' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>Company Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>Email</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>Phone</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>GST Number</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>PAN Number</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.1rem', borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', py: 3 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', py: 3 }}>
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow 
                  key={company.companyId} 
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  <TableCell sx={{ fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>{company.companyName}</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>{company.companyEmailId || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>{company.companyPhoneNumber || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>{company.gstNumber || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>{company.panNumber || '-'}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                    <Chip
                      label={company.isActive ? 'Active' : 'Inactive'}
                      color={company.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(company.companyId)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(company)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ fontSize: '1.3rem' }}>Delete Company</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.1rem' }}>
            Are you sure you want to delete the company "{companyToDelete?.companyName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ fontSize: '1.1rem' }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ fontSize: '1.1rem' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyList;

