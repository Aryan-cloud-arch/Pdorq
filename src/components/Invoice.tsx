import { useRef } from 'react';

interface InvoiceData {
  invoiceNumber: string;
  issuedAt: string;
  customerName: string;
  customerEmail: string;
  type: 'deposit' | 'order';
  amountUsd: number;
  amountCredited: number;
  bonusAmount?: number;
  paymentMethod: string;
  paymentReference?: string;
  paymentAmountLocal?: number;
  paymentCurrency?: string;
  orderDetails?: {
    platform: string;
    service: string;
    targetUrl: string;
  };
}

interface InvoiceProps {
  data: InvoiceData;
  onClose: () => void;
}

export default function Invoice({ data, onClose }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg">
        {/* Print Controls */}
        <div className="sticky top-0 bg-gray-100 p-4 flex items-center justify-between border-b print:hidden">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            🖨️ Print / Download PDF
          </button>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8 text-black">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-wider">PDORQ</h1>
              <p className="text-gray-500 text-sm">Elite Operations</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-light text-gray-400">INVOICE</h2>
              <p className="text-sm text-gray-600 mt-1">{data.invoiceNumber}</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
              <p className="font-medium">{data.customerName}</p>
              <p className="text-gray-600 text-sm">{data.customerEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Invoice Date</p>
              <p className="text-gray-800">{formatDate(data.issuedAt)}</p>
              <p className="mt-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  PAID
                </span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wider">Description</th>
                <th className="text-right py-3 text-xs text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.type === 'deposit' ? (
                <>
                  <tr className="border-b border-gray-100">
                    <td className="py-3">Wallet Top-up</td>
                    <td className="py-3 text-right">${data.amountUsd.toFixed(2)}</td>
                  </tr>
                  {data.bonusAmount && data.bonusAmount > 0 && (
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-green-600">Bonus Credit</td>
                      <td className="py-3 text-right text-green-600">+${data.bonusAmount.toFixed(2)}</td>
                    </tr>
                  )}
                </>
              ) : (
                <tr className="border-b border-gray-100">
                  <td className="py-3">
                    <p className="font-medium">Order Payment</p>
                    {data.orderDetails && (
                      <p className="text-gray-500 text-sm">
                        {data.orderDetails.platform} - {data.orderDetails.service}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-right">${data.amountUsd.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300">
                <td className="py-4 font-bold text-lg">
                  {data.type === 'deposit' ? 'Total Credited' : 'Total Paid'}
                </td>
                <td className="py-4 text-right font-bold text-lg">
                  ${data.amountCredited.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Payment Details</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Method</p>
                <p className="font-medium capitalize">{data.paymentMethod.replace('_', ' ')}</p>
              </div>
              {data.paymentAmountLocal && data.paymentCurrency && (
                <div>
                  <p className="text-gray-500">Amount Paid</p>
                  <p className="font-medium">
                    {data.paymentCurrency === 'INR' ? '₹' : '$'}
                    {data.paymentAmountLocal.toFixed(2)} {data.paymentCurrency}
                  </p>
                </div>
              )}
              {data.paymentReference && (
                <div className="col-span-2">
                  <p className="text-gray-500">Reference</p>
                  <p className="font-mono text-xs break-all">{data.paymentReference}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Transaction Date</p>
                <p className="font-medium">{formatDateTime(data.issuedAt)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm border-t border-gray-200 pt-6">
            <p>Thank you for your business.</p>
            <p className="mt-2">
              support@pdorq.com • t.me/pdorq
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          [ref="invoiceRef"], [ref="invoiceRef"] * {
            visibility: visible;
          }
          [ref="invoiceRef"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
