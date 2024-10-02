// app/components/GetOrderDetails.tsx

import { useState } from 'react';

const GetOrderDetails = () => {
  const [orderId, setOrderId] = useState('2');
  const [order, setOrder] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleGetOrder = async () => {
    try {
      const response = await fetch(`/api/get-order/${orderId}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Failed to fetch order');
        setOrder(null);
        return;
      }

      setOrder(data.order);
      setMessage('');
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setMessage('Failed to fetch order');
      setOrder(null);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center p-4">
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
        className="w-full mb-4 px-4 py-2 border rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleGetOrder}
        className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Get Order Details
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      {order && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Order Details:</h2>
          <pre className="bg-white p-4 rounded-md shadow-md mt-2">
            {JSON.stringify(order, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GetOrderDetails;
