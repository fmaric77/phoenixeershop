// Cart.js
import { useContext } from 'react';
import { CartContext } from '../CartContext'; // import CartContext instead of ProductContext

export default function Cart() {
    const { cart } = useContext(CartContext); // use CartContext instead of ProductContext

    return (
        <div>
            <h2>Shopping Cart</h2>
            <p1>dawd</p1>
            {cart.map((product, index) => (
                <div key={index}>
                    <h2>{product.name}</h2>
                    <p>{product.brand}</p>
                    <p className="price">${product.price}</p>
                    <p>{product.product_type}</p>
                    <img src={product.images[0]} alt={product.name} className="product-image" />
                </div>
            ))}
        </div>
    );
}