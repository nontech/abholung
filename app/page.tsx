'use client';
import ProductInfo from './components/ProductInfo';
import DateInput from './components/DateInput';
import TimePicker from './components/TimePicker';
import ContinueButton from './components/ContinueButton';
import Header from './components/Header';
import BackButton from './components/BackButton';
import type { ProductData, MapData, Place } from '../types/common';
import { useState, useEffect, useCallback } from 'react';
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
import { Database } from '@/types/supabase-types';
// Define the Order type using the Database type
type Order = Database['public']['Tables']['order']['Row'];

// Define the Product type using the Database type
type Product = Database['public']['Tables']['product']['Row'];

type Logistics = Database['public']['Tables']['logistics']['Row'];

type Users = Database['public']['Tables']['users']['Row'];

// Extend the Order type to include the related Product fields
type OrderAll = Order & {
  product: Product;
  logistics: Logistics;
  delivered_by: Users;
  pickup_from: Users;
  deliver_to: Users;
  placed_by: Users;
};

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

  const [isContinueEnabled, setIsContinueEnabled] = useState<boolean>(false);

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
      const sendEmail = async (orderData: OrderAll) => {
        try {
          const emailSend = serviceType === 'buying' ? deliverToEmail : pickupFromEmail;
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emails: [
                { to: emailSend, subject: `Order being processed - #[${orderData.id}]`, type: 'order_processing_customer', orderData: orderData },
                { to: 'info@kleinanzeigenkurier.de', subject: `New order placed - #[${orderData.id}]`, type: 'order_processing_kk', orderData: orderData },
              ],
            }),
          });
        } catch (error) {
          console.error('Error sending emails:', error);
          alert('Error sending emails');
        }
      };
      const handleSaveOrder = async () => {
        const pickupUserId = await savePickupUserToDatabase(pickupFromName, pickupFromEmail, pickupFromPhoneNumber);
        const deliverUserId = await saveDeliverUserToDatabase(deliverToName, deliverToEmail, deliverPhoneNumber);
        const productId = await saveProductToDatabase(productData!);
        const logisticId = await saveLogisticsToDatabase(mapData!, additionalPickupInstructions, additionalDeliveryInstructions);
        if (pickupUserId && deliverUserId && productId && logisticId) {
          const orderData: OrderAll = await saveOrderToDatabase(pickupUserId, deliverUserId, productId, logisticId, selectedDeliveryPerson!, selectedDate!, selectedTime, serviceType);
          if (orderData) {
            await sendEmail(orderData);
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

  

// COMMENT THIS OUT WHEN YOU WANT TO TEST THE PRODUCT WITHOUT FILLING OUT THE FORM
  const checkContinueEnabled = useCallback(() => {
    switch (stage) {
      case 1:
        // Check conditions for stage 1
        setIsContinueEnabled(!!productData && !!mapData && !!selectedDate && !!selectedTime && !!selectedDeliveryPerson);
        break;
      case 2:
        // Check conditions for stage 2
        if (serviceType === 'buying') {
          setIsContinueEnabled(!!pickupFromName && !!deliverToEmail && !!deliverToName);
        }
        else {
          setIsContinueEnabled(!!deliverToName && !!pickupFromEmail && !!pickupFromName);
        }
        break;
      default:
        setIsContinueEnabled(false);
    }
  }, [stage, productData, mapData, selectedDate, selectedTime, serviceType, selectedDeliveryPerson, pickupFromName, pickupFromEmail, deliverToName, deliverToEmail]);
  
  useEffect(() => {
    checkContinueEnabled();
  }, [stage, productData, mapData, selectedDate, selectedTime, pickupFromName, pickupFromEmail, pickupFromPhoneNumber, selectedDeliveryPerson, checkContinueEnabled]);

// UNTIL HERE

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
        </div>
      )}
      {stage === 2 && ( <DetailsPage details={detailsPageProps} /> )}
      {stage === 3 && ( <PaymentPage handlePaymentDone = {setPaymentDone} /> )}
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