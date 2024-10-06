import React, { useState } from 'react';

import { DeliveryPerson } from '../../types/common';

interface DeliveryPeopleProps {
  deliveryPeople: DeliveryPerson[];
  onSelect: (selectedPerson: DeliveryPerson) => void;
}

const getColor = (id: number) => {
  const color = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  return color[id];
};

const DeliveryPeople: React.FC<DeliveryPeopleProps> = ({ deliveryPeople, onSelect }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const handleSelect = (person: DeliveryPerson) => {
    setSelectedPersonId(person.id);
    onSelect(person);
  };

  return (
    <div className="mt-4 bg-gray-100"> {/* Tailwind styles for container */}
      <h2 className="text-md mb-4 text-gray-800">Select a Delivery Person</h2> {/* Tailwind styles for title */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Grid layout for cards */}
        {deliveryPeople.map((person) => (
          <div key={person.id} className={`p-2 border rounded-lg shadow-md cursor-pointer ${selectedPersonId === person.id ? 'bg-blue-100' : 'bg-white'}`} onClick={() => handleSelect(person)}> {/* Card styles */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPeople;