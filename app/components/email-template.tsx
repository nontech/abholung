import * as React from 'react';
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

interface EmailTemplateProps {
  type: string;
  orderData: OrderAll;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  type,
  orderData,
}) => (
  <div>
    {type === 'order_processing_kk' && (
      <div>
        <p>
            Dear {orderData.delivered_by.full_name},

            A new order {orderData.id} has been successfully placed. Please review the details below to ensure everything is in order before we confirm it.
            <strong>KleinKurier Delivery Order Summary:</strong>
            Order Date: {new Date(orderData.created_at).toLocaleString()}
            Preferred Delivery Date: {orderData.pickup_on}
            Order Number: {orderData.id}
            Link to Items for Delivery: {orderData.product.url}
            Pickup Address: {orderData.logistics.from}
            Delivery Address: {orderData.logistics.to}
            Amount to be Paid Upon Delivery Confirmation (less service fee): TBD
            Looking forward to hearing back from you.
            Best regards,
            KleinKurier Team
            Email: info@kleinanzeigenkurier.de
            Website: http://kleinanzeigenkurier.de
            </p>
      </div>
    )}
    {type === 'order_processing_customer' && (
      <div>
         <p>
            Dear {orderData.placed_by.full_name},

            We are excited to inform you that your order {orderData.id} has been successfully placed, paid for and is now being processed.
            <strong>KleinKurier Delivery Order Summary:</strong>
            Order Date: {new Date(orderData.created_at).toLocaleString()}
            Order Number: {orderData.id}
            Link to Item: {orderData.product.url}
            Items to be delivered to {orderData.logistics.to} and from {orderData.logistics.from}
            We will notify you once your order has been processed. In the meantime, if you have any questions or need further assistance, feel free to cont
            Best regards,
            KleinKurier Team
            Email: info@kleinanzeigenkurier.de
            Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_processed_success' && (
      <div>
         <p>
            Dear {orderData.placed_by.full_name},

            We are pleased to inform you that your order {orderData.id} has been successfully processed and is scheduled for delivery as detailed below.
            <strong>KleinKurier Delivery Order Summary:</strong>
            Order Date: {new Date(orderData.created_at).toLocaleString()}
            Order Number: {orderData.id}
            Link to Items for Delivery: {orderData.product.url}
            Pickup Address: {orderData.logistics.from}
            Delivery Address: {orderData.logistics.to}
            Delivery Date: {orderData.pickup_on}
            Pickup Time: {orderData.pickup_between}
            Delivery Time: {orderData.pickup_between}
            Please ensure availability for both the pickup and delivery times. Failure to be present may result in additional charges. Additionally, we may call you shortly before our arrival, so kindly ensure that your contact details are up to date.
            If you have any questions or need assistance, feel free to reach out.
            Best regards,
            KleinKurier Team
            Email: info@kleinanzeigenkurier.de
            Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_processed_failure' && (
      <div>
         <p>
          Dear {orderData.placed_by.full_name},

          We regret to inform you that your delivery order #{orderData.id} could not be completed due to one or more of the following reasons:
          Possible Reasons for Unsuccessful Order:
          Item exceeds size limits
          Delivery area is not accessible by foot or public transportation
          Selected delivery time is not feasible
          Chosen delivery date is unavailable
          All delivery personnel are currently booked for the foreseeable future
          Insufficient funds to cover the delivery cost
          More than one person needed to carry the iterm
          A full refund has been issued, though it may take up to 3 business days for the funds to reflect in your account.
          While we strive to assist all our customers, certain limitations exist. Please be assured that we are continuously working to improve our services and minimize these issues.
          If you would like more information regarding why your order was rejected, feel free to contact us directly.
          Best regards,
          KleinKurier Team
          Email: info@kleinanzeigenkurier.de
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_completed_success' && (
      <div>
         <p>
          Dear {orderData.placed_by.full_name},

          We are pleased to inform you that your order #{orderData.id} has been successfully completed. We hope the entire process was smooth and seamless for you.
          We would greatly appreciate your feedback on how we can further improve our service. Please consider leaving a review:
          Google Review: TBD
          Internal Review: TBD
          Refer us to friends and relatives: TBD
          Your input is valuable to us and helps us continue delivering the best possible service.
          Thank you for choosing KleinKurier!
          Best regards,
          KleinKurier Team
          Email: info@kleinanzeigenkurier.de
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_completed_failure' && (
      <div>
         <p>
          Dear {orderData.placed_by.full_name},

          We regret to inform you that your delivery for order #{orderData.id} was unsuccessful, as there was no response at the door.

          To resolve this issue, please contact us at your earliest convenience.

          Thank you for your understanding.

          Best regards,
          The KleinKurier Team
          Email: info@kleinanzeigenkurier.de
          Website: kleinanzeigenkurier.de
        </p>
      </div>
    )}
  </div>
);