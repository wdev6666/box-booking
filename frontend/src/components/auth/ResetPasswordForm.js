import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    TextField,
    Button,
    Box,
    Alert,
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import { resetPasswordSchema } from '../../utils/validation';
import authService from '../../services/authService';
import AuthLayout from './AuthLayout';

const ResetPasswordForm = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            try {
                setError('');
                await authService.requestPasswordReset(values.email);
                setSuccess(true);
            } catch (err) {
                setError(err.message);
            }
        }
    });

    if (success) {
        return (
            <AuthLayout title="Reset Password">
                <Alert severity="success" sx={{ mb: 2 }}>
                    Password reset instructions have been sent to your email.
                </Alert>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Please check your email and follow the instructions to reset your password.
                </Typography>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </Box>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Reset Password">
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Typography variant="body2" sx={{ mb: 3 }}>
                    Enter your email address and we'll send you instructions to reset your password.
                </Typography>

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

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Sending...' : 'Reset Password'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        Back to Login
                    </Link>
                </Box>
            </Box>
        </AuthLayout>
    );
};

export default ResetPasswordForm; 