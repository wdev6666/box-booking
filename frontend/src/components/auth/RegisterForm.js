import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    TextField,
    Button,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../utils/validation';
import authService from '../../services/authService';
import AuthLayout from './AuthLayout';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: ''
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            try {
                setError('');
                await authService.register(values);
                navigate('/login', { 
                    state: { 
                        message: 'Registration successful! Please check your email to verify your account.' 
                    }
                });
            } catch (err) {
                setError(err.message);
            }
        }
    });

    return (
        <AuthLayout title="Register">
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <FormControl 
                    fullWidth 
                    margin="normal"
                    error={formik.touched.role && Boolean(formik.errors.role)}
                >
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formik.values.role}
                        label="Role"
                        onChange={formik.handleChange}
                    >
                        <MenuItem value="Provider">Provider</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                    </Select>
                    {formik.touched.role && formik.errors.role && (
                        <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                            {formik.errors.role}
                        </Box>
                    )}
                </FormControl>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Registering...' : 'Register'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        Already have an account? Sign In
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default RegisterForm; 