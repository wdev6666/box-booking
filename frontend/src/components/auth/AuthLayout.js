import React from 'react';
import { Container, Paper, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title }) => {
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        {title}
                    </Typography>
                    {children}
                </Paper>
            </Box>
        </Container>
    );
};

export default AuthLayout; 