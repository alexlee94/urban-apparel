import { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Button, CircularProgress,
    Alert, Chip, Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api/products';
import { addToCart } from '../api/cart';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartMessage, setCartMessage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const data = await getProductById(Number(id));
            setProduct(data);
        } catch (err) {
            setError('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await addToCart(product!.id, quantity);
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

    if (error || !product) return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Alert severity="error">{error || 'Product not found'}</Alert>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                variant="text"
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                ← Back to Products
            </Button>

            <Box sx={{ display: 'flex', gap: 6, flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Image */}
                <Box sx={{ flex: 1 }}>
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/500x500?text=No+Image'}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
                    />
                </Box>

                {/* Details */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {product.name}
                    </Typography>

                    {product.categoryName && (
                        <Chip label={product.categoryName} size="small" sx={{ mb: 2 }} />
                    )}

                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                        ${product.price.toFixed(2)}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {product.description || 'No description available.'}
                    </Typography>

                    <Typography
                        variant="body2"
                        color={product.stock > 0 ? 'success.main' : 'error.main'}
                        sx={{ mb: 3, fontWeight: 'bold' }}
                    >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Typography>

                    {cartMessage && (
                        <Alert severity="success" sx={{ mb: 2 }}>{cartMessage}</Alert>
                    )}

                    {/* Quantity selector */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            -
                        </Button>
                        <Typography variant="h6">{quantity}</Typography>
                        <Button
                            variant="outlined"
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        >
                            +
                        </Button>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={product.stock === 0}
                        onClick={handleAddToCart}
                        sx={{ py: 1.5 }}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ProductDetailPage;