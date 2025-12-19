import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Fade,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { companyService } from '../../services/api';

const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    companyPhoneNumber: '',
    companyEmailId: '',
    supportEmail: '',
    billingEmail: '',
    companyAddress: '',
    pincode: '',
    website: '',
    gstNumber: '',
    panNumber: '',
    bankName: '',
    bankAccountNumber: '',
    ifscCode: '',
    branchName: '',
    authorizedSignatoryName: '',
    isActive: true,
  });

  const [files, setFiles] = useState({
    companyLogo: null,
    companySeal: null,
    authorizedSignature: null,
  });

  useEffect(() => {
    if (isEditMode) {
      loadCompany();
    }
  }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const company = await companyService.getById(id);
      setFormData({
        companyName: company.companyName || '',
        companyPhoneNumber: company.companyPhoneNumber || '',
        companyEmailId: company.companyEmailId || '',
        supportEmail: company.supportEmail || '',
        billingEmail: company.billingEmail || '',
        companyAddress: company.companyAddress || '',
        pincode: company.pincode || '',
        website: company.website || '',
        gstNumber: company.gstNumber || '',
        panNumber: company.panNumber || '',
        bankName: company.bankName || '',
        bankAccountNumber: company.bankAccountNumber || '',
        ifscCode: company.ifscCode || '',
        branchName: company.branchName || '',
        authorizedSignatoryName: company.authorizedSignatoryName || '',
        isActive: company.isActive,
      });
    } catch (error) {
      console.error('Error loading company:', error);
      setError('Error loading company data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('Company Name is required');
      return false;
    }
    if (formData.companyEmailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmailId)) {
      setError('Invalid email format');
      return false;
    }
    if (formData.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) {
      setError('Invalid support email format');
      return false;
    }
    if (formData.billingEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.billingEmail)) {
      setError('Invalid billing email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const formDataToSend = new FormData();

      // Add form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Add files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      });

      if (isEditMode) {
        await companyService.update(id, formDataToSend);
        setSuccess('Company updated successfully!');
      } else {
        await companyService.create(formDataToSend);
        setSuccess('Company created successfully!');
      }

      setTimeout(() => {
        navigate('/company');
      }, 1500);
    } catch (error) {
      console.error('Error saving company:', error);
      setError(error.response?.data?.message || 'Error saving company. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/company');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Fade in={true}>
        <Box>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              p: 3,
              mb: 3,
              color: 'white',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '2.5rem',
              }}
            >
              <BusinessIcon sx={{ fontSize: 48 }} />
              {isEditMode ? 'Edit Company' : 'Add New Company'}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9, fontSize: '1.1rem' }}>
              {isEditMode
                ? 'Update company information and details'
                : 'Fill in the details to create a new company profile'}
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <BusinessIcon sx={{ color: 'primary.main', fontSize: 36 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.5rem' }}>
                      Basic Information
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Company Name"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="companyPhoneNumber"
                          value={formData.companyPhoneNumber}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Company Email"
                          name="companyEmailId"
                          value={formData.companyEmailId}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Support Email"
                          name="supportEmail"
                          value={formData.supportEmail}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          type="email"
                          label="Billing Email"
                          name="billingEmail"
                          value={formData.billingEmail}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Company Address"
                          name="companyAddress"
                          value={formData.companyAddress}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="url"
                          label="Website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tax Information */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <ReceiptIcon sx={{ color: 'primary.main', fontSize: 36 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.5rem' }}>
                      Tax Information
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="GST Number"
                          name="gstNumber"
                          value={formData.gstNumber}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="PAN Number"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Bank Information */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <AccountBalanceIcon sx={{ color: 'primary.main', fontSize: 36 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.5rem' }}>
                      Bank Information
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Bank Name"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Account Number"
                          name="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="IFSC Code"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Branch Name"
                          name="branchName"
                          value={formData.branchName}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Authorized Signatory */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <PersonIcon sx={{ color: 'primary.main', fontSize: 36 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.5rem' }}>
                      Authorized Signatory
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Authorized Signatory Name"
                          name="authorizedSignatoryName"
                          value={formData.authorizedSignatoryName}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              fontSize: '1.1rem',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontSize: '1.1rem',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* File Uploads */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <DescriptionIcon sx={{ color: 'primary.main', fontSize: 36 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.5rem' }}>
                      Documents & Images
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: 2,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              backgroundColor: 'action.hover',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CloudUploadIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                          <TextField
                            fullWidth
                            type="file"
                            label="Company Logo"
                            name="companyLogo"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: 'image/*' }}
                            onChange={handleFileChange}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: 2,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              backgroundColor: 'action.hover',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CloudUploadIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                          <TextField
                            fullWidth
                            type="file"
                            label="Company Seal"
                            name="companySeal"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: 'image/*' }}
                            onChange={handleFileChange}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box
                          sx={{
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            p: 2,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              backgroundColor: 'action.hover',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CloudUploadIcon sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
                          <TextField
                            fullWidth
                            type="file"
                            label="Authorized Signature"
                            name="authorizedSignature"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ accept: 'image/*' }}
                            onChange={handleFileChange}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    p: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleChange}
                        name="isActive"
                        color="primary"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'success.main',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'success.main',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                        Company Status: {formData.isActive ? 'Active' : 'Inactive'}
                      </Typography>
                    }
                  />
                </Card>
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    pt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={saving}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        opacity: 0.6,
                      },
                    }}
                  >
                    {saving ? 'Saving...' : isEditMode ? 'Update Company' : 'Create Company'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Fade>
    </Box>
  );
};

export default CompanyForm;

