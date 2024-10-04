
interface PaymentProps {
    handlePaymentDone: (paymentDone: boolean) => void;
}

export default function PaymentPage({handlePaymentDone}: PaymentProps){

    const paypal_logo = '/images/paypal_logo.png';
    const mukesh_paypal = '/images/mukesh_paypal.png';

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

          if (response.ok) {
            // router.push('/summary');
          }
          if (!response.ok) {
            throw new Error('Failed to send emails');
          }
          handlePaymentDone(true);
          alert('Emails sent successfully');
        } catch (error) {
          console.error('Error sending emails:', error);
          alert('Error sending emails');
        }
    }

    return (
        <div className="mt-16">
          <div className='flex justify-center mb-10'>
            <img
              src={mukesh_paypal}
              alt="Mukesh Paypal link"
              className="h-80 w-80" 
            />
          </div>
          <div className='flex justify-center mb-10'>
            <img
              src={paypal_logo}
              alt="Paypal Logo"
              className="h-16 w-25" 
            />
          </div>
          <div className='flex justify-center mb-10'>
            <button onClick={handlePayment} className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-48">
                I paid via PayPal
            </button>
          </div>
          
        </div>
    )
}