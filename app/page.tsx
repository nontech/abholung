'use client';

// Import React & Next stuff
import { useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Import types
import type { ProductData, MapData, Place } from '../types/common';
import { DeliveryDetails, DetailsPageType, DeliveryPerson } from '../types/common';
import { Database } from '@/types/supabase-types';

// Import database operations
import { fetchDeliveryPeople, saveDeliverUserToDatabase, saveLocationToDatabase, saveLogisticsToDatabase, saveOrderToDatabase, savePickupUserToDatabase, saveProductToDatabase, updateOrderPaymentDone } from './dbOperations';

// Import common components on every page
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';

// Import buttons
import ContinueButton from './components/ContinueButton';
import BackButton from './components/BackButton';

// Import components
import ProductInfo from './components/ProductInfo';
import DateInput from './components/DateInput';
import TimePicker from './components/TimePicker';
import TransportRoute from './components/TransportRoute';
import PriceInfo from './components/PriceInfo';
import TypeOfService from './components/TypeOfService';
import DeliveryPeople from './components/DeliveryPeople';
import CheckoutContent from './components/CheckoutContent';

// Import pages
import SummaryPage from './components/SummaryPage';
import DetailsPage from './components/DetailsPage';

// Experimental
// import StageButtons from './components/StageButtons';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 3);
    return initialDate;
  });
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null);
  
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

  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDeliveryPeople();
      setDeliveryPeople(data);
    };

    fetchData();
  }, []);

  // Reset form errors and selected delivery person when price changes
  useEffect(() => {
    setTotalPrice(0);
    setSelectedDeliveryPerson(null);
  }, [price]);

  const saveOrderToDb = async () => {
    const pickupUserId = await savePickupUserToDatabase(pickupFromName, pickupFromEmail, pickupFromPhoneNumber);
    const deliverUserId = await saveDeliverUserToDatabase(deliverToName, deliverToEmail, deliverPhoneNumber);
    const productId = await saveProductToDatabase(productData!);
    const logisticId = await saveLogisticsToDatabase(mapData!, additionalPickupInstructions, additionalDeliveryInstructions);
    const paymentDone = false;
    if (pickupUserId && deliverUserId && productId && logisticId) {
      const orderId: number | null = await saveOrderToDatabase(pickupUserId, deliverUserId, productId, logisticId, selectedDeliveryPerson!, selectedDate!, selectedTime, serviceType, totalPrice, paymentDone);
      return orderId;
    }
    return null;
  };

  const updateOrderPaymentDetails = async (paymentDone: boolean, payment_method: string, payment_error: string | null) => {
    if (orderId) {
      const orderData: OrderAll | null = await updateOrderPaymentDone(orderId, paymentDone, payment_method, payment_error);
      return orderData;
    }
    return null;
  };


  const handleDetailsPageSubmission = async(submitted: boolean) => {
    if (submitted) {
      const orderId = await saveOrderToDb();
      if (orderId) {
        setOrderId(orderId);
      }
    }
  };

  const handlePaymentError = async (payment_method: string,error: string) => {
    console.error('Payment failed:', error);
    await updateOrderPaymentDetails(false, payment_method, error);
  };

  const handleSuccessfulPayment = async (payment_method: string) => {
    setStage(4);
    setIsConfettiActive(true);
    console.log('paymentDone is done, sending emails & saving to database');
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
              { to: 'aman.jaiswal@kleinanzeigenkurier.de', subject: `New order placed - #[${orderData.id}]`, type: 'order_processing_kk', orderData: orderData },
              { to: 'mukesh.jaiswal@kleinanzeigenkurier.de', subject: `New order placed - #[${orderData.id}]`, type: 'order_processing_kk', orderData: orderData },
              { to: 'philip.tapiwa@kleinanzeigenkurier.de', subject: `New order placed - #[${orderData.id}]`, type: 'order_processing_kk', orderData: orderData },
            ],
          }),
        });
        console.log('Emails sent successfully');
      } catch (error) {
        console.error('Error sending emails:', error);
        alert('Error sending emails');
      }
    };
    
    const orderData = await updateOrderPaymentDetails(true, payment_method, null);
    if (orderData) {
      await sendEmail(orderData);
    }
  };

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
      product: !productData?.newUrl?.trim() ? 'Please paste a valid eBay Kleinanzeigen product link' : '',
      pickupFrom: !mapData?.from?.trim() ? 'Pickup From is required' : '',
      deliverTo: !mapData?.to?.trim() ? 'Delivery To is required' : '',
      pickupOn: !selectedDate ? 'Pickup On is required' : '',
      pickupBetween: !selectedTime ? 'Pickup Between is required' : '',
      deliveryBy: !selectedDeliveryPerson ? 'Please select a delivery person' : ''
    };

    setSearchFormErrors(newErrors);

    // Check if any error message is not empty
    return !Object.values(newErrors).some(error => error !== '');
  };

  function isAddressInBerlin(): boolean {
    return origin.address.toLowerCase().includes('berlin') && destination.address.toLowerCase().includes('berlin');
  }
 
  const handleContinue = async() => {
    const validForm = validateSearchForm();
    // No form errors
    if (validForm) {
      console.log('no form errors');
      if (!isAddressInBerlin()) 
        {
          // [TODO] save entries to databae
          await saveLocationToDatabase(mapData!);
          // open info modal
          const infoModal = document.getElementById('info_modal') as HTMLDialogElement | null;
          if (infoModal) {
            infoModal.showModal();
          } else {
            console.error('Info modal element not found');
          }
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

      {/* Stage Buttons -> Remove it later */}
      {/* <StageButtons currentStage={stage} setStage={setStage} /> */}
      
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
                <PriceInfo setPrice={setPrice} totalPrice={totalPrice} duration={duration} productPrice={productData?.price || ''} deliveryDate={selectedDate}/>
              </div>
            </div>
          
          </div>
          )}
            <div className="flex mb-4">
              <div className="w-1/2 p-2">
                <DateInput
                  value={selectedDate}
                  onChange={(dates) => {
                    if (dates && dates.length > 0) {
                      setSelectedDate(dates[0]);
                      setSearchFormErrors((prevErrors) => ({ ...prevErrors, pickupOn: '' }));
                    }
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
              <PriceInfo setPrice={setPrice} totalPrice={totalPrice} duration={duration} productPrice={productData?.price || ''} deliveryDate = {selectedDate}/>
            </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="info_modal" className="modal">
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
            <div className="flex justify-center">
              <ContinueButton onClick={handleContinue} isEnabled={true} />
            </div>
          </div>
        </div>
      )}
      
      {stage === 2 && ( <DetailsPage details={detailsPageProps} handleDetailsPageSubmission={handleDetailsPageSubmission} /> )}
      {stage === 3 && (
        <CheckoutContent 
          total_amount={totalPrice} 
          onPaymentSuccess={(payment_method: string) => handleSuccessfulPayment(payment_method)} 
          onPaymentError={(payment_method: string, error: string) => handlePaymentError(payment_method, error)}
        />
      )}
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
