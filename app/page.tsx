'use client';
import dynamic from 'next/dynamic';
import ProductInfo from './components/ProductInfo';
import DateInput from './components/DateInput';
import TimePicker from './components/TimePicker';
import ContinueButton from './components/ContinueButton';
import BackButton from './components/BackButton';
import type { ProductData, MapData } from '../types/common';
import { useState, useEffect } from 'react';
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
    onEdit: setStage
  };

  const handleContinue = () => {
    if (stage < 4) {
      setStage(stage + 1);
    } else {
      setStage(1); // Reset to stage 1 if on the summary page
    }
  };

  const handleBack = () => {
    if (stage > 1 && stage < 4) {
      setStage(stage - 1);
    }
  };

  // const [isContinueEnabled, setIsContinueEnabled] = useState<boolean>(false);

  // const checkContinueEnabled = () => {
  //   switch (stage) {
  //     case 1:
  //       // Check conditions for stage 1
  //       setIsContinueEnabled(!!productData && !!mapData && !!selectedDate && !!selectedTime);
  //       break;
  //     case 2:
  //       // Check conditions for stage 2
  //       setIsContinueEnabled(!!pickupFromName && !!pickupFromEmail && !!pickupFromPhoneNumber);
  //       break;
  //     case 3:
  //       // Check conditions for stage 3
  //       setIsContinueEnabled(!!selectedDeliveryPerson);
  //       break;
  //     case 4:
  //       // Check conditions for stage 4
  //       setIsContinueEnabled(true); // Assuming you want to enable it if you're on the summary page
  //       break;
  //     default:
  //       setIsContinueEnabled(false);
  //   }
  // };

  // useEffect(() => {
  //   checkContinueEnabled();
  // }, [stage, productData, mapData, selectedDate, selectedTime, pickupFromName, pickupFromEmail, pickupFromPhoneNumber, selectedDeliveryPerson]);

  // const isContinueEnabled = productData && mapData && selectedDate && selectedTime;
  const isContinueEnabled = true;

  return (
    <div className="bg-gray-100 p-5">
      {/* Back Navigation */}
      {stage > 1 && stage < 4 && <BackButton onClick={handleBack} />}
      {stage === 1 && (
        <div className='w-full max-w-4xl mx-auto p-4'>
          <ProductInfo product={productData} onProductFetched={setProductData} />
          <Map onChange={setMapData} />
          <div className="flex">
            <div className="w-1/2">
              <DateInput value={selectedDate} onChange={(date) => setSelectedDate(date[0])} />
            </div>
            <div className="w-1/2">
              <TimePicker selectedTime={selectedTime} onTimeChange={setSelectedTime} />
            </div>
          </div>
          <DeliveryPeople deliveryPeople={deliveryPeople} onSelect={setSelectedDeliveryPerson} />
        </div>
      )}
      {stage === 2 && ( <DetailsPage details={detailsPageProps} /> )}
      {stage === 3 && ( <PaymentPage /> )}
      {stage === 4 && ( <SummaryPage pickupDetails = {pickupDetails} deliveryDetails = {deliveryDetails} /> )}
      
      {/* Conditionally render the Continue Button */}
      {stage < 4 && (
          <ContinueButton onClick={handleContinue} isEnabled={isContinueEnabled} />
        )}
    </div>
  );
}