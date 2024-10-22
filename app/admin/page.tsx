'use client';

// app/admin.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '../dbOperations';

// Import the Database type from the generated supabase-types file
import type { Database } from '../../types/supabase-types';

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

const AdminPanel = () => {
  const [orders, setOrders] = useState<OrderAll[]>([]);
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('order')
      .select(`
        *,
        product: product (*),
        logistics: logistics (*),
        delivered_by: delivered_by (*),
        pickup_from: pickup_from (*),
        deliver_to: deliver_to (*),
        placed_by: placed_by (*)
      `);
    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      console.log(data);
      setOrders(data);
    }
  };

  useEffect(() => {
    if (auth) {
      fetchOrders();
    } else {
      const credentials = prompt('Enter admin credentials (username:password):');
      if (credentials === 'admin:password') {
        setAuth(true);
        fetchOrders();
      } else {
        alert('Invalid credentials');
        router.push('/');
      }
    }
  }, [auth, router]);

  if (!auth) {
    return <div className="flex items-center justify-center h-screen">Authenticating...</div>;
  }

  async function sendEmail(emailTo: string, emailType: string, orderData: OrderAll) {
  try {
    let subject = '';
    if (emailType === 'order_processed_success'){
      subject = `Order processed - #[${orderData.id}]`;
    }
    else if (emailType === 'order_processed_failure'){
      subject = `Order unsuccessful - Refund Issued #[${orderData.id}]`;
    }
    else if (emailType === 'order_completed_success'){
      subject = `Order completed successfully - #[${orderData.id}]`;
    }
    else if (emailType === 'order_completed_failure'){
      subject = `Delivery Unsuccessful - Action Required for Order #[${orderData.id}]`;
    }
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emails: [
          { to: emailTo, subject: subject, type: emailType, orderData: orderData },
        ],
      }),
    });

    if (response.ok) {
      // router.push('/summary');
    }
    if (!response.ok) {
      throw new Error('Failed to send emails');
    }
  } catch (error) {
    console.error('Error sending emails:', error);
    alert('Error sending emails');
  }
}

  const handleConfirmOrder = async (email_to: string, order: OrderAll) => {
    if (confirm('Are you sure you want to confirm this order?')) {
      if (order.status == 'order_processing') {
        await updateOrderStatus(order.id, 'order_processed_success');
        sendEmail(email_to, 'order_processed_success', order);
      } else if (order.status == 'order_processed_success') {
        await updateOrderStatus(order.id, 'order_completed_success');
        sendEmail(email_to, 'order_completed_success', order);
      }
      fetchOrders();
    }
  };

  const handleDeclineOrder = async (email_to: string, order: OrderAll) => {
    if (confirm('Are you sure you want to decline this order?')) {
      if (order.status == 'order_processing') {
        await updateOrderStatus(order.id, 'order_processed_failure');
        sendEmail(email_to, 'order_processed_failure', order);
      } else if (order.status == 'order_processed_success') {
        await updateOrderStatus(order.id, 'order_completed_failure');
        sendEmail(email_to, 'order_completed_failure', order);
      }
      fetchOrders();
    }
  };

  const handleRevertOrder = async (orderId: number, status: string) => {
    if (confirm('Are you sure you want to revert this order?')) {
      if (status == 'order_processed_failure') {
        await updateOrderStatus(orderId, 'order_processing');
      } else if (status == 'order_completed_failure') {
        await updateOrderStatus(orderId, 'order_processed_success');
      } else if (status == 'order_completed_success') {
        await updateOrderStatus(orderId, 'order_processed_success');
      }
      fetchOrders();
    }
  };

  const statusOrder = [
    'order_processing',
    'order_processed_success',
    'order_processed_failure',
    'order_completed_success',
    'order_completed_failure'
  ];

  const StatusDisplay = ({ currentStatus }: { currentStatus: string }) => (
    <div className="flex flex-col space-y-1">
      {statusOrder.map((status) => (
        <span
          key={status}
          className={`px-2 py-1 text-xs font-semibold rounded ${
            currentStatus === status
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {status}
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Order Information</h2>
          </div>
          <div className="border-t border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Delivery fee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Customer Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Product Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Service Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Pick-up Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Deliver-to Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                    Delivered By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs break-words">{order.id}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs break-words">{order.total} €</td>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs break-words">
                      <StatusDisplay currentStatus={order.status!} />
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs break-words">
                      {order.status === 'order_processing' || order.status === 'order_processed_success' ? (
                      <div className="flex flex-col justify-between">
                        <button onClick={() => handleConfirmOrder( order.service_type === 'buying' ? order.deliver_to!.email! : order.pickup_from!.email!, order )} className="mx-2 my-2 bg-green-500 text-white px-2 py-1 rounded">Confirm</button>
                        <button onClick={() => handleDeclineOrder( order.service_type === 'buying' ? order.deliver_to!.email! : order.pickup_from!.email!, order )} className="bg-red-500 text-white px-2 py-1 rounded">Decline</button>
                      </div>
                      ) : (
                      <button onClick={() => handleRevertOrder(order.id, order.status!)} className="mx-2 my-2 bg-blue-500 text-white px-2 py-1 rounded">Revert back</button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">{order.placed_by?.full_name}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">{order.placed_by?.email}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">
                      <div>
                        <strong>Title:</strong> {order.product.title}
                      </div>
                      <div>
                        <strong>URL:</strong> <a href={order.product.url} className="text-indigo-600 hover:text-indigo-900" target="_blank" rel="noopener noreferrer">{order.product.url}</a>
                      </div>
                      <div>
                        <strong>Price:</strong> {order.product.price}
                      </div>
                      <div>
                        <strong>Listed By:</strong> {order.product.listed_by}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">{order.service_type}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">
                      <div>
                        <strong>Location:</strong> {order.logistics.from}
                      </div>
                      <div>
                        <strong>From:</strong> {order.pickup_from.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">
                      <div>
                        <strong>Location:</strong> {order.logistics.to}
                      </div>
                      <div>
                        <strong>To:</strong> {order.deliver_to.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs break-words">{order.delivered_by.full_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
