import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: null,
    type: 'info', // 'success', 'error', 'warning', 'info'
    open: false
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
            state.message = action.payload.message;
            state.type = action.payload.type || 'info';
            state.open = true;
        },
        hideNotification: (state) => {
            state.open = false;
        }
    }
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer; 