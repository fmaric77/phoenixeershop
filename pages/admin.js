import { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../ProductContext';
import { UserContext } from '../UserContext';
import { useRouter } from 'next/router';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
const stripe = new Stripe('sk_test_51I4qYqLLD1wwSIh4pGFp9GuqYmbV7lL8jgLVdMZJ7XADJ6HyAk61E8eBHP7P2WMPedoq1g78xLWxbqvb1hb1HXN800l5nI7G8o');

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

// Use real localStorage in live environment, fake one otherwise
const storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : fakeLocalStorage;

export default function Admin() {

    const { products, setProducts } = useContext(ProductContext);
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Load products from localStorage when component mounts
    useEffect(() => {
        const storedProducts = storage.getItem('products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
    }, []);

    // Save products to localStorage whenever they change
    useEffect(() => {
        storage.setItem('products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create product on Stripe first
        const stripeProduct = await stripe.products.create({
            name,
            description,
            metadata: {
                // No need to set productId here anymore
            },
        });
        console.log(`Stripe product ID: ${stripeProduct.id}`); // Log the Stripe product ID

        const newProduct = {
            id: stripeProduct.id, // Use Stripe product ID instead of UUID
            name,
            description,
            price,
            images,
        };
        console.log(`New product ID: ${newProduct.id}`); // Log the new product ID


        setProducts((prevProducts) => [...prevProducts, newProduct]);

        setName('');
        setDescription('');
        setPrice('');
        setImages([]);

        const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: parseInt(newProduct.price) * 100, // Stripe uses cents, not dollars
            currency: 'usd',
        });

        alert('Product added successfully');
    };


    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    resolve(reader.result);
                };

                reader.onerror = reject;

                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((values) => {
            setImages(values);
        });
    };

    const handleRemoveProduct = async (index, event) => {
        event.stopPropagation();

        // Delete product on site
        setProducts((prevProducts) => prevProducts.filter((product, i) => i !== index));
    };
    const handleEditProduct = (product, index, event) => {
        event.stopPropagation();
        setEditingProduct({ ...product, index });
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        setProducts((prevProducts) => prevProducts.map((product, i) => i !== editingProduct.index ? product : editingProduct));

        setEditingProduct(null);
        setShowEditModal(false);

        alert('Product edited successfully');
    };

    const handleEditImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const readers = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    resolve(reader.result);
                };

                reader.onerror = reject;

                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((values) => {
            setEditingProduct((prevProduct) => ({ ...prevProduct, images: values }));
        });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleCloseModal = () => {
        setShowProductModal(false);
        setShowEditModal(false);
    };

    const handleAddToCart = (product) => {
        // Add your logic to add the product to the cart
    };

    const handleBuy = (product) => {
        // Add your logic to buy the product
    };

    return (
        <div>
            <div className="header">
                <h1>Add Product</h1>
                <form onSubmit={handleSubmit} className="form">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input" required />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input" required />                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="input" />
                    <input type="file" onChange={handleImageUpload} multiple required />
                    <button type="submit">Add Product</button>
                </form>
            </div>
            <div className="grid-container">
                {products.map((product, index) => (
                    <div key={index} className="grid-item" onClick={() => handleProductClick(product)}>
                        <h2 className="product-name">{product.name}</h2>
                        <img src={product.images[0]} alt={product.name} className="product-image" />
                        <div className="details">
                            <p>${product.price}</p>
                        </div>
                        <button onClick={(event) => handleRemoveProduct(index, event)}>Remove</button>
                        <button onClick={(event) => handleEditProduct(product, index, event)}>Edit</button>
                    </div>
                ))}
            </div>
            {showProductModal && selectedProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <div className="product-details">
                            <h2>{selectedProduct.name}</h2>
                            <p>{selectedProduct.description}</p>
                            <div className="images-grid">
                                {selectedProduct.images.map((image, index) => (
                                    <img key={index} src={image} alt={selectedProduct.name} className={index === 0 ? "product-image title-image" : "product-image"} />
                                ))}
                            </div>
                           
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && editingProduct && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
                        <div className="edit-form">
                            <h1>Edit Product</h1>
                            <form onSubmit={handleEditSubmit}>
                                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct((prevProduct) => ({ ...prevProduct, name: e.target.value }))} />
                                <textarea value={editingProduct.description} onChange={(e) => setEditingProduct((prevProduct) => ({ ...prevProduct, description: e.target.value }))} />                                <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct((prevProduct) => ({ ...prevProduct, price: e.target.value }))} />
                                <input type="file" onChange={handleEditImageUpload} multiple />
                                {editingProduct.images.map((image, index) => (
                                    <img key={index} src={image} alt={editingProduct.name} className="product-image" />
                                ))}
                                <button type="submit">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}