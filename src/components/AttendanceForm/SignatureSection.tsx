import React, { useRef, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface SignatureBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface SignatureSectionProps {
  signature: string;
  setSignature: (value: string) => void;
  errors?: Record<string, string>;
}

// Helper function to get the actual bounds of the signature
const getSignatureBounds = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): SignatureBounds | null => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let foundPixel = false;

  // Scan the canvas for non-transparent pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        foundPixel = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // Return null if no signature was found
  if (!foundPixel) {
    return null;
  }

  return { minX, minY, maxX, maxY };
};

const SignatureSection = ({
  signature = "",
  setSignature = () => {},
  errors = {},
}: SignatureSectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [signatureData, setSignatureData] = useState<ImageData | null>(null);

  // Initialize canvas without restoring signature
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up drawing style
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    // Handle window resize
    const handleResize = () => {
      // Save current drawing
      const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setSignatureData(currentData);

      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Restore drawing style
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";

      // Restore drawing
      if (signatureData) {
        ctx.putImageData(signatureData, 0, 0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll events to preserve drawing
  useEffect(() => {
    const handleScroll = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Only restore if we have signature data and we're not in the middle of drawing
      if (signatureData && !isDrawing) {
        ctx.putImageData(signatureData, 0, 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [signatureData, isDrawing]);

  // Restore signature from props if available or clear if empty
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas first to prevent double drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (signature && signature.startsWith("data:image")) {
      const img = new Image();
      img.onload = () => {
        // Clear again before drawing to ensure no double images
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setSignatureData(currentData);
      };
      img.src = signature;
    } else if (!signature) {
      // Clear the canvas when signature is empty (after form submission)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData(null);
    }
  }, [signature]);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    // Get the correct position
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setLastPosition({ x, y });

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get the correct position
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling when drawing on touch devices
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPosition({ x, y });
  };

  const endDrawing = () => {
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save the current drawing state
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setSignatureData(currentData);

    // Get the bounds of the actual signature
    const bounds = getSignatureBounds(ctx, canvas.width, canvas.height);

    if (bounds) {
      // Create a temporary canvas to crop the signature
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        // Add some padding around the signature
        const padding = 10;
        const width = bounds.maxX - bounds.minX + padding * 2;
        const height = bounds.maxY - bounds.minY + padding * 2;

        tempCanvas.width = width;
        tempCanvas.height = height;

        // Draw only the signature area to the temp canvas
        tempCtx.drawImage(
          canvas,
          bounds.minX - padding,
          bounds.minY - padding,
          width,
          height,
          0,
          0,
          width,
          height,
        );

        // Save the cropped signature as data URL
        const dataUrl = tempCanvas.toDataURL("image/png");
        setSignature(dataUrl);
      }
    } else {
      // If no signature is detected, save an empty signature
      setSignature("");
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
    setSignature("");
  };

  return (
    <div className="w-full bg-card p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Tanda Tangan <span className="text-destructive">*</span>
      </h3>
      <div className="space-y-4">
        <Label htmlFor="signature">Silakan tanda tangan di bawah ini</Label>
        <div
          className={`border rounded-md bg-white ${errors.signature ? "border-destructive" : "border-input"}`}
        >
          <canvas
            ref={canvasRef}
            id="signature"
            className="w-full h-[150px] touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>
        {errors.signature && (
          <p className="text-destructive text-sm">{errors.signature}</p>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={clearSignature}
          className="w-full sm:w-auto"
        >
          Hapus Tanda Tangan
        </Button>
      </div>
    </div>
  );
};

export default SignatureSection;
