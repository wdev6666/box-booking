import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../../store/slices/notificationSlice';

const Notification = () => {
    const dispatch = useDispatch();
    const { message, type, open } = useSelector(state => state.notification);

    const handleClose = () => {
        dispatch(hideNotification());
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification; 