import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/auth';

const Navbar = () => {
    const { isAuthenticated, isAdmin, user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            // ignore
        } finally {
            logoutUser();
            navigate('/login');
        }
    };

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
                    onClick={() => navigate('/')}
                >
                    Urban Apparel
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isAuthenticated ? (
                        <>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                Hi, {user?.firstName}
                            </Typography>
                            <IconButton color="inherit" onClick={() => navigate('/cart')}>
                                <Badge color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                            <Button color="inherit" onClick={() => navigate('/orders')}>
                                Orders
                            </Button>
                            {isAdmin && (
                                <Button color="inherit" onClick={() => navigate('/admin')}>
                                    Admin
                                </Button>
                            )}
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/register')}>
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;