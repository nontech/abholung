import React, { useState } from 'react';

import { DeliveryPerson } from '../../types/common';

interface DeliveryPeopleProps {
  deliveryPeople: DeliveryPerson[];
  onSelect: (selectedPerson: DeliveryPerson) => void;
}

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const DeliveryPeople: React.FC<DeliveryPeopleProps> = ({ deliveryPeople, onSelect }) => {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const handleSelect = (person: DeliveryPerson) => {
    setSelectedPersonId(person.id);
    onSelect(person);
  };

  return (
    <div className="mt-4 bg-gray-100"> {/* Tailwind styles for container */}
      <h2 className="text-xl mb-4 text-gray-800">Select a Delivery Person</h2> {/* Tailwind styles for title */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Grid layout for cards */}
        {deliveryPeople.map((person) => (
          <div key={person.id} className={`p-4 border rounded-lg shadow-md cursor-pointer ${selectedPersonId === person.id ? 'bg-blue-100' : 'bg-white'}`} onClick={() => handleSelect(person)}> {/* Card styles */}
            <div className="flex items-center mb-2"> {/* Flex container for avatar and name */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-3" style={{ backgroundColor: getRandomColor() }}> {/* Circular avatar with random color */}
                {person.full_name.split(' ').map(name => name[0]).join('')} {/* Initials */}
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-800">{person.full_name}</span> {/* Name */}
                <div className="text-yellow-500"> {/* Rating */}
                  {/* {'★'.repeat(person.rating)} 
                  {'☆'.repeat(5 - person.rating)}  */}
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