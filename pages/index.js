import { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../ProductContext';
import Head from 'next/head';
import Header from '../components/header';
import { CartContext } from '../CartContext';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51I4qYqLLD1wwSIh4OSZQDaiCGIfdSfbB8bFJgc0VkMdgtEUUQfwqPQ7uyMxigcsoZD1DRzPkpHO5qYIKZk0yfOzs00BvLcIZBo');

// Fake localStorage implementation
const fakeLocalStorage = {
    data: {},
    getItem(key) {
        return this.data[key];
    },
    setItem(key, value) {
        this.data[key] = value;
    },
};


// Use real localStorage in a live environment, fake one otherwise
const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : fakeLocalStorage;

export default function Home() {
    const [amount, setAmount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { products, setProducts } = useContext(ProductContext);
    const { cart, addToCart } = useContext(CartContext);

    const handleBuyClick = async (event, product) => {
        event.stopPropagation();
        const stripe = await stripePromise;

        // Call your backend to create the Checkout Session
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: product.id}) // Send product ID and unit_amount
        });

        const session = await response.json();

        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
            alert(result.error.message);
        }
    };




    // Load products from localStorage when component mounts
    useEffect(() => {
        const storedProducts = storage.getItem('products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setAmount(product.amount || 0); // Set the initial amount
        setIsModalOpen(true);
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Header />
            <Head>
                <link rel="icon" href="/image.ico" type="image/x-icon" />
            </Head>
            <div className="grid-container">
                {products
                    .filter(product => product.price !== "0.0")
                    .map((product) => (
                        <div key={product.id} className="grid-item" onClick={() => handleProductClick(product)}>
                            <h2>{product.name}</h2>
                            <img src={product.images[0]} alt={product.name} className="product-image" />
                            <div className="details">
                                <p>{product.brand}</p>
                                <p className="price">
                                    {product.price === "0.0" ? (
                                        <span>Out of Stock</span>
                                    ) : (
                                        `$${product.price}`
                                    )}
                                </p>
                                <p>{product.product_type}</p>
                                <button className="buyButton" onClick={(event) => handleBuyClick(event, product)}>Buy</button>
                                <button onClick={() => addToCart(selectedProduct)}>Add to Cart</button>



                            </div>
                        </div>
                    ))}
            </div>
            {isModalOpen && selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleModalClose}>&times;</span>
                        <div className="product-details">
                            <div className="product-info">
                                <h2>{selectedProduct.name}</h2>
                                <p>{selectedProduct.brand}</p>
                                <p className="price">
                                    {selectedProduct.price === "0.0" ? (
                                        <span>Out of Stock</span>
                                    ) : (
                                        `$${selectedProduct.price}`
                                    )}
                                </p>
                                <p>{selectedProduct.product_type}</p>
                                <p >{selectedProduct.description}</p>
                                <button className="buyButton" onClick={(event) => handleBuyClick(event, product)}>Buy</button>
                                <button onClick={() => addToCart(selectedProduct)}>Add to Cart</button>                                                   </div>
                            <div className="images-grid">
                                {selectedProduct.images.map((image, index) => (
                                    <img key={index} src={image} alt={selectedProduct.name} className={index === 0 ? "product-image title-image" : "product-image"} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}