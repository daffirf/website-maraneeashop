const express = require('express');
const router = express.Router();
const axios = require('axios');

// Marketplace products page
router.get('/', async (req, res) => {
  try {
    const { search, marketplace } = req.query;
    
    // Fetch products from all marketplaces
    let allProducts = [];
    
    try {
      const response = await axios.get(`${req.protocol}://${req.get('host')}/api/marketplace/products?keyword=${search || ''}`);
      allProducts = response.data.data || [];
    } catch (error) {
      console.error('Error fetching marketplace products:', error);
    }

    // Filter by marketplace if specified
    if (marketplace && marketplace !== 'all') {
      allProducts = allProducts.filter(product => 
        product.marketplace.toLowerCase() === marketplace.toLowerCase()
      );
    }

    res.render('marketplace/index', {
      products: allProducts,
      search: search || '',
      selectedMarketplace: marketplace || 'all',
      title: 'Marketplace Products - Maraneea Shop'
    });
  } catch (error) {
    console.error('Error loading marketplace page:', error);
    res.status(500).render('error', {
      message: 'Error loading marketplace products',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Product details from marketplace
router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { marketplace } = req.query;
    
    // This would typically fetch from the specific marketplace API
    // For now, we'll show a placeholder
    const mockProduct = {
      id,
      name: 'Product from ' + marketplace,
      price: 150000,
      image: '/images/products/placeholder-product.jpg',
      description: 'This is a product from ' + marketplace + ' marketplace.',
      rating: 4.5,
      sold: 100,
      marketplace,
      marketplace_url: `https://${marketplace}.com/product/${id}`
    };

    res.render('marketplace/product-details', {
      product: mockProduct,
      title: `${mockProduct.name} - Maraneea Shop`
    });
  } catch (error) {
    console.error('Error loading marketplace product:', error);
    res.status(500).render('error', {
      message: 'Error loading product details',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;



