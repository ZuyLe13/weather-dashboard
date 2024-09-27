import { useState } from "react"
import { API_ROOT } from '../utils/constants'

function Subscription() {
  const [email, setEmail] = useState('')

  // Xử lý đăng ký
  const handleRegister = async () => {
    if (!email.trim()) {
      alert('Please enter a valid email address')
      return
    }

    const response = await fetch(`${API_ROOT}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()
    if (response.ok) {
      alert('A confirmation email has been sent. Please check your email.')
      setEmail('')
    } else {
      alert(result.message || 'Failed to register.')
    }
  }

  // Xử lý xóa đăng ký
  const handleUnsubscribe = async () => {
    if (!email.trim()) {
      alert('Please enter your email to unsubscribe')
      return
    }

    const response = await fetch(`${API_ROOT}/unsubscribe`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (response.ok) {
      alert('You have successfully unsubscribed.')
      setEmail('')
    } else {
      alert('Failed to unsubscribe.')
    }
  }

  return (
    <div className="lg:w-[45%] md:w-[65%] sm:w-[85%] sm:m-auto">
      <h3 className="text-xl">Register and Unsubscribe for Weather Forecast</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-[4px]"
      />

      {/* Button Register */}
      <button
        onClick={handleRegister}
        className="w-full py-2 mt-5 bg-[#5372f0] text-white rounded-[4px] hover:bg-[#3f60e3]  hover:shadow-lg duration-300">
        Register
      </button>

      {/* Button Unsubscribe */}
      <button
        onClick={handleUnsubscribe}
        className="w-full py-2 mt-5 bg-[#bf4343] text-white rounded-[4px] hover:bg-[#b43737]  hover:shadow-lg duration-300">
        Unsubscribe
      </button>
    </div>
  )
}

export default Subscription