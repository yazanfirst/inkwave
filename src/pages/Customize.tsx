import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Type, Upload, Palette, ShoppingCart, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const PRODUCT_TEMPLATES = [
  { id: "tshirt", name: "T-Shirt", price: 99, baseColor: "#ffffff", printArea: { x: 100, y: 80, w: 120, h: 150 } },
  { id: "hoodie", name: "Hoodie", price: 189, baseColor: "#2d2d2d", printArea: { x: 95, y: 90, w: 130, h: 140 } },
  { id: "mug", name: "Mug", price: 55, baseColor: "#ffffff", printArea: { x: 70, y: 90, w: 180, h: 120 } },
  { id: "totebag", name: "Tote Bag", price: 75, baseColor: "#f5f0e8", printArea: { x: 80, y: 70, w: 160, h: 180 } },
  { id: "poster", name: "Poster", price: 130, baseColor: "#ffffff", printArea: { x: 40, y: 40, w: 240, h: 280 } },
];

const COLOR_OPTIONS = [
  "#ffffff", "#000000", "#1a1a2e", "#16213e", "#0f3460",
  "#e94560", "#533483", "#2b9348", "#e07c24", "#f5f0e8",
];

interface DesignElement {
  type: "text" | "image";
  content: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  width?: number;
  height?: number;
  img?: HTMLImageElement;
}

const drawProductOutline = (ctx: CanvasRenderingContext2D, templateId: string, color: string) => {
  ctx.save();

  // Determine if color is dark
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const isDark = (r * 0.299 + g * 0.587 + b * 0.114) < 128;
  const strokeColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.12)";
  const shadowColor = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)";

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";

  switch (templateId) {
    case "tshirt": {
      // T-shirt shape
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(90, 50);
      // Left shoulder & sleeve
      ctx.lineTo(50, 55);
      ctx.lineTo(30, 100);
      ctx.lineTo(55, 110);
      ctx.lineTo(70, 80);
      ctx.lineTo(70, 300);
      // Bottom
      ctx.lineTo(250, 300);
      // Right side
      ctx.lineTo(250, 80);
      ctx.lineTo(265, 110);
      ctx.lineTo(290, 100);
      ctx.lineTo(270, 55);
      ctx.lineTo(230, 50);
      // Collar
      ctx.quadraticCurveTo(200, 70, 160, 70);
      ctx.quadraticCurveTo(120, 70, 90, 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Collar detail
      ctx.beginPath();
      ctx.moveTo(115, 52);
      ctx.quadraticCurveTo(160, 78, 205, 52);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }
    case "hoodie": {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(85, 55);
      // Left shoulder & sleeve
      ctx.lineTo(35, 65);
      ctx.lineTo(15, 130);
      ctx.lineTo(45, 140);
      ctx.lineTo(60, 95);
      ctx.lineTo(60, 310);
      // Bottom
      ctx.lineTo(260, 310);
      // Right
      ctx.lineTo(260, 95);
      ctx.lineTo(275, 140);
      ctx.lineTo(305, 130);
      ctx.lineTo(285, 65);
      ctx.lineTo(235, 55);
      // Hood
      ctx.quadraticCurveTo(220, 25, 160, 20);
      ctx.quadraticCurveTo(100, 25, 85, 55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Hood line
      ctx.beginPath();
      ctx.moveTo(110, 50);
      ctx.quadraticCurveTo(160, 80, 210, 50);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Pocket
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      ctx.roundRect(100, 220, 120, 50, 6);
      ctx.stroke();
      break;
    }
    case "mug": {
      ctx.fillStyle = color;
      // Main body (cylinder front)
      ctx.beginPath();
      ctx.ellipse(160, 80, 90, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(70, 80);
      ctx.lineTo(70, 280);
      ctx.ellipse(160, 280, 90, 20, 0, Math.PI, 0, true);
      ctx.lineTo(250, 80);
      ctx.fill();
      ctx.stroke();
      // Bottom ellipse
      ctx.beginPath();
      ctx.ellipse(160, 280, 90, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Handle
      ctx.fillStyle = "transparent";
      ctx.lineWidth = 8;
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(265, 180, 25, 50, 0, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = strokeColor;
      break;
    }
    case "totebag": {
      ctx.fillStyle = color;
      // Bag body
      ctx.beginPath();
      ctx.moveTo(65, 80);
      ctx.lineTo(55, 320);
      ctx.quadraticCurveTo(160, 340, 265, 320);
      ctx.lineTo(255, 80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Handles
      ctx.lineWidth = 4;
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.moveTo(100, 80);
      ctx.quadraticCurveTo(100, 30, 130, 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(220, 80);
      ctx.quadraticCurveTo(220, 30, 190, 30);
      ctx.stroke();
      break;
    }
    case "poster": {
      ctx.fillStyle = color;
      // Shadow
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.rect(25, 20, 270, 320);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.stroke();
      // Inner border
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(35, 30, 250, 300);
      break;
    }
  }

  ctx.restore();
};

const Customize = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(PRODUCT_TEMPLATES[0]);
  const [baseColor, setBaseColor] = useState(PRODUCT_TEMPLATES[0].baseColor);
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  const CANVAS_W = 320;
  const CANVAS_H = 360;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with light background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw product outline
    drawProductOutline(ctx, selectedTemplate.id, baseColor);

    // Draw print area indicator
    const pa = selectedTemplate.printArea;
    ctx.strokeStyle = "rgba(59,130,246,0.35)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeRect(pa.x, pa.y, pa.w, pa.h);
    ctx.setLineDash([]);

    // Draw elements
    elements.forEach((el) => {
      if (el.type === "text") {
        ctx.font = `bold ${el.fontSize || 24}px 'Poppins', sans-serif`;
        ctx.fillStyle = el.color || "#000000";
        ctx.textAlign = "center";
        ctx.fillText(el.content, el.x, el.y);
      } else if (el.type === "image" && el.img) {
        const w = el.width || 80;
        const h = el.height || 80;
        ctx.drawImage(el.img, el.x - w / 2, el.y - h / 2, w, h);
      }
    });
  }, [baseColor, elements, selectedTemplate]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const addText = () => {
    if (!textInput.trim()) return;
    const pa = selectedTemplate.printArea;
    setElements((prev) => [
      ...prev,
      {
        type: "text",
        content: textInput,
        x: pa.x + pa.w / 2,
        y: pa.y + pa.h / 2,
        fontSize,
        color: textColor,
      },
    ]);
    setTextInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const pa = selectedTemplate.printArea;
        const maxW = pa.w * 0.8;
        const scale = Math.min(maxW / img.width, maxW / img.height, 1);
        setElements((prev) => [
          ...prev,
          {
            type: "image",
            content: ev.target?.result as string,
            x: pa.x + pa.w / 2,
            y: pa.y + pa.h / 2,
            width: img.width * scale,
            height: img.height * scale,
            img,
          },
        ]);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { mx: 0, my: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      mx: (clientX - rect.left) * (CANVAS_W / rect.width),
      my: (clientY - rect.top) * (CANVAS_H / rect.height),
    };
  };

  const findElementAt = (mx: number, my: number) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      const hw = el.type === "image" ? (el.width || 80) / 2 : 50;
      const hh = el.type === "image" ? (el.height || 80) / 2 : (el.fontSize || 24) / 2;
      if (mx >= el.x - hw && mx <= el.x + hw && my >= el.y - hh && my <= el.y + hh) {
        return i;
      }
    }
    return -1;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getCanvasCoords(e.clientX, e.clientY);
    const idx = findElementAt(mx, my);
    if (idx >= 0) {
      setDragging(idx);
      setDragOffset({ x: mx - elements[idx].x, y: my - elements[idx].y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging === null) return;
    const { mx, my } = getCanvasCoords(e.clientX, e.clientY);
    setElements((prev) =>
      prev.map((el, i) =>
        i === dragging ? { ...el, x: mx - dragOffset.x, y: my - dragOffset.y } : el
      )
    );
  };

  const handleMouseUp = () => setDragging(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const { mx, my } = getCanvasCoords(touch.clientX, touch.clientY);
    const idx = findElementAt(mx, my);
    if (idx >= 0) {
      setDragging(idx);
      setDragOffset({ x: mx - elements[idx].x, y: my - elements[idx].y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (dragging === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    const { mx, my } = getCanvasCoords(touch.clientX, touch.clientY);
    setElements((prev) =>
      prev.map((el, i) =>
        i === dragging ? { ...el, x: mx - dragOffset.x, y: my - dragOffset.y } : el
      )
    );
  };

  const reset = () => {
    setElements([]);
    setBaseColor(selectedTemplate.baseColor);
  };

  const addToCart = () => {
    if (elements.length === 0) {
      toast.error("Add at least one design element first!");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error("Could not capture preview. Please try again.");
      return;
    }

    const maxPreviewSize = 700;
    const scale = Math.min(1, maxPreviewSize / Math.max(canvas.width, canvas.height));
    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = Math.max(1, Math.floor(canvas.width * scale));
    previewCanvas.height = Math.max(1, Math.floor(canvas.height * scale));

    const ctx = previewCanvas.getContext("2d");
    if (!ctx) {
      toast.error("Could not prepare preview. Please try again.");
      return;
    }

    ctx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);
    const preview = previewCanvas.toDataURL("image/jpeg", 0.82);

    addItem({
      id: `custom-${Date.now()}`,
      name: `Custom ${selectedTemplate.name}`,
      price: selectedTemplate.price,
      image: preview,
    });
    toast.success(`Custom ${selectedTemplate.name} added to cart!`);
    reset();
  };

  const downloadDesign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `inkwave-custom-${selectedTemplate.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Design Your Own
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pick a product, add your text & images, then order!
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Canvas Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative rounded-xl border-2 border-border bg-muted/30 p-4 w-full max-w-[380px] aspect-[320/360]">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="w-full h-full rounded-lg cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            />
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/50 pointer-events-none">
              Drag elements to reposition
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button variant="outline" size="sm" onClick={downloadDesign}>
              <Download className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button size="sm" onClick={addToCart}>
              <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart — {selectedTemplate.price} AED
            </Button>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Product selector */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Choose Product</h3>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t);
                    setBaseColor(t.baseColor);
                    setElements([]);
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedTemplate.id === t.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Base color */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Palette className="h-4 w-4" /> Product Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setBaseColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    baseColor === c ? "border-primary scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Text tool */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Type className="h-4 w-4" /> Add Text
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Your text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addText()}
                className="flex-1"
              />
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="h-10 w-10 rounded-md border border-input cursor-pointer"
              />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <label className="text-xs text-muted-foreground">Size:</label>
              <input
                type="range"
                min={12}
                max={48}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="text-xs text-muted-foreground w-6">{fontSize}</span>
              <Button size="sm" onClick={addText} disabled={!textInput.trim()}>
                Add
              </Button>
            </div>
          </div>

          {/* Image upload */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Upload className="h-4 w-4" /> Upload Image
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" /> Choose Image
            </Button>
            <p className="mt-1 text-[11px] text-muted-foreground">PNG, JPG — will be placed in the print area</p>
          </div>

          {/* Design elements list */}
          {elements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Design Elements</h3>
              <div className="space-y-1">
                {elements.map((el, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-muted px-3 py-1.5 text-sm">
                    <span className="truncate text-foreground">
                      {el.type === "text" ? `"${el.content}"` : "Image"}
                    </span>
                    <button
                      onClick={() => setElements((prev) => prev.filter((_, j) => j !== i))}
                      className="text-destructive hover:text-destructive/80 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Customize;
