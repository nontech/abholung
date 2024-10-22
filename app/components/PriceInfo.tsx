import React, { use, useEffect } from 'react';

interface PriceInfoProps {
  duration: string | null;
  productPrice: string | null;
  totalPrice: number;
  setTotalPrice: (totalPrice: number) => void;
}
const calculateTimeSaved = (duration: string | null): number => {
  if (!duration) return 0;
  const parts = duration.split(' ');
  let hours = 0;
  let minutes = 0;

  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];

    if (unit.startsWith('hour')) {
      hours = value;
    } else if (unit.startsWith('min')) {
      minutes = value;
    }
  }

  const totalMinutes = hours * 60 + minutes;
  const savedMinutes = totalMinutes * 2;
  
  return savedMinutes;
};


const PriceInfo: React.FC<PriceInfoProps> = ({ duration, productPrice, totalPrice, setTotalPrice }) => {
  const timeSaved = calculateTimeSaved(duration? duration: null);
  const productPriceFloat = productPrice ? parseFloat(productPrice.replace('€', '').trim()) : 0;

  const calculateTotalPrice = () => {
    let price = timeSaved * 0.21;
    
    if (productPriceFloat > 120) {
      price += productPriceFloat * 0.1;
    }
    
    setTotalPrice(Math.min(price, 20));
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [duration, productPrice]);

  const deliveryFee = totalPrice * 0.8;
  const platformFee = totalPrice * 0.2;

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-l font-semibold text-gray-700 mb-2">Price Information</h2>
      <div className="flex flex-col">
        <div className="flex justify-between mb-1">
          <span className="text-gray-700">Delivery Fee:</span>
          <span className="text-gray-900">{deliveryFee.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-700">Platform Fee:</span>
          <span className="text-gray-900">{platformFee.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-bold">
          <span className="text-gray-700">Total Price:</span>
          <span className="text-gray-900">{totalPrice.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

export default PriceInfo;
