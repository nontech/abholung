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
    <div>
      <h2>Select a Delivery Person</h2>
      <ul>
        {deliveryPeople.map((person) => (
          <li key={person.id}>
            <label>
              <input
                type="radio"
                name="deliveryPerson"
                value={person.id}
                checked={selectedPersonId === person.id}
                onChange={() => handleSelect(person)}
              />
              {person.full_name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryPeople;