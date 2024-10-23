import React, { useEffect, useState } from 'react';

import { DeliveryPerson } from '../../types/common';

interface DeliveryPeopleProps {
  deliveryPeople: DeliveryPerson[];
  price: number;
  setTotalPrice: (price: number) => void;
  onSelect: (selectedPerson: DeliveryPerson) => void;
  deliveryByError: string;
}

const getColor = (id: number) => {
  const color = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  return color[id];
};

const DeliveryPeople: React.FC<DeliveryPeopleProps> = ({ deliveryPeople, onSelect, deliveryByError, price, setTotalPrice }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const handleSelect = (person: DeliveryPerson, index: number) => {
    setSelectedPersonId(person.id);
    onSelect(person);
    const newPrice = getAdjustedPrice(index);
    setTotalPrice(newPrice);
  };

  useEffect(() => {
    setSelectedPersonId(null);
  }, [price]);

  const getAdjustedPrice = (index: number) => {
    if (index === 0) return price;
    if (index === 1) return price + 0.1 * price;
    if (index === 2) return price + 0.2 * price;
    return price; // Default case
  };

  return (
    <div className="mt-4 bg-gray-100"> {/* Tailwind styles for container */}
      <h2 className="text-lg mb-4 text-gray-800">Select a Delivery Person</h2> {/* Tailwind styles for title */}
      {deliveryByError && <p className="text-red-500 text-sm mt-1">{deliveryByError}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"> {/* Grid layout for cards */}
        {deliveryPeople.map((person, index) => (
          <div key={person.id} className={`p-2 border rounded-lg shadow-md cursor-pointer ${selectedPersonId === person.id ? 'bg-blue-100' : 'bg-white'}`} onClick={() => handleSelect(person, index)}> {/* Card styles */}
            <div className="flex items-center mb-2"> {/* Flex container for avatar and name */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-md font-bold mr-3" style={{ backgroundColor: getColor(person.id) }}> {/* Circular avatar with random color */}
                {person.full_name.split(' ').map(name => name[0]).join('')} {/* Initials */}
              </div>
              <div>
                <span className="text-md font-semibold text-gray-800">{person.full_name}</span> {/* Name */}
                <div className="text-yellow-500"> {/* Rating */}
                  {'★'.repeat(Math.floor(person.ratings))}
                  {'☆'.repeat(5 - Math.ceil(person.ratings))} 
                </div>
              </div>
            </div>

            <div className="text-green-500 text-md font-semibold px-3 py-1 rounded-full flex justify-between">
            {getAdjustedPrice(index).toFixed(2)} €
            {price != 0 && (<span className="line-through mr-2 text-red-500">
              {(getAdjustedPrice(index)+5).toFixed(2)} €
              </span>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPeople;