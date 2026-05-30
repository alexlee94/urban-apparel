import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, Card,
    CardContent, IconButton, Alert, CircularProgress,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart } from '../api/cart';
import { checkout } from '../api/orders';
import { Cart } from '../types';

const CartPage = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkingOut, setCheckingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await getCart();
            setCart(data);
        } catch (err) {
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (cartItemId: number) => {
        try {
            const updated = await removeFromCart(cartItemId);
            setCart(updated);
        } catch (err) {
            setError('Failed to remove item');
        }
    };

    const handleCheckout = async () => {
        setCheckingOut(true);
        try {
            await checkout();
            navigate('/orders');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Checkout failed');
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Your Cart
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!cart || cart.items.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            ) : (
                <>
                    {cart.items.map((item) => (
                        <Card key={item.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.productName}
                                                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        )}
                                        <Box>
                                            <Typography variant="h6">{item.productName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            ${item.subtotal.toFixed(2)}
                                        </Typography>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Total: ${cart.total.toFixed(2)}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            disabled={checkingOut}
                            onClick={handleCheckout}
                            sx={{ px: 4 }}
                        >
                            {checkingOut ? 'Processing...' : 'Checkout'}
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default CartPage;