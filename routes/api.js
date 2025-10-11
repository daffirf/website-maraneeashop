const express = require('express');
const router = express.Router();
const axios = require('axios');

// Shopee API integration
router.get('/shopee/products', async (req, res) => {
  try {
    const { keyword, limit = 20 } = req.query;
    
    // This is a placeholder for Shopee API integration
    // In a real implementation, you would use the actual Shopee API
    const mockProducts = [
      {
        id: 'shopee_1',
        name: 'Baju Muslimah Shopee 1',
        price: 150000,
        image: '/images/products/baju-muslimah-1.jpg',
        shopee_url: 'https://shopee.co.id/product/123456',
        rating: 4.8,
        sold: 150
      },
      {
        id: 'shopee_2',
        name: 'Hampers Lebaran Shopee',
        price: 250000,
        image: '/images/products/hampers-1.jpg',
        shopee_url: 'https://shopee.co.id/product/123457',
        rating: 4.9,
        sold: 89
      }
    ];

    res.json({
      success: true,
      data: mockProducts,
      total: mockProducts.length
    });
  } catch (error) {
    console.error('Shopee API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Shopee products'
    });
  }
});

// Tokopedia API integration
router.get('/tokopedia/products', async (req, res) => {
  try {
    const { keyword, limit = 20 } = req.query;
    
    // This is a placeholder for Tokopedia API integration
    const mockProducts = [
      {
        id: 'tokopedia_1',
        name: 'Kue Kering Tokopedia',
        price: 75000,
        image: '/images/products/kue-1.jpg',
        tokopedia_url: 'https://tokopedia.com/product/123456',
        rating: 4.7,
        sold: 200
      }
    ];

    res.json({
      success: true,
      data: mockProducts,
      total: mockProducts.length
    });
  } catch (error) {
    console.error('Tokopedia API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Tokopedia products'
    });
  }
});

// Bukalapak API integration
router.get('/bukalapak/products', async (req, res) => {
  try {
    const { keyword, limit = 20 } = req.query;
    
    // This is a placeholder for Bukalapak API integration
    const mockProducts = [
      {
        id: 'bukalapak_1',
        name: 'Produk Ramadhan Bukalapak',
        price: 120000,
        image: '/images/products/ramadhan-1.jpg',
        bukalapak_url: 'https://bukalapak.com/product/123456',
        rating: 4.6,
        sold: 75
      }
    ];

    res.json({
      success: true,
      data: mockProducts,
      total: mockProducts.length
    });
  } catch (error) {
    console.error('Bukalapak API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching Bukalapak products'
    });
  }
});

// Get all marketplace products
router.get('/marketplace/products', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    // Fetch from all marketplaces
    const [shopeeRes, tokopediaRes, bukalapakRes] = await Promise.allSettled([
      axios.get(`${req.protocol}://${req.get('host')}/api/shopee/products?keyword=${keyword}`),
      axios.get(`${req.protocol}://${req.get('host')}/api/tokopedia/products?keyword=${keyword}`),
      axios.get(`${req.protocol}://${req.get('host')}/api/bukalapak/products?keyword=${keyword}`)
    ]);

    const allProducts = [];
    
    if (shopeeRes.status === 'fulfilled') {
      allProducts.push(...shopeeRes.value.data.data.map(p => ({ ...p, marketplace: 'Shopee' })));
    }
    
    if (tokopediaRes.status === 'fulfilled') {
      allProducts.push(...tokopediaRes.value.data.data.map(p => ({ ...p, marketplace: 'Tokopedia' })));
    }
    
    if (bukalapakRes.status === 'fulfilled') {
      allProducts.push(...bukalapakRes.value.data.data.map(p => ({ ...p, marketplace: 'Bukalapak' })));
    }

    res.json({
      success: true,
      data: allProducts,
      total: allProducts.length
    });
  } catch (error) {
    console.error('Marketplace API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketplace products'
    });
  }
});

module.exports = router;



