// pages/api/products.js
import axios from 'axios';

const apiUrl = 'http://makeup-api.herokuapp.com/api/v1/products.json';

async function fetchProducts(queryParams) {
    const url = new URL(apiUrl);
    url.search = new URLSearchParams(queryParams).toString();
    const response = await axios.get(url.toString());
    return response.data;
}

export default async function handler(req, res) {
    try {
        const { brand, product_type, name } = req.query;
        const queryParams = {};
        if (brand) queryParams.brand = brand;
        if (product_type) queryParams.product_type = product_type;

        let products = await fetchProducts(queryParams);
        if (name) {
            const nameLower = name.toLowerCase();
            products = products.filter(
                (product) => product.name.toLowerCase().includes(nameLower)
            );
        }
        if (products.length === 0) {
            res.json({ message: 'No products found' });
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
