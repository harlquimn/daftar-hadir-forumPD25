import React, { useRef, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface SignatureSectionProps {
  signature: string;
  setSignature: (value: string) => void;
  errors?: Record<string, string>;
}

const SignatureSection = ({
  signature = "",
  setSignature = () => {},
  errors = {},
}: SignatureSectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [signatureData, setSignatureData] = useState<ImageData | null>(null);

  // Initialize canvas and restore signature if exists
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

    // Restore signature if we have saved data
    if (signatureData) {
      ctx.putImageData(signatureData, 0, 0);
    }

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
  }, [signatureData]);

  // Handle scroll events to preserve drawing
  useEffect(() => {
    const handleScroll = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Save current drawing if we don't have it saved yet
      if (!signatureData) {
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setSignatureData(currentData);
      } else {
        // Restore the drawing
        ctx.putImageData(signatureData, 0, 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [signatureData]);

  // Restore signature from props if available
  useEffect(() => {
    if (signature && signature.startsWith("data:image")) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setSignatureData(currentData);
      };
      img.src = signature;
    }
  }, []);

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

    // Save the signature as data URL
    const dataUrl = canvas.toDataURL("image/png");
    setSignature(dataUrl);
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
