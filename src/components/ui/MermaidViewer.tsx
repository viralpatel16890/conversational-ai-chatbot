import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  id: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      themeVariables: {
        darkMode: true,
        background: '#0f172a',
        primaryColor: '#4f46e5',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#6366f1',
        lineColor: '#94a3b8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#1e1b4b'
      }
    });

    let isMounted = true;
    setHasError(false);

    const renderChart = async () => {
      try {
        const uniqueId = `mermaid-${id}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, id]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoomLevel(1);

  if (hasError) {
    return (
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-200">Interactive Flow Rendering Fallback</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Viewing standard textual flow representation below:
        </p>
        <pre className="text-left text-xs bg-slate-950 p-4 rounded-lg overflow-x-auto text-indigo-300 font-mono">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden p-4">
      {/* Zoom / Pan Controls Toolbar */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 z-10 shadow-md">
        <button
          onClick={handleZoomOut}
          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold"
          title="Zoom Out"
        >
          -
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="px-2 py-0.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded font-bold"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded ml-1"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto min-h-[380px] flex items-center justify-center py-6 transition-transform"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};
