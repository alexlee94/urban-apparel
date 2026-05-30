import { useState, FormEvent } from 'react';
import {
    Container, Box, TextField, Button, Typography,
    Alert, Paper, Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await login(email, password);
            loginUser(response.accessToken, response.refreshToken, response.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }} gutterBottom>
                        Urban Apparel
                    </Typography>
                    <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom color="text.secondary">
                        Sign in to your account
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 2, mb: 2, py: 1.5 }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don't have an account?{' '}
                            <Link component={RouterLink} to="/register">
                                Register
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;

