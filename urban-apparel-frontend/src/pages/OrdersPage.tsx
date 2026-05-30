import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Card, CardContent,
    Chip, CircularProgress, Alert, Button, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import { Order } from '../types';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'CONFIRMED': return 'info';
        case 'SHIPPED': return 'primary';
        case 'DELIVERED': return 'success';
        case 'CANCELLED': return 'error';
        default: return 'default';
    }
};

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getMyOrders();
            setOrders(data.content);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
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
                My Orders
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No orders yet
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/')}
                    >
                        Start Shopping
                    </Button>
                </Box>
            ) : (
                orders.map((order) => (
                    <Card key={order.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Order #{order.id}
                                </Typography>
                                <Chip
                                    label={order.status}
                                    color={getStatusColor(order.status) as any}
                                    size="small"
                                />
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {order.items.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        {item.productName} × {item.quantity}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        ${item.subtotal.toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Total: ${order.totalAmount.toFixed(2)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default OrdersPage;