import React, { useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Payment(){
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [items, setItems] = useState(location.state?.items || [])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!token) {
      setMessage('You must be logged in to proceed to payment. Redirecting to login...')
      setTimeout(() => navigate('/user-login'), 1000)
      return
    }

    // If no items were passed, try to fetch the cart from backend (requires auth)
    const fetchCart = async () => {
      if (items && items.length > 0) return
      try {
        const res = await api.get('/api/cart/getCart')
        // map cart shape to simple items: { name, price, quantity }
        const mapped = res.data.map(i => ({ name: i.productName, price: Number(i.price), quantity: Number(i.quantity) }))
        setItems(mapped)
      } catch (err) {
        setMessage('Unable to load cart. Please login or add items before checkout.')
      }
    }

    fetchCart()
  }, [])

  const handlePay = async () =>{
    if (!items || items.length === 0) {
      setMessage('No items to checkout')
      return
    }

    if (!token) {
      setMessage('You must be logged in to checkout.')
      navigate('/user-login')
      return
    }

    setLoading(true)
    try{
      const successUrl = window.location.origin + '/'
      const cancelUrl = window.location.origin + '/cart'
      const res = await api.post('/api/payment/create-checkout-session',{ items, successUrl, cancelUrl })
      if(res.data && (res.data.url || res.data.sessionUrl)){
        // stripe lib may return url or sessionUrl depending on implementation
        window.location = res.data.url || res.data.sessionUrl
      } else if (res.data && res.data.id) {
        // fallback: open hosted checkout if backend returned id
        window.location = `https://checkout.stripe.com/pay/${res.data.id}`
      } else {
        setMessage('Payment creation failed: unexpected response')
      }
    }catch(e){
      setMessage('Payment creation failed: '+(e.response?.data?.error||e.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-8'>
      <h2 className='text-2xl font-bold mb-4'>Checkout</h2>
      {message && <p className='text-red-500 mb-4'>{message}</p>}
      <div className='mb-4'>
        {items && items.length > 0 ? (
          <ul>
            {items.map((it, idx) => (
              <li key={idx} className='mb-2'>
                {it.name} — {it.quantity} × ${it.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found for checkout.</p>
        )}
      </div>

      <button
        className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? 'Creating Checkout...' : 'Proceed to Payment'}
      </button>

      <button className='ml-4 px-4 py-2 bg-gray-200 rounded' onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}
