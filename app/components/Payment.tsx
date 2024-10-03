import Link from 'next/link';
import { useRouter } from 'next/navigation';


type HandleBackFunction = (showPayment: boolean) => void;

interface PaymentPageProps {
  handleBack: HandleBackFunction;
}

export default function PaymentPage({handleBack}: PaymentPageProps){
    const router = useRouter();

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
    
          alert('Emails sent successfully');
        } catch (error) {
          console.error('Error sending emails:', error);
          alert('Error sending emails');
        }
    }

    function goBack() {
        handleBack(false);
    }

    return (
        <div>
            {/* Back Button */}
            <div className="mb-6">
                    <button onClick={goBack} className="text-green-600 text-sm font-medium underline">
                    Back
                    </button>
                </div>
            <button onClick={handlePayment} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                I paid via PayPal
            </button>
        </div>
    )
}