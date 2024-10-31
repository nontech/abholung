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

export const EmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ type, orderData }) => (
  <div>
    {type === 'order_processing_kk' && (
      <div>
        <p>Dear {orderData.delivered_by.full_name},</p>
        <p>
          A new order {orderData.id} has been successfully placed.
          Please review the details below to ensure everything is in
          order before we confirm it.
        </p>
        <p>
          <strong>KleinKurier Delivery Order Summary:</strong>
        </p>
        <p>
          Order Date:{' '}
          {new Date(orderData.created_at).toLocaleString()}
          <br />
          Preferred Delivery Date: {orderData.pickup_on}
          <br />
          Order Number: {orderData.id}
          <br />
          Link to Items for Delivery: {orderData.product.url}
          <br />
          Pickup Address: {orderData.logistics.from}
          <br />
          Delivery Address: {orderData.logistics.to}
          <br />
          Amount to be Paid Upon Delivery Confirmation (less service
          fee): {(parseFloat(orderData.total) * 0.8).toFixed(2)} €
        </p>
        <p>Looking forward to hearing back from you.</p>
        <p>
          Best regards,
          <br />
          KleinKurier Team
          <br />
          Email: info@kleinanzeigenkurier.de
          <br />
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_processing_customer' && (
      <div>
        <p>Dear {orderData.placed_by.full_name},</p>
        <p>
          We are excited to inform you that your order {orderData.id}{' '}
          has been successfully placed, paid for and is now being
          processed.
        </p>
        <p>
          <strong>KleinKurier Delivery Order Summary:</strong>
        </p>
        <p>
          Order Date:{' '}
          {new Date(orderData.created_at).toLocaleString()}
          <br />
          Order Number: {orderData.id}
          <br />
          Link to Item: {orderData.product.url}
          <br />
          Items to be delivered to {orderData.logistics.to} and from{' '}
          {orderData.logistics.from}
          <br />
          Delivery fee (paid): {orderData.total} €
        </p>
        <p>
          We will notify you once your order has been processed. In
          the meantime, if you have any questions or need further
          assistance, feel free to contact us.
        </p>
        <p>
          Best regards,
          <br />
          KleinKurier Team
          <br />
          Email: info@kleinanzeigenkurier.de
          <br />
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_processed_success' && (
      <div>
        <p>Dear {orderData.placed_by.full_name},</p>
        <p>
          We are pleased to inform you that your order {orderData.id}{' '}
          has been successfully processed and is scheduled for
          delivery as detailed below.
        </p>
        <p>
          <strong>KleinKurier Delivery Order Summary:</strong>
        </p>
        <p>
          Order Date:{' '}
          {new Date(orderData.created_at).toLocaleString()}
          <br />
          Order Number: {orderData.id}
          <br />
          Link to Items for Delivery: {orderData.product.url}
          <br />
          Pickup Address: {orderData.logistics.from}
          <br />
          Delivery Address: {orderData.logistics.to}
          <br />
          Delivery Date: {orderData.pickup_on}
          <br />
          Pickup Time: {orderData.pickup_between}
          <br />
          Delivery Time: {orderData.pickup_between}
        </p>
        <p>
          Please ensure availability for both the pickup and delivery
          times. Failure to be present may result in additional
          charges. Additionally, we may call you shortly before our
          arrival, so kindly ensure that your contact details are up
          to date.
        </p>
        <p>
          If you have any questions or need assistance, feel free to
          reach out.
        </p>
        <p>
          Best regards,
          <br />
          KleinKurier Team
          <br />
          Email: info@kleinanzeigenkurier.de
          <br />
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_processed_failure' && (
      <div>
        <p>Dear {orderData.placed_by.full_name},</p>
        <p>
          We regret to inform you that your delivery order #
          {orderData.id} could not be completed due to one or more of
          the following reasons:
        </p>
        <p>Possible Reasons for Unsuccessful Order:</p>
        <ul>
          <li>Item exceeds size limits</li>
          <li>
            Delivery area is not accessible by foot or public
            transportation
          </li>
          <li>Selected delivery time is not feasible</li>
          <li>Chosen delivery date is unavailable</li>
          <li>
            All delivery personnel are currently booked for the
            foreseeable future
          </li>
          <li>Insufficient funds to cover the delivery cost</li>
          <li>More than one person needed to carry the item</li>
        </ul>
        <p>
          A full refund has been issued, though it may take up to 3
          business days for the funds to reflect in your account.
        </p>
        <p>
          While we strive to assist all our customers, certain
          limitations exist. Please be assured that we are
          continuously working to improve our services and minimize
          these issues.
        </p>
        <p>
          If you would like more information regarding why your order
          was rejected, feel free to contact us directly.
        </p>
        <p>
          Best regards,
          <br />
          KleinKurier Team
          <br />
          Email: info@kleinanzeigenkurier.de
          <br />
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_completed_success' && (
      <div>
        <p>Dear {orderData.placed_by.full_name},</p>
        <p>
          We are pleased to inform you that your order #{orderData.id}{' '}
          has been successfully completed. We hope the entire process
          was smooth and seamless for you.
        </p>
        <p>
          We would greatly appreciate your feedback on how we can
          further improve our service. Please consider leaving a
          review:
        </p>
        <ul>
          <li>Google Review: TBD</li>
          <li>Internal Review: TBD</li>
          <li>Refer us to friends and relatives: TBD</li>
        </ul>
        <p>
          Your input is valuable to us and helps us continue
          delivering the best possible service.
        </p>
        <p>Thank you for choosing KleinKurier!</p>
        <p>
          Best regards,
          <br />
          KleinKurier Team
          <br />
          Email: info@kleinanzeigenkurier.de
          <br />
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
    {type === 'order_completed_failure' && (
      <div>
        <p>Dear {orderData.placed_by.full_name},</p>
        <p>
          We regret to inform you that your delivery for order #
          {orderData.id} was unsuccessful, as there was no response at
          the door.
        </p>
        <p>
          To resolve this issue, please contact us at your earliest
          convenience.
        </p>
        <p>Thank you for your understanding.</p>
        <p>
          Best regards,
          <br />
          The KleinKurier Team
          <br />
          Email: info@kleinanzeigenkurier.de
          <br />
          Website: http://kleinanzeigenkurier.de
        </p>
      </div>
    )}
  </div>
);
