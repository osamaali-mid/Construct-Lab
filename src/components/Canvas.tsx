import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Tool, DrawingElement, FloorPlanObject, Point } from '../types';
import { useCanvasDrawing } from '../hooks/useCanvasDrawing';
import { useCanvasInteraction } from '../hooks/useCanvasInteraction';

interface CanvasProps {
  selectedTool: Tool;
  elements: DrawingElement[];
  objects: FloorPlanObject[];
  selectedElement: string | null;
  isDrawing: boolean;
  scale: number;
  pan: Point;
  onAddElement: (element: DrawingElement) => void;
  onAddObject: (object: FloorPlanObject) => void;
  onUpdateElement: (id: string, updates: Partial<DrawingElement>) => void;
  onSelectElement: (id: string | null) => void;
  onDrawingChange: (isDrawing: boolean) => void;
  onPanChange: (pan: Point) => void;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({
  selectedTool,
  elements,
  objects,
  selectedElement,
  isDrawing,
  scale,
  pan,
  onAddElement,
  onAddObject,
  onUpdateElement,
  onSelectElement,
  onDrawingChange,
  onPanChange
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => canvasRef.current!);

  const { drawElements, drawGrid } = useCanvasDrawing();
  
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  } = useCanvasInteraction({
    selectedTool,
    elements,
    objects,
    selectedElement,
    isDrawing,
    scale,
    pan,
    onAddElement,
    onAddObject,
    onUpdateElement,
    onSelectElement,
    onDrawingChange,
    onPanChange
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height, scale, pan);

    // Draw elements
    drawElements(ctx, elements, selectedElement);

    // Draw objects (simplified for now)
    objects.forEach(obj => {
      ctx.fillStyle = obj.id === selectedElement ? '#2196f3' : '#666';
      ctx.fillRect(obj.position.x - obj.width/2, obj.position.y - obj.height/2, obj.width, obj.height);
    });

    // Restore context
    ctx.restore();
  }, [elements, objects, selectedElement, scale, pan, drawElements, drawGrid]);

  const getToolClass = () => {
    switch (selectedTool) {
      case 'select': return 'select-tool';
      case 'move': return 'move-tool';
      case 'erase': return 'erase-tool';
      default: return '';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`canvas-container ${getToolClass()}`}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;