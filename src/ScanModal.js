export function ScanModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Scan Product</h2>

        <div className="bg-gray-100 h-40 rounded-xl flex items-center justify-center mb-4">
          Camera Preview
        </div>

        <div className="bg-red-100 text-red-700 p-4 rounded-xl">
          Demo Result: Protein Energy Bar contains peanuts and added sugar.
        </div>

        <button onClick={onClose} className="mt-4 w-full bg-gray-900 text-white p-3 rounded-xl">
          Close
        </button>
      </div>
    </div>
  );
}