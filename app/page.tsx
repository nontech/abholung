'use client';
import ProductInfo from './components/ProductInfo';
import DateInput from './components/DateInput';
import TimePicker from './components/TimePicker';
import ContinueButton from './components/ContinueButton';
import Header from './components/Header';
import BackButton from './components/BackButton';
import type { ProductData, MapData, Place } from '../types/common';
import { useState, useEffect} from 'react';
//import PaymentPage from './components/Payment';
import SummaryPage from './components/SummaryPage';
import DetailsPage from './components/DetailsPage';
import ProgressBar from './components/ProgressBar';
import { DeliveryDetails, DetailsPageType, DeliveryPerson } from '../types/common';
import DeliveryPeople from './components/DeliveryPeople';
import PaymentPage from './components/Payment';
import TransportRoute from './components/TransportRoute';
import { fetchDeliveryPeople, saveDeliverUserToDatabase, saveLocationToDatabase, saveLogisticsToDatabase, saveOrderToDatabase, savePickupUserToDatabase, saveProductToDatabase } from './dbOperations';
import PriceInfo from './components/PriceInfo';
import dynamic from 'next/dynamic';
import { Database } from '@/types/supabase-types';
import TypeOfService from './components/TypeOfService';
import Image from 'next/image';
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
  const [duration, setDuration] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<'buying' | 'selling'>('buying');
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [SearchFormErrors, setSearchFormErrors] = useState({
    product: '',
    pickupFrom: '',
    deliverTo: '',
    pickupOn: '',
    pickupBetween: '',
    deliveryBy: ''
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

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
          const orderData: OrderAll = await saveOrderToDatabase(pickupUserId, deliverUserId, productId, logisticId, selectedDeliveryPerson!, selectedDate!, selectedTime, serviceType, totalPrice);
          if (orderData) {
            await sendEmail(orderData);
            setIsConfettiActive(true);
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
    serviceType: serviceType,
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

  const validateSearchForm = () => {
    const newErrors = {
      product: '',
      pickupFrom: '',
      deliverTo: '',
      pickupOn: '',
      pickupBetween: '',
      deliveryBy: ''
    };
    if (!productData?.newUrl.trim()) {
      newErrors.product = 'Please paste a valid eBay Kleinanzeigen product link';
    }
    if (!mapData?.from.trim() || !mapData) {
      newErrors.pickupFrom = 'Pickup From is required';
    }
    if (!mapData?.to.trim() || !mapData) {
      newErrors.deliverTo = 'Delivery To is required';
    }
    if (selectedDate?.getDate() === new Date().getDate()) {
      newErrors.pickupOn = 'Pickup On is required';
    }
    if (!selectedTime) {
      newErrors.pickupBetween = 'Pickup Between is required';
    }
    if (!selectedDeliveryPerson) {
      newErrors.deliveryBy = 'Please select a delivery person';
    }
    setSearchFormErrors(newErrors);
    return newErrors;
  };

  function isAddressInBerlin(): boolean {
    return origin.address.toLowerCase().includes('berlin') && destination.address.toLowerCase().includes('berlin');
  }
 
  const handleContinue = async() => {
    const errors = validateSearchForm();
    // No form errors
    if (Object.values(errors).every(error => error === '')) {
      if (!isAddressInBerlin()) 
        {
          // [TODO] save entries to databae
          await saveLocationToDatabase(mapData!);
          // open info modal
          (document.getElementById('info_modal') as HTMLDialogElement).showModal();
          return;
        }
      // move on to details page
      setStage(2);
    }
  };

  const handleBack = () => {
    if (stage > 1 && stage < 4) {
      setStage(stage - 1);
    }
  };
  console.log(selectedDate);

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
        <div className='flex flex-col lg:flex-row w-full max-w-4xl mx-auto'>
          <div className='w-full lg:w-2/3 lg:pr-4'>
            <ProductInfo
              onProductFetched={setProductData}
              url={url}
              onUrlChange={(newUrl) => {
                setUrl(newUrl);
                setSearchFormErrors((prevErrors) => ({ ...prevErrors, product: '' }));
              }}
              productError={SearchFormErrors.product}
            />
            {/* Updated right container */}
            {productData && (
          <div className='w-full lg:w-1/3 mt-6 lg:mt-0'>
            <div className='lg:fixed lg:bottom-5 lg:right-12 w-full lg:w-1/4 bg-white p-3 lg:p-4 rounded-lg shadow-md overflow-y-auto lg:max-h-[calc(100vh-100px)]'>
              <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Order Summary</h2>
              
                <div className="mt-3 lg:mt-4">
                  <h3 className="text-sm lg:text-md font-semibold mb-2 truncate" title={productData.title}>
                    {productData.title}
                  </h3>
                  {productData.pic_url && (
                    <div className="flex justify-center items-center mb-3 lg:mb-4">
                      <Image src={productData.pic_url} alt={productData.title} width={120} height={120} className="rounded-md" />
                    </div>
                  )}
                  <p className="text-base lg:text-lg font-medium text-green-600 mb-2">{productData.price}</p>
                  <p className="text-sm lg:text-base text-gray-700 mb-1"><strong>Listed by:</strong> {productData.listed_by}</p>
                  <p className="text-sm lg:text-base text-gray-700"><strong>Pickup Address:</strong> {productData.address}</p>
                  <div className="mt-3 lg:mt-4">
                    <TypeOfService onServiceChange={setServiceType} serviceType={serviceType} />
                  </div>
                </div>
              
              <div className="hidden lg:block">
                <PriceInfo setPrice={setPrice} totalPrice={totalPrice} duration={duration} productPrice={productData?.price || ''}/>
              </div>
            </div>
          
          </div>
          )}
            <div className="flex mb-4">
              <div className="w-1/2 p-2">
                <DateInput
                  value={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date[0]);
                    setSearchFormErrors((prevErrors) => ({ ...prevErrors, pickupOn: '' }));
                  }}
                  pickupOnError={SearchFormErrors.pickupOn}
                />
              </div>
              <div className="w-1/2 p-2">
                <TimePicker
                  selectedTime={selectedTime}
                  onTimeChange={(time) => {
                    setSelectedTime(time);
                    setSearchFormErrors((prevErrors) => ({ ...prevErrors, pickupBetween: '' }));
                  }}
                  pickupBetweenError={SearchFormErrors.pickupBetween}
                />
              </div>
            </div>
            <TransportRoute
              origin={origin}
              destination={destination}
              setOrigin={(newOrigin) => {
                setOrigin(newOrigin);
                setSearchFormErrors((prevErrors) => ({ ...prevErrors, pickupFrom: '' }));
              }}
              setDestination={(newDestination) => {
                setDestination(newDestination);
                setSearchFormErrors((prevErrors) => ({ ...prevErrors, deliverTo: '' }));
              }}
              onMapDataChange={setMapData}
              pickupFromError={SearchFormErrors.pickupFrom}
              deliverToError={SearchFormErrors.deliverTo}
              duration={duration}
              setDuration={setDuration}
            />
            <DeliveryPeople
              deliveryPeople={deliveryPeople}
              price={price}
              setTotalPrice={setTotalPrice}
              onSelect={(person) => {
                setSelectedDeliveryPerson(person);
                setSearchFormErrors((prevErrors) => ({ ...prevErrors, deliveryBy: '' }));
              }}
              deliveryByError={SearchFormErrors.deliveryBy}
            />
            <div className="mt-4 lg:hidden">
              <PriceInfo setPrice={setPrice} totalPrice={totalPrice} duration={duration} productPrice={productData?.price || ''}/>
            </div>
            <div className="flex justify-center">
              <ContinueButton onClick={handleContinue} isEnabled={true} />
            </div>
          </div>
          
          
        </div>
      )}
      
      {stage === 2 && ( <DetailsPage details={detailsPageProps} /> )}
      {stage === 3 && ( <PaymentPage handlePaymentDone = {setPaymentDone} /> )}
      {stage === 4 && ( <SummaryPage pickupDetails = {pickupDetails} deliveryDetails = {deliveryDetails} /> )}
      
      
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
