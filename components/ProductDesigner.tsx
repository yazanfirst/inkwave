'use client';

import { useEffect, useRef, useState } from 'react';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Product } from '@/lib/types';

export function ProductDesigner({ product }: { product: Product }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any>(null);
  const [editorState, setEditorState] = useState<Record<string, unknown>>({});
  const [exportUrl, setExportUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { Canvas, Rect, Textbox, FabricImage } = await import('fabric');
      if (!mounted || !canvasRef.current) return;
      const c = new Canvas(canvasRef.current, { width: 500, height: 600, backgroundColor: '#111' });
      const area = product.designer.printAreas[0];
      c.add(
        new Rect({ left: area.x * 500, top: area.y * 600, width: area.w * 500, height: area.h * 600, fill: 'transparent', stroke: '#00c2ff', strokeDashArray: [8, 6], selectable: false })
      );
      c.on('object:modified', () => setEditorState(c.toJSON()));
      fabricRef.current = { c, Textbox, FabricImage };
    })();
    return () => {
      mounted = false;
      fabricRef.current?.c?.dispose();
    };
  }, [product.designer.printAreas]);

  function addText() {
    const { c, Textbox } = fabricRef.current;
    c.add(new Textbox('INKWAVE', { left: 200, top: 240, fill: '#fff', fontSize: 42, fontWeight: 'bold' }));
  }

  async function addImage(file: File) {
    const form = new FormData();
    form.append('file', file);
    const upload = await fetch('/api/upload', { method: 'POST', body: form }).then((r) => r.json());
    const { c, FabricImage } = fabricRef.current;
    const img = await FabricImage.fromURL(upload.url);
    img.scale(0.35);
    c.add(img);
  }

  async function exportPng() {
    const c = fabricRef.current.c;
    const dataUrl = c.toDataURL({ format: 'png', multiplier: Math.max(1, product.designer.export.width / 500) });
    const res = await fetch('/api/designer/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dataUrl }) }).then((r) => r.json());
    setEditorState(c.toJSON());
    setExportUrl(res.url);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-bold">Customize</h3>
      <canvas ref={canvasRef} className="max-w-full rounded border border-white/20" />
      <div className="flex flex-wrap gap-2 text-sm">
        <button className="rounded bg-white/10 px-3 py-2" onClick={addText}>Add text</button>
        <label className="rounded bg-white/10 px-3 py-2">
          Upload image
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && addImage(e.target.files[0])} />
        </label>
        <button className="rounded bg-white/10 px-3 py-2" onClick={exportPng}>Export design</button>
      </div>
      {exportUrl && (
        <div className="space-y-2">
          <p className="text-xs text-emerald-300">Design exported: {exportUrl}</p>
          <AddToCartButton product={product} variantId={product.variants[0].id} design={{ editorState, exportPngUrl: exportUrl }} />
        </div>
      )}
    </div>
  );
}
