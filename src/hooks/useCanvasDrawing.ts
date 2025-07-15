import { useCallback } from 'react';
import { DrawingElement, Point } from '../types';

export const useCanvasDrawing = () => {
  const drawGrid = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scale: number,
    pan: Point
  ) => {
    const gridSize = 20 * scale;
    const offsetX = pan.x % gridSize;
    const offsetY = pan.y % gridSize;

    ctx.save();
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    // Vertical lines
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawElements = useCallback((
    ctx: CanvasRenderingContext2D,
    elements: DrawingElement[],
    selectedElement: string | null
  ) => {
    elements.forEach(element => {
      ctx.save();
      
      ctx.strokeStyle = element.id === selectedElement ? '#2196f3' : element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (element.type === 'freehand') {
        if (element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        }
      } else if (element.type === 'line') {
        if (element.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          ctx.lineTo(element.points[1].x, element.points[1].y);
          ctx.stroke();
        }
      } else if (element.type === 'rectangle') {
        if (element.points.length >= 2) {
          const start = element.points[0];
          const end = element.points[1];
          const width = end.x - start.x;
          const height = end.y - start.y;
          
          ctx.beginPath();
          ctx.rect(start.x, start.y, width, height);
          ctx.stroke();
        }
      } else if (element.type === 'text' && element.text) {
        ctx.fillStyle = element.color;
        ctx.font = `${element.fontSize || 16}px Arial`;
        ctx.fillText(element.text, element.points[0].x, element.points[0].y);
      }

      ctx.restore();
    });
  }, []);

  return { drawGrid, drawElements };
};