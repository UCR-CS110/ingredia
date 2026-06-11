import { X, Camera, Upload, ScanBarcode } from "lucide-react";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCamera?: () => void;
  onUploadImage?: () => void;
}

export function ScanModal({
  isOpen,
  onClose,
  onOpenCamera,
  onUploadImage,
}: ScanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Scan Product</h2>
            <p className="text-sm text-gray-500">
              Scan a barcode or ingredient label
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            aria-label="Close scan modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-5">
          {/* Camera Preview Mockup */}
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-gray-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />

            {/* Scan Frame */}
            <div className="relative flex h-52 w-52 items-center justify-center rounded-3xl border-2 border-white/80">
              <div className="absolute -left-1 -top-1 h-8 w-8 rounded-tl-3xl border-l-4 border-t-4 border-green-400" />
              <div className="absolute -right-1 -top-1 h-8 w-8 rounded-tr-3xl border-r-4 border-t-4 border-green-400" />
              <div className="absolute -bottom-1 -left-1 h-8 w-8 rounded-bl-3xl border-b-4 border-l-4 border-green-400" />
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-br-3xl border-b-4 border-r-4 border-green-400" />

              <ScanBarcode className="h-16 w-16 text-white/70" />
            </div>

            <p className="absolute bottom-5 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur">
              Center the barcode inside the frame
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onOpenCamera}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3.5 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-[0.99]"
            >
              <Camera className="h-5 w-5" />
              Open Camera
            </button>

            <button
              onClick={onUploadImage}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-[0.99]"
            >
              <Upload className="h-5 w-5" />
              Upload Image
            </button>
          </div>

          <p className="text-center text-xs leading-relaxed text-gray-500">
            You can scan a barcode or upload a clear photo of the ingredient
            list.
          </p>
        </div>
      </div>
    </div>
  );
}