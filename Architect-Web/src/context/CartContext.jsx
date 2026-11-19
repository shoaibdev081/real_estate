import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

export const CartContext = createContext()

const initialState = {
  cart: [],
  wishlist: [],
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'ADD_TO_CART': {
      const existing = state.cart.find((item) => item.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item,
          ),
        }
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: action.payload.quantity || 1 }],
      }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) }
    case 'UPDATE_CART_QTY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return { ...state, cart: state.cart.filter((item) => item.id !== id) }
      }
      return {
        ...state,
        cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
      }
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.find((item) => item.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          wishlist: state.wishlist.filter((item) => item.id !== action.payload.id),
        }
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      }
    }
    case 'CLEAR_WISHLIST':
      return { ...state, wishlist: [] }
    default:
      return state
  }
}

const STORAGE_KEY = 'architecture-shop'

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          dispatch({ type: 'HYDRATE', payload: parsed })
        }
      }
    } catch {
      // ignore hydration errors
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cart: state.cart, wishlist: state.wishlist }),
      )
    } catch {
      // ignore persistence errors
    }
  }, [state.cart, state.wishlist])

  const value = useMemo(() => {
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      cart: state.cart,
      wishlist: state.wishlist,
      cartCount,
      cartTotal,
      addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
      updateCartQuantity: (id, quantity) =>
        dispatch({ type: 'UPDATE_CART_QTY', payload: { id, quantity } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      toggleWishlist: (product) => dispatch({ type: 'TOGGLE_WISHLIST', payload: product }),
      clearWishlist: () => dispatch({ type: 'CLEAR_WISHLIST' }),
      isInCart: (id) => state.cart.some((item) => item.id === id),
      isInWishlist: (id) => state.wishlist.some((item) => item.id === id),
    }
  }, [state.cart, state.wishlist])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
