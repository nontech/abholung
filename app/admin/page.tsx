"use client";

// app/admin.tsx
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateOrderStatus } from "../dbOperations";
import { supabase } from "../supabaseClient";

// Import the Database type from the generated supabase-types file
import type { Database } from "../../types/supabase-types";

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

const OrderDetails = ({
  order,
  handleConfirmOrder,
  handleDeclineOrder,
  handleRevertOrder,
  statusOrder,
}: {
  order: OrderAll;
  handleConfirmOrder: (email: string, order: OrderAll) => void;
  handleDeclineOrder: (email: string, order: OrderAll) => void;
  handleRevertOrder: (orderId: number, status: string) => void;
  statusOrder: string[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-sm text-gray-500">
            Created: {order.created_at.split(".")[0]}
          </p>
        </div>
        <StatusDisplay
          currentStatus={order.status!}
          statusOrder={statusOrder}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Customer Details</h4>
          <div className="bg-gray-50 p-3 rounded">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {order.placed_by?.full_name}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {order.placed_by?.email}
            </p>
            <p>
              <span className="font-medium">Phone number:</span>{" "}
              {order.placed_by?.phone_number}
            </p>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Product Details</h4>
          <div className="bg-gray-50 p-3 rounded">
            <p>
              <span className="font-medium">Title:</span> {order.product.title}
            </p>
            <p>
              <span className="font-medium">URL:</span>
              <a
                href={order.product.url}
                className="text-blue-600 hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Item
              </a>
            </p>
            <p>
              <span className="font-medium">Price:</span> {order.product.price}
            </p>
            <p>
              <span className="font-medium">Listed By:</span>{" "}
              {order.product.listed_by}
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Payment Details</h4>
          <div className="bg-gray-50 p-3 rounded">
            <p>
              <span className="font-medium">Total:</span> {order.total}€
            </p>
            {!order.is_item_paid && (
              <p>
                <span className="font-medium">Included Item Price:</span>{" "}
                {order.included_item_price}€
              </p>
            )}
            {order.urgency_surcharge !== "0.00" && (
              <p>
                <span className="font-medium">Urgency Fee:</span>{" "}
                {order.urgency_surcharge}€
              </p>
            )}
            {order.vehicle_cost !== "0.00" && (
              <p>
                <span className="font-medium">Vehicle Fee:</span>{" "}
                {order.vehicle_cost}€
              </p>
            )}
            {order.helper_cost !== "0.00" && (
              <p>
                <span className="font-medium">Helper Fee:</span>{" "}
                {order.helper_cost}€
              </p>
            )}
            <p>
              <span className="font-medium">Method:</span>{" "}
              {order.payment_method}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {order.payment_done ? "Completed" : "Pending"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-4">
        {/* Pickup Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Pickup Details</h4>
          <div className="bg-gray-50 p-3 rounded">
            <p>
              <span className="font-medium">Location:</span>{" "}
              {order.logistics.from}
            </p>
            <p>
              <span className="font-medium">Name on door:</span>{" "}
              {order.pickup_from.full_name}
            </p>
            {order.pickup_from.email && (
              <p>
                <span className="font-medium">email:</span>{" "}
                {order.pickup_from.email}
              </p>
            )}
            {order.pickup_from.phone_number && (
              <p>
                <span className="font-medium">phone number:</span>{" "}
                {order.pickup_from.phone_number}
              </p>
            )}
            <p>
              <span className="font-medium">Date:</span> {order.pickup_on}
            </p>
            <p>
              <span className="font-medium">Time:</span> {order.pickup_between}
            </p>
            {order.logistics.from_additional_instructions && (
              <p>
                <span className="font-medium">Instructions:</span>{" "}
                {order.logistics.from_additional_instructions}
              </p>
            )}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Delivery Details</h4>
          <div className="bg-gray-50 p-3 rounded">
            <p>
              <span className="font-medium">Location:</span>{" "}
              {order.logistics.to}
            </p>
            <p>
              <span className="font-medium">Name on door:</span>{" "}
              {order.deliver_to.full_name}
            </p>
            {order.deliver_to.email && (
              <p>
                <span className="font-medium">email:</span>{" "}
                {order.deliver_to.email}
              </p>
            )}
            {order.deliver_to.phone_number && (
              <p>
                <span className="font-medium">phone number:</span>{" "}
                {order.deliver_to.phone_number}
              </p>
            )}
            <p>
              <span className="font-medium">Date:</span> {order.pickup_on}
            </p>
            <p>
              <span className="font-medium">Time:</span> {order.pickup_between}
            </p>

            {order.logistics.to_additional_instructions && (
              <p>
                <span className="font-medium">Instructions:</span>{" "}
                {order.logistics.to_additional_instructions}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Delivery by</h4>
          <div className="bg-gray-50 p-3 rounded">
            <p>
              <span className="font-medium">Courier:</span>{" "}
              {order.delivered_by.full_name}
            </p>
            <p>
              <span className="font-medium">Transport:</span>{" "}
              {order.logistics.mode_of_transport}
            </p>
            {order.logistics.mode_of_transport === "other" && (
              <p>
                <span className="font-medium">Instructions:</span>{" "}
                {order.logistics.other_mode}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {order.status !== "order_pending_payment" && (
        <div className="flex justify-end space-x-4 mt-4">
          {order.status === "order_processing" ||
          order.status === "order_processed_success" ? (
            <>
              <button
                onClick={() =>
                  handleConfirmOrder(
                    order.service_type === "buying"
                      ? order.deliver_to!.email!
                      : order.pickup_from!.email!,
                    order
                  )
                }
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() =>
                  handleDeclineOrder(
                    order.service_type === "buying"
                      ? order.deliver_to!.email!
                      : order.pickup_from!.email!,
                    order
                  )
                }
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Decline
              </button>
            </>
          ) : (
            <button
              onClick={() => handleRevertOrder(order.id, order.status!)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Revert Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const StatusDisplay = ({
  currentStatus,
  statusOrder,
}: {
  currentStatus: string;
  statusOrder: string[];
}) => (
  <div className="flex items-center gap-2">
    {statusOrder.map((status) => (
      <span
        key={status}
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          status === currentStatus
            ? status.includes("success")
              ? "bg-green-100 text-green-800 ring-2 ring-green-600"
              : status.includes("failure")
              ? "bg-red-100 text-red-800 ring-2 ring-red-600"
              : status.includes("processing")
              ? "bg-blue-100 text-blue-800 ring-2 ring-blue-600"
              : "bg-gray-100 text-gray-800 ring-2 ring-gray-600"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        {status.split("_").slice(1).join(" ")}
      </span>
    ))}
  </div>
);

const AdminPanel = () => {
  const [orders, setOrders] = useState<OrderAll[]>([]);
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("order").select(`
        *,
        product: product (*),
        logistics: logistics (*),
        delivered_by: delivered_by (*),
        pickup_from: pickup_from (*),
        deliver_to: deliver_to (*),
        placed_by: placed_by (*)
      `);
    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (auth) {
        fetchOrders();
      } else {
        const credentials = prompt(
          "Enter admin credentials (username:password):"
        );
        try {
          const response = await fetch("/api/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credentials }),
          });
          const data = await response.json();
          if (data.authenticated) {
            setAuth(true);
            fetchOrders();
          } else {
            alert("Invalid credentials");
            router.push("/");
          }
        } catch (error) {
          console.error("Authentication error:", error);
          alert("Authentication failed");
          router.push("/");
        }
      }
    };

    checkAuth();
  }, [auth, router]);

  async function sendEmail(
    emailTo: string,
    emailType: string,
    orderData: OrderAll
  ) {
    try {
      let subject = "";
      if (emailType === "order_processed_success") {
        subject = `Order processed - #[${orderData.id}]`;
      } else if (emailType === "order_processed_failure") {
        subject = `Order unsuccessful - Refund Issued #[${orderData.id}]`;
      } else if (emailType === "order_completed_success") {
        subject = `Order completed successfully - #[${orderData.id}]`;
      } else if (emailType === "order_completed_failure") {
        subject = `Delivery Unsuccessful - Action Required for Order #[${orderData.id}]`;
      }
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: [
            {
              to: emailTo,
              subject: subject,
              type: emailType,
              orderData: orderData,
            },
          ],
        }),
      });

      if (response.ok) {
        // router.push('/summary');
      }
      if (!response.ok) {
        throw new Error("Failed to send emails");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("Error sending emails");
    }
  }

  const handleConfirmOrder = async (email_to: string, order: OrderAll) => {
    if (confirm("Are you sure you want to confirm this order?")) {
      if (order.status == "order_processing") {
        await updateOrderStatus(order.id, "order_processed_success");
        sendEmail(email_to, "order_processed_success", order);
      } else if (order.status == "order_processed_success") {
        await updateOrderStatus(order.id, "order_completed_success");
        sendEmail(email_to, "order_completed_success", order);
      }
      fetchOrders();
    }
  };

  const handleDeclineOrder = async (email_to: string, order: OrderAll) => {
    if (confirm("Are you sure you want to decline this order?")) {
      if (order.status == "order_processing") {
        await updateOrderStatus(order.id, "order_processed_failure");
        sendEmail(email_to, "order_processed_failure", order);
      } else if (order.status == "order_processed_success") {
        await updateOrderStatus(order.id, "order_completed_failure");
        sendEmail(email_to, "order_completed_failure", order);
      }
      fetchOrders();
    }
  };

  const handleRevertOrder = async (orderId: number, status: string) => {
    if (confirm("Are you sure you want to revert this order?")) {
      if (status == "order_processed_failure") {
        await updateOrderStatus(orderId, "order_processing");
      } else if (status == "order_completed_failure") {
        await updateOrderStatus(orderId, "order_processed_success");
      } else if (status == "order_completed_success") {
        await updateOrderStatus(orderId, "order_processed_success");
      }
      fetchOrders();
    }
  };

  const statusOrder = [
    "order_pending_payment",
    "order_processing",
    "order_processed_success",
    "order_processed_failure",
    "order_completed_success",
    "order_completed_failure",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderDetails
              key={order.id}
              order={order}
              handleConfirmOrder={handleConfirmOrder}
              handleDeclineOrder={handleDeclineOrder}
              handleRevertOrder={handleRevertOrder}
              statusOrder={statusOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
