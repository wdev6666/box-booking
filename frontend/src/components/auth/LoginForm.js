import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    TextField,
    Button,
    Box,
    Alert,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/validation';
import authService from '../../services/authService';
import { selectAuthError, selectAuthLoading } from '../../store/slices/authSlice';
import AuthLayout from './AuthLayout';
import { useSelector } from 'react-redux';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const error = useSelector(selectAuthError);
    const isLoading = useSelector(selectAuthLoading);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                await authService.login(values.email, values.password);
                navigate('/dashboard');
            } catch (err) {
                // Error is now handled by Redux
            }
        }
    });

    return (
        <AuthLayout title="Login">
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                    autoComplete="current-password"
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

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link to="/reset-password" style={{ textDecoration: 'none' }}>
                        Forgot password?
                    </Link>
                </Box>
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        Don't have an account? Sign Up
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default LoginForm; 