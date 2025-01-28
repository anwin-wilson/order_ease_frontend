import React, { useState, useEffect } from "react";


const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/categories");
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0].category_id); // Default to the first category
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategory !== null) {
      const fetchMenuItems = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/api/categories/${activeCategory}/dishes`
          );
          const data = await response.json();
          setMenuItems(data);
        } catch (error) {
          console.error("Error fetching menu items:", error);
        }
      };

      fetchMenuItems();
    }
  }, [activeCategory]);

  const handleAddItem = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const handleRemoveItem = (itemName) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0)
      .toFixed(2);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className={`menu-page ${isCartOpen ? "cart-open" : ""}`}>
      {/* Cart Button */}
      <button className="cart-button" onClick={() => setIsCartOpen(true)}>
        Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
      </button>

      {/* Vertical Category Tabs */}
      <div className="vertical-tabs">
        {categories.map(({ category_id, name }) => (
          <button
            key={category_id}
            className={`tab ${activeCategory === category_id ? "active" : ""}`}
            onClick={() => setActiveCategory(category_id)}
          >
            <h3>{name}</h3>
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu-tiles">
        {menuItems.map(({ menu_item_id, name, is_available, price, description }) => (
          <div
            key={menu_item_id}
            className={`menu-tile ${!is_available ? "disabled" : ""}`}
          >
            <h2>{name}</h2>
            <p>{description}</p>
            <p className="price">₹{(parseFloat(price) || 0).toFixed(2)}</p>
            <button
              className="add-button"
              disabled={!is_available}
              onClick={() => handleAddItem({ name, price: parseFloat(price) || 0 })}
            >
              +
            </button>
          </div>
        ))}
      </div>

      {/* Cart Panel */}
      <div className={`cart-panel ${isCartOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={handleCloseCart}>
          ×
        </button>
        <h2>Your Cart</h2>
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <button
                className="remove-button"
                onClick={() => handleRemoveItem(item.name)}
              >
                -
              </button>
              <span>{item.name}</span>
              <span className="quantity">Qty: {item.quantity}</span>
              <span className="price">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="total">
          <p>Total: ₹{calculateTotal()}</p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
