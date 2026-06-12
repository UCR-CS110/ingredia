import { useState, useEffect, useRef } from "react";
import { X, ScanBarcode, Loader2, Upload } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/browser";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound?: (product: any) => void;
}

export function ScanModal({ isOpen, onClose, onProductFound }: ScanModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasScanned = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<"idle" | "scanning" | "found" | "error" | "notfound">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      hasScanned.current = false;
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [isOpen]);

  async function startScanner() {
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      readerRef.current = new BrowserMultiFormatReader();
      setScanning(true);
      setStatus("scanning");
      setStatusMsg("Point camera at a barcode");

      readerRef.current.decodeFromVideoDevice(undefined, videoRef.current!, async (result, err) => {
        if (result && !hasScanned.current) {
          hasScanned.current = true;
          const barcode = result.getText();
          stopScanner();
          await lookupBarcode(barcode);
        }
      });
    } catch (err) {
      setStatus("error");
      setStatusMsg("Camera access denied or unavailable");
      setScanning(false);
    }
  }

  async function lookupBarcode(barcode: string) {
    setStatus("found");
    setStatusMsg(`Looking up barcode ${barcode}...`);
    try {
      const res = await fetch(`http://localhost:5000/api/products/barcode/${barcode}`);
      const data = await res.json();
      if (data && data.name) {
        setStatusMsg(`Found: ${data.name}`);
        setTimeout(() => {
          onProductFound?.(data);
          onClose();
        }, 1000);
      } else {
        setStatus("notfound");
        setStatusMsg("Item not in database");
      }
    } catch {
      setStatus("error");
      setStatusMsg("Could not look up product");
    }
  }

  function stopScanner() {
    try {
      if (readerRef.current) {
        const video = videoRef.current;
        if (video && video.srcObject) {
          (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
          video.srcObject = null;
        }
        readerRef.current = null;
      }
    } catch {}
    setScanning(false);
  }

  function handleClose() {
    stopScanner();
    onClose();
  }

  async function requestCamera() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      hasScanned.current = false;
      setStatus("idle");
      startScanner();
    } catch {
      setStatus("error");
      setStatusMsg("Camera access denied. Please allow camera in browser settings.");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("found");
    setStatusMsg("Reading barcode from image...");
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const img = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const result = await (reader as any).decodeFromCanvas(canvas);
      if (result) {
        await lookupBarcode(result.getText());
      } else {
        setStatus("notfound");
        setStatusMsg("No barcode found in image");
      }
    } catch {
      setStatus("notfound");
      setStatusMsg("Could not read barcode from image");
    }
    e.target.value = "";
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Scan Barcode</h2>
            <p className="text-sm text-gray-500">Point your camera at a product barcode</p>
          </div>
          <button onClick={handleClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Camera View */}
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-gray-950">
            <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative h-44 w-64">
                <div className="absolute -left-1 -top-1 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-green-400" />
                <div className="absolute -right-1 -top-1 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-green-400" />
                <div className="absolute -bottom-1 -left-1 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-green-400" />
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-green-400" />
                {scanning && <div className="absolute inset-x-0 top-0 h-0.5 bg-green-400 animate-bounce" />}
              </div>
            </div>
            {!scanning && status === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <ScanBarcode className="h-16 w-16 text-white/50" />
                <p className="text-sm text-white/70">Starting camera...</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium
            ${status === "found" ? "bg-green-50 text-green-700" :
              status === "error" || status === "notfound" ? "bg-red-50 text-red-700" :
              "bg-gray-50 text-gray-600"}`}>
            {status === "scanning" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "found" && <span>✓</span>}
            {(status === "error" || status === "notfound") && <span>✗</span>}
            <span>{statusMsg || "Initializing scanner..."}</span>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            {status === "error" && (
              <button onClick={requestCamera} className="w-full rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700">
                Request Camera Access
              </button>
            )}
            {status === "notfound" && (
              <button onClick={() => { hasScanned.current = false; startScanner(); }} className="w-full rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700">
                Scan Again
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              Upload Image
            </button>
            <button onClick={handleClose} className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}