import React, { useState } from 'react';

import { DeliveryPerson } from '../../types/common';

interface DeliveryPeopleProps {
  deliveryPeople: DeliveryPerson[];
  onSelect: (selectedPerson: DeliveryPerson) => void;
}

const DeliveryPeople: React.FC<DeliveryPeopleProps> = ({ deliveryPeople, onSelect }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const handleSelect = (person: DeliveryPerson) => {
    setSelectedPersonId(person.id);
    onSelect(person);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Select a Delivery Person</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {deliveryPeople.map((person) => (
          <div
            key={person.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedPersonId === person.id
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => handleSelect(person)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src={person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`}
                  alt={person.name}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                <p className="text-sm text-gray-500 truncate">{person.rating} ⭐</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default DeliveryPeople;