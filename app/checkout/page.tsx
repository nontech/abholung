"use client";

import CheckoutContent from "../components/CheckoutContent";

export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout</h1>
      {/* CheckoutContent will be client-side rendered */}
      <CheckoutContent
        total_amount={0}
        onPaymentSuccess={() => {}}
        onPaymentError={() => {}}
      />
    </div>
  );
}
