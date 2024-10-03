'use client';
import dynamic from 'next/dynamic';
import ProductInfo from './components/ProductInfo';
import DateInput from './components/DateInput';
import TimePicker from './components/TimePicker';
import type { ProductData, MapData } from '../types/common';
import { useState } from 'react';
import PaymentPage from './components/Payment';
import SummaryPage from './components/SummaryPage';
import DetailsPage from './components/DetailsPage';
import { DeliveryDetails, DetailsPageType, DeliveryPerson } from '../types/common';
import DeliveryPeople from './components/DeliveryPeople';

const Map = dynamic(() => import('./components/Map'), { ssr: false });
const deliveryPeople = [
  {id: 1, name: 'Aman Jaiswal'},
  {id: 2, name: 'Philip Tapiwa'},
  {id: 3, name: 'Mukesh Jaiswal'},
];

export default function Home() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null);

  // Pickup from details
  const [pickupFromName, setPickupFromName] = useState<string>('');
  const [pickupFromEmail, setPickupFromEmail] = useState<string>('');
  const [pickupFromPhoneNumber, setPickupFromPhoneNumber] = useState<string>('');
  const [additionalPickupInstructions, setAdditionalPickupInstructions] = useState<string>('');

  // Delive to details
  const [deliverToName, setdeliverToName] = useState<string>('');
  const [deliverToEmail, setdeliverToEmail] = useState<string>('');
  const [deliverPhoneNumber, setdeliverPhoneNumber] = useState<string>('');
  const [additionalDeliveryInstructions, setAdditionaldeliveryInstructions] = useState<string>('');

  const [stage, setStage]= useState<number>(1);

  const pickupDetails: DeliveryDetails = {
    name: pickupFromName,
    email: pickupFromEmail,
    phoneNumber: pickupFromPhoneNumber,
    additionalInstructions: additionalPickupInstructions,
    address: mapData?.from,
    date: selectedDate,
    time: selectedTime
  };

  const deliveryDetails: DeliveryDetails = {
    name: deliverToName,
    email: deliverToEmail,
    phoneNumber: deliverPhoneNumber,
    additionalInstructions: additionalDeliveryInstructions,
    address: mapData?.to,
    date: selectedDate,
    time: selectedTime
  };

  const detailsPageProps: DetailsPageType = {
    mapData: mapData,
    selectedDate: selectedDate,
    selectedTime: selectedTime,
    pickupFromName: pickupFromName,
    pickupFromEmail: pickupFromEmail,
    pickupFromPhoneNumber: pickupFromPhoneNumber,
    additionalPickupInstructions: additionalPickupInstructions,
    onPickupFromNameChange: setPickupFromName,
    onPickupFromEmailChange: setPickupFromEmail,
    onPickupFromPhoneNumberChange: setPickupFromPhoneNumber,
    onAdditionalPickupInstructionsChange: setAdditionalPickupInstructions,
    deliverToName: deliverToName,
    deliverToEmail: deliverToEmail,
    deliverToPhoneNumber: deliverPhoneNumber,
    additionalDeliveryInstructions: additionalDeliveryInstructions,
    onDeliverToNameChange: setdeliverToName,
    onDeliverToEmailChange: setdeliverToEmail,
    onDeliverToPhoneNumberChange: setdeliverPhoneNumber,
    onAdditionalDeliveryInstructionsChange: setAdditionaldeliveryInstructions,
    productData: productData!,
  };


  const handleContinue = (stage: number) => {
    setStage(stage+1);
  }

  const handleBack = () => {
    setStage(stage-1);
  }

  const isContinueEnabled = productData && mapData && selectedDate && selectedTime;

  console.log('pickupFomName:', pickupFromName);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Back Navigation Arrow */}
      {stage !== 1 ? (
            <div className='flex w-1/5 items-end justify-start'>
              <button
                className='group flex flex-col items-center justify-end rounded-full p-0 text-muted-foreground transition-all hover:text-foreground sm:flex-row sm:p-2'
                onClick={handleBack}
              >
                <p className='order-2 ml-1 text-xs font-light sm:order-1 sm:mr-2 sm:text-sm sm:font-medium'>
                  Back
                </p>
              </button>
            </div>): (
            <div className='w-1/5' /> // Placeholder to maintain spacing
      )}
      {stage === 1 && (
        <div>
          <ProductInfo product={productData} onProductFetched={setProductData} />
          <Map onChange={setMapData} />
          <DateInput value={selectedDate} onChange={(date) => setSelectedDate(date[0])} />
          <TimePicker selectedTime={selectedTime} onTimeChange={setSelectedTime} />
          <DeliveryPeople deliveryPeople={deliveryPeople} onSelect={setSelectedDeliveryPerson} />
          <button onClick={() => handleContinue(stage)} 
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded" 
                  // disabled = {!isContinueEnabled}
          >
            Continue
          </button>
        </div>
      )}
      {stage === 2 && (
        <div>
          <DetailsPage details={detailsPageProps} />
          <button onClick={() => handleContinue(stage)} 
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded" 
                    // disabled = {!isContinueEnabled}
            >
              Continue
          </button>
        </div>
      )}
      {stage === 3 && (
        <div>
          <PaymentPage />
          <button onClick={() => handleContinue(stage)} 
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded" 
                    // disabled = {!isContinueEnabled}
            >
              Continue
          </button>
        </div>
      )}
      {stage === 4 && (
        <div>
          <SummaryPage pickupDetails = {pickupDetails} deliveryDetails = {deliveryDetails} />
          <button onClick={() => setStage(1)} 
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded" 
                    // disabled = {!isContinueEnabled}
            >
              Deliver another item
          </button>
        </div>
      )}
      
    </div>
  );
}