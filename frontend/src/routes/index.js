import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Dashboard from '../components/dashboard/Dashboard';
import PropertyGrid from '../components/properties/PropertyGrid';
import PropertyDetails from '../components/properties/PropertyDetails';
import BookingForm from '../components/bookings/BookingForm';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            
            {/* Public Routes */}
            <Route path="/" element={<PropertyGrid />} />
            <Route path="/properties" element={<PropertyGrid />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/properties/:propertyId/book"
                element={
                    <ProtectedRoute>
                        <BookingForm />
                    </ProtectedRoute>
                }
            />

            {/* 404 route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes; 