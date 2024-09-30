'use client';

export default function PaymentPage() {
    const handlePayment = async () => {
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emails: [
                { to: 'jais.aman03@gmail.com', subject: 'Order Confirmation', text: 'Your order has been placed' },
                { to: 'kleinanzeigenkurier@gmail.com', subject: 'Order Confirmation', text: 'A new order has been placed' },
              ],
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to send emails');
          }
    
          alert('Emails sent successfully');
        } catch (error) {
          console.error('Error sending emails:', error);
          alert('Error sending emails');
        }
    }

    return (
        <button onClick={handlePayment} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            I paid
        </button>
    )
}