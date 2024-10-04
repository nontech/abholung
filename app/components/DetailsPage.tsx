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
  
    let setStage = details.onEdit
    const handleEdit = () => {
        setStage(1);
    }

    return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="text-center text-sm text-gray-700 mb-6">STEP 2 of 2</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pickup From Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Pickup From</h2>
                <div className="flex items-center mt-2">
                    <p className="text-gray-600 flex-grow">{pickupAddress}</p>
                    <button
                        className="text-sm text-blue-600 underline mb-4"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Name on the door"
                    className="block w-full border border-gray-300 rounded mt-4 p-2 text-gray-900"
                    value={pickupFromName}
                    onChange={(e) => onPickupFromNameChange(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="block w-full border border-gray-300 rounded mt-4 p-2 text-gray-900"
                    value={pickupFromEmail}
                    onChange={(e) => onPickupFromEmailChange(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="+49 - Phone Number"
                    className="block w-full border border-gray-300 rounded mt-4 p-2 text-gray-900"
                    value={pickupFromPhoneNumber}
                    onChange={(e) => onPickupFromPhoneNumberChange(e.target.value)}
                />

                <p className="text-sm text-gray-700 mt-4">
                    Please provide the number so we can call/text when picking up the item
                </p>
                <textarea
                    placeholder="Extra details ...."
                    className="block w-full border border-gray-300 rounded mt-4 p-2 h-24 text-gray-900"
                    value={additionalPickupInstructions}
                    onChange={(e) => onAdditionalPickupInstructionsChange(e.target.value)}
                />
            </div>

            {/* Deliver To Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Deliver To</h2>
                <div className="flex items-center mt-2">
                    <p className="text-gray-600 flex-grow">{deliveryAddress}</p>
                    <button
                        className="text-sm text-blue-600 underline mb-4"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Name on the door"
                    className="block w-full border border-gray-300 rounded mt-4 p-2 text-gray-900"
                    value={deliverToName}
                    onChange={(e) => onDeliverToNameChange(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="block w-full border border-gray-300 rounded mt-4 p-2 text-gray-900"
                    value={deliverToEmail}
                    onChange={(e) => onDeliverToEmailChange(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="+49 - Phone Number"
                    className="block w-full border border-gray-300 rounded mt-4 p-2 text-gray-900"
                    value={deliverToPhoneNumber}
                    onChange={(e) => onDeliverToPhoneNumberChange(e.target.value)}
                />

                <p className="text-sm text-gray-700 mt-4">
                    Number only for emergency purposes
                </p>
                <textarea
                    placeholder="Extra details ...."
                    className="block w-full border border-gray-300 rounded mt-4 p-2 h-24 text-gray-900"
                    value={additionalDeliveryInstructions}
                    onChange={(e) => onAdditionalDeliveryInstructionsChange(e.target.value)}
                />
            </div>
        </div>

        {/* Product Info and DateTime Info Cards */}
        <div className="flex justify-center mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-3/5"> {/* Reduced width to 70% */}
                {/* Product Info Card */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Product Information</h2>
                    <p className="text-gray-700">{productTitle}</p>
                </div>

                {/* DateTime Info Card */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Delivery Date and Time</h2>
                    <p className="text-gray-700">{selectedDate ? selectedDate.toString() : ''}</p>
                    <p className="text-gray-700">{selectedTime}</p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default DetailsPage;