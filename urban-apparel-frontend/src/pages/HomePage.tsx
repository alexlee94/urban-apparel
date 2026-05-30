import { useState, useEffect } from 'react';
import {
    Container, Grid, Card, CardMedia, CardContent,
    CardActions, Typography, Button, Box, Pagination,
    CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/products';
import { addToCart } from '../api/cart';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartMessage, setCartMessage] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts(page - 1);
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId: number) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await addToCart(productId, 1);
            setCartMessage('Added to cart!');
            setTimeout(() => setCartMessage(''), 2000);
        } catch (err: any) {
            setCartMessage(err.response?.data?.message || 'Failed to add to cart');
            setTimeout(() => setCartMessage(''), 2000);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {cartMessage && <Alert severity="success" sx={{ mb: 2 }}>{cartMessage}</Alert>}

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                New Arrivals
            </Typography>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="250"
                                image={product.imageUrl || 'https://via.placeholder.com/250x250?text=No+Image'}
                                alt={product.name}
                                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => navigate(`/products/${product.id}`)}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {product.categoryName || 'Uncategorized'}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    ${product.price.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={product.stock === 0}
                                    onClick={() => handleAddToCart(product.id)}
                                >
                                    Add to Cart
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
};

export default HomePage;