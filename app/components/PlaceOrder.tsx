import { useState } from 'react';

const PlaceOrder = () => {
  const [message, setMessage] = useState('');

  const order = {
    id: 2,
    product_url: "kitchen.com",
    product_title: "An Eggshell",
    product_pic: "https://egg.png",
    product_price: "132",
    product_listed_by: "Aman",
    delivered_by: "Mukesh"
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Failed to store order:', error);
      setMessage('Failed to store order');
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center p-4">
      <button
        onClick={handlePlaceOrder}
        className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Place Order
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default PlaceOrder;