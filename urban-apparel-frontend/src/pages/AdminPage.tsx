import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    Container, Typography, Box, Button, TextField,
    Card, CardContent, Alert, CircularProgress,
    Divider, Select, MenuItem, FormControl, InputLabel, Tab, Tabs
} from '@mui/material';
import { createProduct, uploadProductImage } from '../api/products';
import { getMyOrders } from '../api/orders';
import api from '../api/axios';
import { Order } from '../types';

const AdminPage = () => {
    const [tab, setTab] = useState(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [createdProductId, setCreatedProductId] = useState<number | null>(null);
    const [productLoading, setProductLoading] = useState(false);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        setOrdersLoading(true);
        try {
            const data = await api.get('/api/orders/all');
            setOrders(data.data.content);
        } catch {
            // fallback to user orders for now
            setOrdersLoading(false);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: number, status: string) => {
        try {
            await api.put(`/api/orders/${orderId}/status?status=${status}`);
            setSuccess('Order status updated');
            setTimeout(() => setSuccess(''), 2000);
            fetchAllOrders();
        } catch (err) {
            setError('Failed to update order status');
            setTimeout(() => setError(''), 2000);
        }
    };

    const handleCreateProduct = async (e: FormEvent) => {
        e.preventDefault();
        setProductLoading(true);
        setError('');
        try {
            const product = await createProduct({
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock),
            });
            setCreatedProductId(product.id);

            if (imageFile) {
                await uploadProductImage(product.id, imageFile);
            }

            setSuccess('Product created successfully!');
            setNewProduct({ name: '', description: '', price: '', stock: '' });
            setImageFile(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setProductLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                Admin Panel
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Add Product" />
                <Tab label="Manage Orders" />
            </Tabs>

            {/* Add Product Tab */}
            {tab === 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Add New Product
                        </Typography>
                        <Box component="form" onSubmit={handleCreateProduct}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <TextField
                                fullWidth
                                label="Price"
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Stock"
                                type="number"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                margin="normal"
                                required
                            />
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Product Image (optional)
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.files) setImageFile(e.target.files[0]);
                                    }}
                                />
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={productLoading}
                                sx={{ mt: 2 }}
                            >
                                {productLoading ? 'Creating...' : 'Create Product'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Manage Orders Tab */}
            {tab === 1 && (
                <Box>
                    {ordersLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : orders.length === 0 ? (
                        <Typography color="text.secondary">No orders found</Typography>
                    ) : (
                        orders.map((order) => (
                            <Card key={order.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                Order #{order.id}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Total: ${order.totalAmount.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <FormControl size="small" sx={{ minWidth: 150 }}>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={order.status}
                                                label="Status"
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            >
                                                <MenuItem value="PENDING">Pending</MenuItem>
                                                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                                <MenuItem value="SHIPPED">Shipped</MenuItem>
                                                <MenuItem value="DELIVERED">Delivered</MenuItem>
                                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    {order.items.map((item) => (
                                        <Typography key={item.id} variant="body2">
                                            {item.productName} × {item.quantity} — ${item.subtotal.toFixed(2)}
                                        </Typography>
                                    ))}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            )}
        </Container>
    );
};

export default AdminPage;