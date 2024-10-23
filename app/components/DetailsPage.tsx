'use client';
import { useState } from 'react';
import { DetailsPageType } from '../../types/common';
import ContinueButton from './ContinueButton';

interface DetailsPageProps {
    details: DetailsPageType
}

const DetailsPage: React.FC<DetailsPageProps> = ({details}) => {

    // From & To Addresses
    const mapData = details.mapData
    let pickupAddress = 'Address N/A';
    let deliveryAddress = 'Address N/A';
    

    if (mapData && mapData.from && mapData.to) {
        pickupAddress = mapData.from;
        deliveryAddress = mapData.to;
      } 

    // Date & Time
    const selectedDate = details.selectedDate
    const selectedTime = details.selectedTime

    // Pickup from Form details
    const pickupFromName = details.pickupFromName
    const pickupFromEmail = details.pickupFromEmail
    const pickupFromPhoneNumber = details.pickupFromPhoneNumber
    const additionalPickupInstructions = details.additionalPickupInstructions
    const onPickupFromNameChange = details.onPickupFromNameChange
    const onPickupFromEmailChange = details.onPickupFromEmailChange  
    const onPickupFromPhoneNumberChange = details.onPickupFromPhoneNumberChange
    const onAdditionalPickupInstructionsChange = details.onAdditionalPickupInstructionsChange

    // Delivery to Form details
    const deliverToName = details.deliverToName
    const deliverToEmail = details.deliverToEmail
    const deliverToPhoneNumber = details.deliverToPhoneNumber
    const additionalDeliveryInstructions = details.additionalDeliveryInstructions
    const onDeliverToNameChange = details.onDeliverToNameChange
    const onDeliverToEmailChange = details.onDeliverToEmailChange
    const onDeliverToPhoneNumberChange = details.onDeliverToPhoneNumberChange
    const onAdditionalDeliveryInstructionsChange = details.onAdditionalDeliveryInstructionsChange


    const serviceType = details.serviceType
    // Product Info
    let productTitle = 'Product Title N/A'
    let productPrice = 'Price N/A'
    const productData = details.productData
    if (productData) {
        productTitle = productData.title
        productPrice = productData.price
    }
  
    const setStage = details.onEdit
    const handleEdit = () => {
        setStage(1);
    }

    const [showPickupInstructions, setShowPickupInstructions] = useState(false);
    const [showDeliveryInstructions, setShowDeliveryInstructions] = useState(false);

    const [errors, setErrors] = useState({
        pickupFromName: '',
        pickupFromEmail: '',
        deliverToName: '',
        deliverToEmail: ''
    });

    const handlePickupFromNameChange = (name: string) => {
        onPickupFromNameChange(name);
        setErrors((prevErrors) => ({ ...prevErrors, pickupFromName: '' }));
    };

    const handlePickupFromEmailChange = (email: string) => {
        onPickupFromEmailChange(email);
        setErrors((prevErrors) => ({ ...prevErrors, pickupFromEmail: '' }));
    };

    const handleDeliverToNameChange = (name: string) => {
        onDeliverToNameChange(name);
        setErrors((prevErrors) => ({ ...prevErrors, deliverToName: '' }));
    };

    const handleDeliverToEmailChange = (email: string) => {
        onDeliverToEmailChange(email);
        setErrors((prevErrors) => ({ ...prevErrors, deliverToEmail: '' }));
    };

    const handleContinue = () => {
        const newErrors = validateForm();
        if (Object.values(newErrors).every(error => error === '')) {
            setStage(3);
        } else {
            setErrors(newErrors);
        }
    }

    const validateForm = () => {
        const newErrors = {
            pickupFromName: '',
            pickupFromEmail: '',
            deliverToName: '',
            deliverToEmail: ''
        };

        if (!pickupFromName.trim()) {
            newErrors.pickupFromName = 'Pickup name is required';
        }

        if (!deliverToName.trim()) {
            newErrors.deliverToName = 'Delivery name is required';
        }

        if (serviceType === 'selling') {
            if (!pickupFromEmail.trim()) {
                newErrors.pickupFromEmail = 'Pickup email is required';
            } else if (!/\S+@\S+\.\S+/.test(pickupFromEmail)) {
                newErrors.pickupFromEmail = 'Invalid email format';
            }
        } else if (serviceType === 'buying') {
            if (!deliverToEmail.trim()) {
                newErrors.deliverToEmail = 'Delivery email is required';
            } else if (!/\S+@\S+\.\S+/.test(deliverToEmail)) {
                newErrors.deliverToEmail = 'Invalid email format';
            }
        }

        return newErrors;
    };

    // Format the date to a human-readable format with the day
    const formattedDate = selectedDate
        ? new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(selectedDate))
        : 'N/A';

    return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* Pickup From Section */}
            <div>
                {/* Pickup From Title */}
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Pickup From</h2>
                
                {/* Edit Button */}
                <div className="flex items-center mt-2">
                    <p className="text-gray-600 flex-grow">{pickupAddress}</p>
                    <button
                        className="text-sm text-blue-600 underline mb-4"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                </div>

                {/* Pickup Name */}
                <label className={`input input-bordered flex items-center gap-2 mt-4 ${errors.pickupFromName ? 'input-error' : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Name on the door"
                        value={pickupFromName}
                    onChange={(e) => handlePickupFromNameChange(e.target.value)} 
                    />
                </label>
                {errors.pickupFromName && <p className="text-red-500 text-sm mt-1">{errors.pickupFromName}</p>}
                
                {/* Pickup Email */}
                <label className={`input input-bordered flex items-center gap-2 mt-4 ${errors.pickupFromEmail ? 'input-error' : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="Email"
                        value={pickupFromEmail}
                        onChange={(e) => handlePickupFromEmailChange(e.target.value)} 
                    />
                </label>
                {errors.pickupFromEmail && <p className="text-red-500 text-sm mt-1">{errors.pickupFromEmail}</p>}
                
                
                {/* Pickup Phone Number */}
                <label className="input input-bordered flex items-center gap-2 mt-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.07 22 2 13.93 2 4.5a1 1 0 0 1 1-1H6.5a1 1 0 0 1 1 1c0 1.25.24 2.46.69 3.58a1 1 0 0 1-.21 1.11l-2.2 2.2z" />
                    </svg>
                    <input 
                        type="text" 
                        className="grow" 
                        placeholder="+49 - Phone Number" 
                        value={pickupFromPhoneNumber}
                        onChange={(e) => onPickupFromPhoneNumberChange(e.target.value)}
                    />
                </label>
                {/* Note for user */}
                <p className="mt-2 text-xs text-gray-500">Please provide the number so we can call/text when picking up the item</p>
                    
                {/* Extra Pickup Instructions toggle */}
                <div className="mt-2">
                    <button
                        className="text-blue-600 underline text-sm"
                        onClick={() => setShowPickupInstructions(!showPickupInstructions)}
                    >
                        {showPickupInstructions ? 'Hide' : '+ Add'} extra pickup instructions
                    </button>
                    <div className={`${showPickupInstructions ? 'block' : 'hidden'} mt-2`}>
                        <textarea
                            placeholder="Extra pickup details ..."
                            className="textarea textarea-bordered w-full"
                            value={additionalPickupInstructions}
                            onChange={(e) => onAdditionalPickupInstructionsChange(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Product Info Card */}
                <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Product Information</h2>
                    <p className="text-gray-700"><strong>Product:</strong> {productTitle}</p>
                    <p className="text-gray-700"><strong>Price:</strong> {productPrice}</p>
                    {/* Add more product details as needed */}
                </div>
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

                {/* Deliver To Name */}
                <label className={`input input-bordered flex items-center gap-2 mt-4 ${errors.deliverToName ? 'input-error' : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input
                        type="text"
                        className="grow"
                        placeholder="Name on the door"
                        value={deliverToName}
                        onChange={(e) => handleDeliverToNameChange(e.target.value)}
                    />
                </label>
                {errors.deliverToName && <p className="text-red-500 text-sm mt-1">{errors.deliverToName}</p>}

                {/* Deliver To Email */}
                <label className={`input input-bordered flex items-center gap-2 mt-4 ${errors.deliverToEmail ? 'input-error' : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input
                        type="email"
                        className="grow"
                        placeholder="Email"
                        value={deliverToEmail}
                        onChange={(e) => handleDeliverToEmailChange(e.target.value)}
                    />
                </label>
                {errors.deliverToEmail && <p className="text-red-500 text-sm mt-1">{errors.deliverToEmail}</p>}

                {/* Deliver To Phone Number */}
                <label className="input input-bordered flex items-center gap-2 mt-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.07 22 2 13.93 2 4.5a1 1 0 0 1 1-1H6.5a1 1 0 0 1 1 1c0 1.25.24 2.46.69 3.58a1 1 0 0 1-.21 1.11l-2.2 2.2z" />
                    </svg>
                    <input
                        type="text"
                        className="grow"
                        placeholder="+49 - Phone Number"
                        value={deliverToPhoneNumber}
                        onChange={(e) => onDeliverToPhoneNumberChange(e.target.value)}
                    />
                </label>
                <p className="mt-2 text-xs text-gray-500">Number only for emergency purposes</p>

                {/* Extra Delivery Instructions toggle */}
                <div className="mt-2">
                    <button
                        className="text-blue-600 underline text-sm"
                        onClick={() => setShowDeliveryInstructions(!showDeliveryInstructions)}
                    >
                        {showDeliveryInstructions ? 'Hide' : '+ Add'} extra delivery instructions
                    </button>
                    <div className={`${showDeliveryInstructions ? 'block' : 'hidden'} mt-2`}>
                        <textarea
                            placeholder="Extra delivery details ..."
                            className="textarea textarea-bordered w-full"
                            value={additionalDeliveryInstructions}
                            onChange={(e) => onAdditionalDeliveryInstructionsChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* DateTime Info Card */}
                <div className="bg-white shadow-md rounded-lg p-4 mt-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Delivery Date and Time</h2>
                    <p className="text-gray-700"><strong>Date:</strong> {formattedDate}</p>
                    <p className="text-gray-700"><strong>Time:</strong> {selectedTime || 'N/A'}</p>
                </div>
            </div>
        </div>

        <div className = "flex justify-center"><ContinueButton onClick={handleContinue} isEnabled={true} /></div>
    </div>
    )
}

export default DetailsPage;
