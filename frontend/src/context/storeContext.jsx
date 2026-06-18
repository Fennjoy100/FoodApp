import { createContext, useEffect, useState } from "react";
import { pizzaAPI, orderAPI } from "../services/api";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const [cartItems, setCartItems] = useState({});
  const [foodList, setFoodList] = useState(food_list);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch pizzas from backend (optional - can use fallback to food_list)
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await pizzaAPI.getAllPizzas();
        if (response.success && response.pizzas?.length > 0) {
          setFoodList(response.pizzas);
        }
      } catch (error) {
        console.log('Using fallback food list:', error.message);
      }
    };

    // Uncomment to fetch from backend
    // fetchPizzas();
  }, []);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: 1
      }));
    } else {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: prev[itemId] + 1
      }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1
    }));
  };

const getTotalCartAmount =() =>{
  let totalAmount =0;
  for(const item in cartItems )
  {
    if(cartItems[item]>0){
     let itemInfo = foodList.find(
  (product) => product._id.toString() === item.toString()
);

if (itemInfo) {
  totalAmount += itemInfo.price * cartItems[item];
}
    }
   
  }
  return totalAmount;
}

  // Place order with backend
  const placeOrder = async (orderData) => {
    setLoading(true);
    try {
      const items = Object.keys(cartItems).map(itemId => {
        const food = foodList.find(f => f._id.toString() === itemId.toString());
        return {
          pizza: itemId,
          quantity: cartItems[itemId],
          price: food?.price || 0,
        };
      });

      const orderPayload = {
        items,
        totalAmount: getTotalCartAmount(),
        deliveryAddress: orderData.address,
        ...orderData,
      };

      const response = await orderAPI.placeOrder(orderPayload);
      if (response.success) {
        setCartItems({});
        localStorage.removeItem('cartItems');
        return response.order;
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get cart item count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
  };

  // Clear cart
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('cartItems');
  };

  // Get delivery fee
  const getDeliveryFee = () => {
    return getTotalCartAmount() > 0 ? 2 : 0;
  };

  // Get total with delivery
  const getTotalWithDelivery = () => {
    return getTotalCartAmount() + getDeliveryFee();
  }

  

  const contextValue = {
    food_list: foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    placeOrder,
    getCartCount,
    clearCart,
    getDeliveryFee,
    getTotalWithDelivery,
    loading
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;