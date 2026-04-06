import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ws_cart') || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('ws_cart', JSON.stringify(items)) }, [items])

  const addItem = (item) => {
    setItems(p => [...p, { ...item, cartId: Date.now() }])
    toast.success('Added to cart!')
  }
  const removeItem = (cartId) => setItems(p => p.filter(i => i.cartId !== cartId))
  const clearCart = () => setItems([])
  const total = items.reduce((s, i) => s + Number(i.price || 0), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count: items.length }}>
      {children}
    </CartContext.Provider>
  )
}
