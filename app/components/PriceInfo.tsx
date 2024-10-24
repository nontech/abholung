import React, { useEffect, useCallback } from 'react';

interface PriceInfoProps {
  duration: string | null;
  productPrice: string | null;
  totalPrice: number;
  setPrice: (price: number) => void;
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


const PriceInfo: React.FC<PriceInfoProps> = ({ duration, productPrice, totalPrice, setPrice }) => {
  const timeSaved = calculateTimeSaved(duration? duration: null);
  const productPriceFloat = productPrice ? parseFloat(productPrice.replace('€', '').trim()) : 0;

  const calculateTotalPrice = useCallback(() => {
    let price = timeSaved * 0.21;
    
    if (productPriceFloat > 120) {
      price += productPriceFloat * 0.1;
    }
    
    setPrice(Math.min(price, 20));
  }, [timeSaved, productPriceFloat, setPrice]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-l font-semibold text-gray-700 mb-2">Price Information</h2>
      <div className="flex flex-col">
        <div className="flex justify-between font-bold">
          <span className="text-gray-700">Total Price:</span>
          <span className="text-gray-900">{totalPrice.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
};

export default PriceInfo;
