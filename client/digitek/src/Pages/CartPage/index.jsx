// src/components/Cart.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFillCartPlusFill, BsFillCartDashFill } from "react-icons/bs";
import "./styles.css";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  clearCart,
} from "../../features/cart/cartSlice";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const cartProducts = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subtotal = cartProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSubmit = async () => {
    if (cartProducts.length === 0) {
      toast.warn("Your cart is empty.");
      return;
    }

    const formattedData = {
      products: cartProducts.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await api.post("/orders", formattedData);

      const { status, payload } = response.data;

      if (status === "success") {
        dispatch(clearCart());
        toast.success("Order created successfully!");
        navigate(`/payment/${payload.order_number}`);
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("An error occurred while submitting the order.");
    }
  };

  return (
    <>
      <main className="shopping-cart">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="cart-container">
          <section className="cart-items">
            <ul>
              {cartProducts.map(item => (
                <li className="cart-item" key={item.id}>
                  <button
                    className="remove-btn"
                    aria-label="Remove item"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <div className="product-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    <div className="product-meta">
                      <span className="brand-tag">Brand: {item.brand}</span>
                    </div>
                    <p className="product-price">
                      ${item.price} × {item.quantity}
                    </p>
                    <div className="quantity-select custom-qty-controls">
                      <button
                        onClick={() => dispatch(decrementQuantity(item.id))}
                        className="qty-btn"
                        disabled={item.quantity <= 1}
                      >
                        <BsFillCartDashFill />
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(incrementQuantity(item.id))}
                        className="qty-btn"
                        disabled={item.quantity >= item.total_quantity}
                      >
                        <BsFillCartPlusFill />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="summary-row total">
                <span>Order Total</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Order
            </button>
          </section>
        </div>
      </main>
    </>
  );
};

export default Cart;
