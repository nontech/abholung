'use client';
import ProductInfo from './components/ProductInfo';
import DateInput from './components/DateInput';
import TimePicker from './components/TimePicker';
import ContinueButton from './components/ContinueButton';
import Header from './components/Header';
import BackButton from './components/BackButton';
import type { ProductData, MapData, Place } from '../types/common';
import { useState, useEffect } from 'react';
//import PaymentPage from './components/Payment';
import SummaryPage from './components/SummaryPage';
import DetailsPage from './components/DetailsPage';
import ProgressBar from './components/ProgressBar';
import { DeliveryDetails, DetailsPageType, DeliveryPerson } from '../types/common';
import DeliveryPeople from './components/DeliveryPeople';
import PaymentPage from './components/Payment';
import TransportRoute from './components/TransportRoute';
import { fetchDeliveryPeople, saveDeliverUserToDatabase, saveLogisticsToDatabase, saveOrderToDatabase, savePickupUserToDatabase, saveProductToDatabase } from './dbOperations';
import PriceInfo from './components/PriceInfo';
import dynamic from 'next/dynamic';
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });


export default function Home() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [url, setUrl] = useState<string>('');
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);
  
  // Pickup from details
  const [pickupFromName, setPickupFromName] = useState<string>('');
  const [pickupFromEmail, setPickupFromEmail] = useState<string>('');
  const [pickupFromPhoneNumber, setPickupFromPhoneNumber] = useState<string>('');
  const [additionalPickupInstructions, setAdditionalPickupInstructions] = useState<string>('');

  // Deliver to details
  const [deliverToName, setdeliverToName] = useState<string>('');
  const [deliverToEmail, setdeliverToEmail] = useState<string>('');
  const [deliverPhoneNumber, setdeliverPhoneNumber] = useState<string>('');
  const [additionalDeliveryInstructions, setAdditionaldeliveryInstructions] = useState<string>('');

  // Transport route details
  const [origin, setOrigin] = useState<Place>({ address: '', latLng: null });
  const [destination, setDestination] = useState<Place>({ address: '', latLng: null });
  const [serviceType, setServiceType] = useState<'buying' | 'selling'>('buying');
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  const [stage, setStage]= useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDeliveryPeople();
      setDeliveryPeople(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (paymentDone) {
      setIsConfettiActive(true);
      const handleSaveOrder = async () => {
        const pickupUserId = await savePickupUserToDatabase(pickupFromName, pickupFromEmail, pickupFromPhoneNumber);
        const deliverUserId = await saveDeliverUserToDatabase(deliverToName, deliverToEmail, deliverPhoneNumber);
        const productId = await saveProductToDatabase(productData!);
        const logisticId = await saveLogisticsToDatabase(mapData!, additionalPickupInstructions, additionalDeliveryInstructions);
        if (pickupUserId && deliverUserId && productId && logisticId) {
          const orderData = await saveOrderToDatabase(pickupUserId, deliverUserId, productId, logisticId, selectedDeliveryPerson!, selectedDate!, selectedTime, serviceType);
          if (orderData) {
            setStage(4);
          }
        }
      };

      handleSaveOrder();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentDone]);

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
    }
    else {
      setStage(1); // Reset to stage 1 if on the summary page
    }
    if (stage === 3) {
      setIsConfettiActive(true);
    }
  };

  const handleBack = () => {
    if (stage > 1 && stage < 4) {
      setStage(stage - 1);
    }
  };

  // const [isContinueEnabled, setIsContinueEnabled] = useState<boolean>(false);

  
  // const checkContinueEnabled = useCallback(() => {
  //     switch (stage) {
  //       case 1:
  //         // Check conditions for stage 1
  //         setIsContinueEnabled(!!productData && !!mapData && !!selectedDate && !!selectedTime);
  //         break;
  //       case 2:
  //         // Check conditions for stage 2
  //         if (serviceType === 'buying') {
  //           setIsContinueEnabled(!!pickupFromName && !!pickupFromEmail && !!deliverToName);
  //         }
  //         else {
  //           setIsContinueEnabled(!!deliverToName && !!deliverToEmail && !!pickupFromName);
  //         }
  //         break;
  //       case 3:
  //         // Check conditions for stage 3
  //         setIsContinueEnabled(!!selectedDeliveryPerson);
  //         break;
  //       case 4:
  //         // Check conditions for stage 4
  //         setIsContinueEnabled(true); // Assuming you want to enable it if you're on the summary page
  //         break;
  //       default:
  //         setIsContinueEnabled(false);
  //     }
  //   }, [stage, productData, mapData, selectedDate, selectedTime, serviceType, selectedDeliveryPerson, pickupFromName, pickupFromEmail, deliverToName, deliverToEmail]);
  
  //   useEffect(() => {
  //     checkContinueEnabled();
  //   }, [stage, productData, mapData, selectedDate, selectedTime, pickupFromName, pickupFromEmail, pickupFromPhoneNumber, selectedDeliveryPerson, checkContinueEnabled]);

  // const isContinueEnabled = productData && mapData && selectedDate && selectedTime;
  const isContinueEnabled = true;

  return (
    <div className="bg-gray-100 p-5 min-h-screen">
      <Header />
      <div className='ml-64 mb-5'>
            {/* Back Navigation */}
            {stage > 1 && stage < 4 && <BackButton onClick={handleBack} />}
          </div>

      {/* Progress Bar */}
      {stage <=3 && (
        <div className='w-full h-full max-w-4xl mx-auto p-4 mb-10'>
          <ProgressBar currentStep={stage} />
        </div>
      )}
      
      {stage === 1 && (
        <div className='w-full h-full max-w-4xl mx-auto p-4'>
          <ProductInfo product={productData} onProductFetched={setProductData} serviceType={serviceType} onServiceChange={setServiceType} url={url} onUrlChange={setUrl} />
          <TransportRoute
            origin={origin}
            destination={destination}
            setOrigin={setOrigin}
            setDestination={setDestination}
            onMapDataChange={setMapData}
          />
          <div className="flex">
            <div className="w-1/2 p-2">
              <DateInput value={selectedDate} onChange={(date) => setSelectedDate(date[0])} />
            </div>
            <div className="w-1/2 p-2">
              <TimePicker selectedTime={selectedTime} onTimeChange={setSelectedTime} />
            </div>
          </div>
          <DeliveryPeople deliveryPeople={deliveryPeople} onSelect={setSelectedDeliveryPerson} />
          <PriceInfo />
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button className="btn" onClick={() => (document.getElementById('my_modal_2') as HTMLDialogElement).showModal()}>open modal</button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-center text-md">We are currently only available in Berlin. 
                <br />
                <br />
                Coming to rest of Germany soon!</h3>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      )}
      {stage === 2 && ( <DetailsPage details={detailsPageProps} /> )}
      {stage === 3 && ( <PaymentPage handlePaymentDone = {setPaymentDone} emailSend={serviceType === 'buying' ? deliverToEmail : pickupFromEmail}/> )}
      {stage === 4 && ( <SummaryPage pickupDetails = {pickupDetails} deliveryDetails = {deliveryDetails} /> )}
      
      {/* Conditionally render the Continue Button */}
      {stage < 4 && (
        <div className='flex justify-center mb-10'>
          <ContinueButton onClick={handleContinue} isEnabled={isContinueEnabled} />
          </div>
        )}
      {/* Confetti Animation */}
      {isConfettiActive && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}
      
    </div>
  );
}