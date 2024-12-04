"use client";

// Import React & Next stuff
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// Import types
import { Database } from "@/types/supabase-types";
import type {
  DeliveryPerson,
  MapData,
  Place,
  ProductData,
  TransportMode,
  TransportModeData,
} from "../types/common";
import { DeliveryDetails, DetailsPageType } from "../types/common";

// Import database operations
import {
  fetchDeliveryPersonByMode,
  saveDeliverUserToDatabase,
  saveLocationToDatabase,
  saveLogisticsToDatabase,
  saveOrderToDatabase,
  savePickupUserToDatabase,
  saveProductToDatabase,
  updateOrderPaymentDone,
} from "./dbOperations";

// Import common components on every page
import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";

// Import buttons
import BackButton from "./components/BackButton";
import ContinueButton from "./components/ContinueButton";

// Import components
import ProductInfo from "./components/ProductInfo";
// import DateInput from "./components/DateInput";
import CheckoutContent from "./components/CheckoutContent";
import DatePicker from "./components/DatePicker";
import PaymentOptionSelector from "./components/PaymentArrangementSelector";
import PriceInfo from "./components/PriceInfo";
import TimePicker from "./components/TimePicker";
import TransportModeSelector from "./components/TransportModeSelector";
import TransportRoute from "./components/TransportRoute";
import TypeOfService from "./components/TypeOfService";

// Import pages
import DetailsPage from "./components/DetailsPage";
import SummaryPage from "./components/SummaryPage";

// Experimental
// import StageButtons from './components/StageButtons';

// Define the Order type using the Database type
type Order = Database["public"]["Tables"]["order"]["Row"];

// Define the Product type using the Database type
type Product = Database["public"]["Tables"]["product"]["Row"];

type Logistics = Database["public"]["Tables"]["logistics"]["Row"];

type Users = Database["public"]["Tables"]["users"]["Row"];

// Extend the Order type to include the related Product fields
type OrderAll = Order & {
  product: Product;
  logistics: Logistics;
  delivered_by: Users;
  pickup_from: Users;
  deliver_to: Users;
  placed_by: Users;
};

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export default function Home() {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [url, setUrl] = useState<string>("");
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 3);
    return initialDate;
  });
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Pickup from details
  const [pickupFromName, setPickupFromName] = useState<string>("");
  const [pickupFromEmail, setPickupFromEmail] = useState<string>("");
  const [pickupFromPhoneNumber, setPickupFromPhoneNumber] =
    useState<string>("");
  const [additionalPickupInstructions, setAdditionalPickupInstructions] =
    useState<string>("");

  // Deliver to details
  const [deliverToName, setdeliverToName] = useState<string>("");
  const [deliverToEmail, setdeliverToEmail] = useState<string>("");
  const [deliverPhoneNumber, setdeliverPhoneNumber] = useState<string>("");
  const [additionalDeliveryInstructions, setAdditionaldeliveryInstructions] =
    useState<string>("");

  // Set Messenger
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(
    null
  );

  // Transport route details
  const [origin, setOrigin] = useState<Place>({
    address: "",
    latLng: null,
  });
  const [destination, setDestination] = useState<Place>({
    address: "",
    latLng: null,
  });
  const [duration, setDuration] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<"buying" | "selling">(
    "buying"
  );
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [SearchFormErrors, setSearchFormErrors] = useState({
    product: "",
    pickupFrom: "",
    deliverTo: "",
    pickupOn: "",
    pickupBetween: "",
  });

  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [stage, setStage] = useState<number>(1);

  const [orderId, setOrderId] = useState<number | null>(null);

  const [transportMode, setTransportMode] = useState<TransportModeData>({
    mode: "public transport",
    needsExtraHelper: false,
  });

  const [isItemPaidAlready, setIsItemPaidAlready] = useState(true);

  // Calculate total price whenever dependencies change
  useEffect(() => {
    let total = basePrice;

    // Add product value surcharge
    const productPriceFloat = productData?.price
      ? parseFloat(productData.price.replace("€", "").trim())
      : 0;

    // Add product price if KK is handling payment
    if (!isItemPaidAlready) {
      total += productPriceFloat;
    }

    // Add product value surcharge
    if (productPriceFloat > 120) {
      total += productPriceFloat * 0.1;
    }

    // Add urgency surcharge
    if (selectedDate) {
      const today = new Date();
      const daysFromNow = Math.ceil(
        (selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysFromNow === 2) {
        total += 2;
      } else if (daysFromNow === 1) {
        total += 5;
      }
    }

    setTotalPrice(total);
  }, [basePrice, productData?.price, selectedDate, isItemPaidAlready]);

  const saveOrderToDb = async () => {
    const pickupUserId = await savePickupUserToDatabase(
      pickupFromName,
      pickupFromEmail,
      pickupFromPhoneNumber
    );
    const deliverUserId = await saveDeliverUserToDatabase(
      deliverToName,
      deliverToEmail,
      deliverPhoneNumber
    );
    const productId = await saveProductToDatabase(productData!);
    const logisticId = await saveLogisticsToDatabase(
      mapData!,
      additionalPickupInstructions,
      additionalDeliveryInstructions,
      transportMode
    );
    const paymentDone = false;
    if (pickupUserId && deliverUserId && productId && logisticId) {
      const orderId: number | null = await saveOrderToDatabase(
        pickupUserId,
        deliverUserId,
        productId,
        logisticId,
        deliveryPerson!,
        selectedDate!,
        selectedTime,
        serviceType,
        totalPrice,
        paymentDone
      );
      return orderId;
    }
    return null;
  };

  const updateOrderPaymentDetails = async (
    paymentDone: boolean,
    payment_method: string,
    payment_error: string | null
  ) => {
    if (orderId) {
      const orderData: OrderAll | null = await updateOrderPaymentDone(
        orderId,
        paymentDone,
        payment_method,
        payment_error
      );
      return orderData;
    }
    return null;
  };

  const handleDetailsPageSubmission = async (submitted: boolean) => {
    if (submitted) {
      const orderId = await saveOrderToDb();
      if (orderId) {
        setOrderId(orderId);
      }
    }
  };

  const handlePaymentError = async (payment_method: string, error: string) => {
    console.error("Payment failed:", error);
    await updateOrderPaymentDetails(false, payment_method, error);
  };

  const handleSuccessfulPayment = async (payment_method: string) => {
    setStage(4);
    setIsConfettiActive(true);
    console.log("paymentDone is done, sending emails & saving to database");
    const sendEmail = async (orderData: OrderAll) => {
      try {
        const emailSend =
          serviceType === "buying" ? deliverToEmail : pickupFromEmail;
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emails: [
              {
                to: emailSend,
                subject: `Order being processed - #[${orderData.id}]`,
                type: "order_processing_customer",
                orderData: orderData,
              },
              {
                to: "info@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
              {
                to: "aman.jaiswal@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
              {
                to: "mukesh.jaiswal@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
              {
                to: "philip.tapiwa@kleinanzeigenkurier.de",
                subject: `New order placed - #[${orderData.id}]`,
                type: "order_processing_kk",
                orderData: orderData,
              },
            ],
          }),
        });
        console.log("Emails sent successfully");
      } catch (error) {
        console.error("Error sending emails:");
        alert("Error sending emails");
      }
    };

    const orderData = await updateOrderPaymentDetails(
      true,
      payment_method,
      null
    );
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
    time: selectedTime,
  };

  const deliveryDetails: DeliveryDetails = {
    name: deliverToName,
    email: deliverToEmail,
    phoneNumber: deliverPhoneNumber,
    additionalInstructions: additionalDeliveryInstructions,
    address: mapData?.to,
    date: selectedDate,
    time: selectedTime,
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
    totalPrice: totalPrice,
    onEdit: setStage,
  };

  const validateSearchForm = () => {
    const newErrors = {
      product: !productData?.newUrl?.trim()
        ? "Please paste a valid Kleinanzeigen product link"
        : "",
      pickupFrom: !mapData?.from?.trim() ? "Pickup From is required" : "",
      deliverTo: !mapData?.to?.trim() ? "Delivery To is required" : "",
      pickupOn: !selectedDate ? "Pickup On is required" : "",
      pickupBetween: !selectedTime ? "Pickup Between is required" : "",
    };

    setSearchFormErrors(newErrors);

    // Check if any error message is not empty
    return !Object.values(newErrors).some((error) => error !== "");
  };

  function isAddressInBerlin(): boolean {
    return (
      origin.address.toLowerCase().includes("berlin") &&
      destination.address.toLowerCase().includes("berlin")
    );
  }

  const handleContinue = async () => {
    const validForm = validateSearchForm();
    // No form errors
    if (validForm) {
      if (!isAddressInBerlin()) {
        // save entries to databae
        await saveLocationToDatabase(mapData!);
        // open info modal
        const infoModal = document.getElementById(
          "info_modal"
        ) as HTMLDialogElement | null;
        if (infoModal) {
          infoModal.showModal();
        }
        return;
      }
      // move on to details page
      setStage(2);
    } else {
      setTimeout(() => {
        const continueButton = document.getElementById("continue-section");
        if (continueButton) {
          continueButton.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }
  };

  const handleBack = () => {
    if (stage > 1 && stage < 4) {
      setStage(stage - 1);
    }
  };

  const handleDateChange = useCallback((newDate: Date) => {
    setSelectedDate(newDate);
    setSearchFormErrors((prevErrors) => ({
      ...prevErrors,
      pickupOn: "",
    }));
  }, []);

  const handleModeChange = async (
    mode: TransportMode,
    needsExtraHelper: boolean
  ) => {
    setTransportMode({
      mode,
      needsExtraHelper,
    });

    // Fetch and set delivery person based on transport mode
    const deliveryPerson = await fetchDeliveryPersonByMode(mode);
    if (deliveryPerson) {
      setDeliveryPerson(deliveryPerson);
    }
  };

  const handlePaymentOptionChange = (isPaid: boolean) => {
    setIsItemPaidAlready(isPaid);
    console.log(
      "Payment handling updated:",
      isPaid ? "prepaid" : "KK handles payment"
    );
  };

  return (
    <div className="bg-gray-100 p-5 min-h-screen">
      <Header />
      <div className="ml-64 mb-5">
        {/* Back Navigation */}
        {stage > 1 && stage < 4 && <BackButton onClick={handleBack} />}
      </div>

      {/* Progress Bar */}
      {stage <= 3 && (
        <div className="w-full h-full max-w-4xl mx-auto p-4 mb-10">
          <ProgressBar currentStep={stage} />
        </div>
      )}

      {stage === 1 && (
        <div className="flex flex-col lg:flex-row w-full max-w-4xl mx-auto">
          <div className="w-full lg:w-2/3 lg:pr-4">
            <ProductInfo
              onProductFetched={setProductData}
              url={url}
              onUrlChange={(newUrl) => {
                setUrl(newUrl);
                setSearchFormErrors((prevErrors) => ({
                  ...prevErrors,
                  product: "",
                }));
              }}
              productError={SearchFormErrors.product}
            />
            {/* Updated right container */}
            {productData && (
              <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
                <div className="lg:fixed lg:bottom-5 lg:right-12 w-full lg:w-1/4 bg-white p-3 lg:p-4 rounded-lg shadow-md overflow-y-auto lg:max-h-[calc(100vh-100px)]">
                  <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">
                    Order Summary
                  </h2>

                  <div className="mt-3 lg:mt-4">
                    <h3
                      className="text-sm lg:text-md font-semibold mb-2 truncate"
                      title={productData.title}
                    >
                      {productData.title}
                    </h3>
                    {productData.pic_url && (
                      <div className="flex justify-center items-center mb-3 lg:mb-4">
                        <Image
                          src={productData.pic_url}
                          alt={productData.title}
                          width={120}
                          height={120}
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <p className="text-base lg:text-lg font-medium text-green-600 mb-2">
                      {productData.price}
                    </p>
                    <p className="text-sm lg:text-base text-gray-700 mb-1">
                      <strong>Listed by:</strong> {productData.listed_by}
                    </p>
                    <p className="text-sm lg:text-base text-gray-700">
                      <strong>Pickup Address:</strong> {productData.address}
                    </p>
                    <div className="mt-3 lg:mt-4">
                      <TypeOfService
                        onServiceChange={setServiceType}
                        serviceType={serviceType}
                      />
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <PriceInfo
                      totalPrice={totalPrice}
                      basePrice={basePrice}
                      productPrice={productData?.price || ""}
                      deliveryDate={selectedDate}
                      duration={duration}
                      isItemPaidAlready={isItemPaidAlready}
                    />
                  </div>
                </div>
              </div>
            )}
            <TransportRoute
              origin={origin}
              destination={destination}
              setOrigin={(newOrigin) => {
                setOrigin(newOrigin);
                setSearchFormErrors((prevErrors) => ({
                  ...prevErrors,
                  pickupFrom: "",
                }));
              }}
              setDestination={(newDestination) => {
                setDestination(newDestination);
                setSearchFormErrors((prevErrors) => ({
                  ...prevErrors,
                  deliverTo: "",
                }));
              }}
              onMapDataChange={setMapData}
              pickupFromError={SearchFormErrors.pickupFrom}
              deliverToError={SearchFormErrors.deliverTo}
              duration={duration}
              setDuration={setDuration}
              setTotalPrice={setBasePrice}
            />
            <div className="flex mb-4">
              <div className="w-1/2 p-2">
                <DatePicker
                  date={selectedDate || undefined}
                  setSelectedDate={handleDateChange}
                />
              </div>
              <div className="w-1/2 p-2">
                <TimePicker
                  selectedTime={selectedTime}
                  onTimeChange={(time) => {
                    setSelectedTime(time);
                    setSearchFormErrors((prevErrors) => ({
                      ...prevErrors,
                      pickupBetween: "",
                    }));
                  }}
                  pickupBetweenError={SearchFormErrors.pickupBetween}
                />
              </div>
            </div>

            {/* Transport Mode Selector */}
            <TransportModeSelector
              selectedMode={transportMode.mode}
              needsExtraHelper={transportMode.needsExtraHelper}
              onModeChange={handleModeChange}
            />
            {/* Payment Option Selector */}
            <PaymentOptionSelector
              onPaymentOptionChange={handlePaymentOptionChange}
            />

            <div className="mt-4 lg:hidden">
              <PriceInfo
                totalPrice={totalPrice}
                basePrice={basePrice}
                productPrice={productData?.price || ""}
                deliveryDate={selectedDate}
                duration={duration}
                isItemPaidAlready={isItemPaidAlready}
              />
            </div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="info_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-center text-md">
                  We are currently only available in Berlin.
                  <br />
                  <br />
                  Coming to rest of Germany soon!
                </h3>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            {/* Show form errors above Continue button */}
            <div
              id="continue-section"
              className="flex flex-col items-center my-8 py-4"
            >
              {Object.values(SearchFormErrors).some(
                (error) => error !== ""
              ) && (
                <div className="mb-4">
                  {Object.values(SearchFormErrors).map(
                    (error, index) =>
                      error && (
                        <p key={index} className="text-red-500 text-sm">
                          {error}
                        </p>
                      )
                  )}
                </div>
              )}
              <ContinueButton onClick={handleContinue} isEnabled={true} />
            </div>
          </div>
        </div>
      )}

      {stage === 2 && (
        <DetailsPage
          details={detailsPageProps}
          handleDetailsPageSubmission={handleDetailsPageSubmission}
          deliveryPerson={deliveryPerson}
        />
      )}
      {stage === 3 && (
        <CheckoutContent
          total_amount={totalPrice}
          onPaymentSuccess={(payment_method: string) =>
            handleSuccessfulPayment(payment_method)
          }
          onPaymentError={(payment_method: string, error: string) =>
            handlePaymentError(payment_method, error)
          }
        />
      )}
      {stage === 4 && (
        <SummaryPage
          pickupDetails={pickupDetails}
          deliveryDetails={deliveryDetails}
        />
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
