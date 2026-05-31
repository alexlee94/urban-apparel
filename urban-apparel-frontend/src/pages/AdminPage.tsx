import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
    Container, Typography, Box, Button, TextField,
    Card, CardContent, Alert, CircularProgress,
    Divider, Select, MenuItem, FormControl, InputLabel, Tab, Tabs
} from '@mui/material';
import { createProduct, uploadProductImage, getAllProductsAdmin } from '../api/products';
import api from '../api/axios';
import { Order, Product } from '../types';

const AdminPage = () => {
    const [tab, setTab] = useState(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productLoading, setProductLoading] = useState(false);
    const [updateImageFiles, setUpdateImageFiles] = useState<{ [key: number]: File }>({});

    useEffect(() => {
        fetchAllOrders();
        fetchAllProducts();
    }, []);

    const fetchAllOrders = async () => {
        setOrdersLoading(true);
        try {
            const data = await api.get('/api/orders/all');
            setOrders(data.data.content);
        } catch {
            setOrdersLoading(false);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchAllProducts = async () => {
        setProductsLoading(true);
        try {
            const data = await getAllProductsAdmin();
            setProducts(data.content);
        } catch {
            setError('Failed to load products');
        } finally {
            setProductsLoading(false);
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

            if (imageFile) {
                await uploadProductImage(product.id, imageFile);
            }

            setSuccess('Product created successfully!');
            setNewProduct({ name: '', description: '', price: '', stock: '' });
            setImageFile(null);
            fetchAllProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setProductLoading(false);
        }
    };

    const handleUpdateImage = async (productId: number) => {
        const file = updateImageFiles[productId];
        if (!file) {
            setError('Please select an image first');
            setTimeout(() => setError(''), 2000);
            return;
        }
        try {
            await uploadProductImage(productId, file);
            setSuccess('Image updated successfully!');
            setTimeout(() => setSuccess(''), 2000);
            fetchAllProducts();
            setUpdateImageFiles({ ...updateImageFiles, [productId]: undefined as any });
        } catch (err) {
            setError('Failed to update image');
            setTimeout(() => setError(''), 2000);
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
                <Tab label="Manage Products" />
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

            {/* Manage Products Tab */}
            {tab === 1 && (
                <Box>
                    {productsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        products.map((product) => (
                            <Card key={product.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                        <img
                                            src={product.imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'}
                                            alt={product.name}
                                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {product.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ${product.price.toFixed(2)} · {product.stock} in stock
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    if (e.target.files) {
                                                        setUpdateImageFiles({
                                                            ...updateImageFiles,
                                                            [product.id]: e.target.files[0]
                                                        });
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleUpdateImage(product.id)}
                                            >
                                                Update Image
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            )}

            {/* Manage Orders Tab */}
            {tab === 2 && (
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