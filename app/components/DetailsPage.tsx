'use client';
import { useEffect, useState } from 'react';
import { MapData, DetailsPageType } from '../../types/common';

interface DetailsPageProps {
    details: DetailsPageType
}

const DetailsPage: React.FC<DetailsPageProps> = ({details}) => {

    // From & To Addresses
    let mapData = details.mapData
    let pickupAddress = 'Address N/A';
    let deliveryAddress = 'Address N/A';

    if (mapData && mapData.from && mapData.to) {
        pickupAddress = mapData.from;
        deliveryAddress = mapData.to;
      } 

    // Date & Time
    let selectedDate = details.selectedDate
    let selectedTime = details.selectedTime

    // Pickup from Form details
    let pickupFromName = details.pickupFromName
    let pickupFromEmail = details.pickupFromEmail
    let pickupFromPhoneNumber = details.pickupFromPhoneNumber
    let additionalPickupInstructions = details.additionalPickupInstructions
    let onPickupFromNameChange = details.onPickupFromNameChange
    let onPickupFromEmailChange = details.onPickupFromEmailChange  
    let onPickupFromPhoneNumberChange = details.onPickupFromPhoneNumberChange
    let onAdditionalPickupInstructionsChange = details.onAdditionalPickupInstructionsChange

    // Delivery to Form details
    let deliverToName = details.deliverToName
    let deliverToEmail = details.deliverToEmail
    let deliverToPhoneNumber = details.deliverToPhoneNumber
    let additionalDeliveryInstructions = details.additionalDeliveryInstructions
    let onDeliverToNameChange = details.onDeliverToNameChange
    let onDeliverToEmailChange = details.onDeliverToEmailChange
    let onDeliverToPhoneNumberChange = details.onDeliverToPhoneNumberChange
    let onAdditionalDeliveryInstructionsChange = details.onAdditionalDeliveryInstructionsChange

           
    // Product Info
    let productTitle = 'Product Title N/A'
    let productData = details.productData
    if (productData) productTitle = productData.title
  
  return (
    <div>
        <div className="min-h-screen bg-gray-50 py-8 px-4">
        
            {/* Step Indicator */}
            <div className="text-center text-sm text-gray-500 mb-6">STEP 2 of 2</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pickup From Section */}
                <div className="bg-white p-6 shadow rounded-md">
                <h2 className="text-lg font-semibold mb-4">Pickup From</h2>
                <p className="text-gray-700 mb-4">{pickupAddress}</p>
                <button className="text-sm text-blue-600 underline">
                    Edit
                </button>

                <input
                    type="text"
                    placeholder="Name on the door"
                    className="block w-full border border-gray-300 rounded mt-4 p-2"
                    value={pickupFromName}
                    onChange={(e) => onPickupFromNameChange(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="block w-full border border-gray-300 rounded mt-4 p-2"
                    value={pickupFromEmail}
                    onChange={(e) => onPickupFromEmailChange(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="+49 - Phone Number"
                    className="block w-full border border-gray-300 rounded mt-4 p-2"
                    value={pickupFromPhoneNumber}
                    onChange={(e) => onPickupFromPhoneNumberChange(e.target.value)}
                />

                <p className="text-sm text-gray-500 mt-4">
                    Please provide the number so we can call/text when picking up the item
                </p>
                <textarea
                    placeholder="Extra details ...."
                    className="block w-full border border-gray-300 rounded mt-4 p-2 h-24"
                    value={additionalPickupInstructions}
                    onChange={(e) => onAdditionalPickupInstructionsChange(e.target.value)}
                />
                </div>

                {/* Deliver To Section */}
                <div className="bg-white p-6 shadow rounded-md">
                <h2 className="text-lg font-semibold mb-4">Deliver To</h2>
                <p className="text-gray-700 mb-4">{deliveryAddress}</p>
                <button className="text-sm text-blue-600 underline">
                    Edit
                </button>

                <input
                    type="text"
                    placeholder="Name on the door"
                    className="block w-full border border-gray-300 rounded mt-4 p-2"
                    value={deliverToName}
                    onChange={(e) => onDeliverToNameChange(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="block w-full border border-gray-300 rounded mt-4 p-2"
                    value={deliverToEmail}
                    onChange={(e) => onDeliverToEmailChange(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="+49 - Phone Number"
                    className="block w-full border border-gray-300 rounded mt-4 p-2"
                    value={deliverToPhoneNumber}
                    onChange={(e) => onDeliverToPhoneNumberChange(e.target.value)}
                />

                <p className="text-sm text-gray-500 mt-4">
                    Number only for emergency purposes
                </p>
                <textarea
                    placeholder="Extra details ...."
                    className="block w-full border border-gray-300 rounded mt-4 p-2 h-24"
                    value={additionalDeliveryInstructions}
                    onChange={(e) => onAdditionalDeliveryInstructionsChange(e.target.value)}
                />
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-8 flex justify-center">
                <div className="bg-white p-6 shadow rounded-md text-center w-full max-w-md">
                <p className="text-lg font-semibold">{productTitle}</p>
                </div>
            </div>

            {/* DateTime Info */}
            <div className="mt-8 flex justify-center">
                <div className="bg-white p-6 shadow rounded-md text-center w-full max-w-md">
                <p className="text-lg font-semibold">{selectedDate ? selectedDate.toString() : ''}</p>
                <p className="text-gray-500">{selectedTime}</p>
                </div>
            </div>

        </div>
    </div>
  );
}

export default DetailsPage;