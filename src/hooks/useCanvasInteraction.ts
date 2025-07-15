import { useCallback, useRef } from 'react';
import { Tool, DrawingElement, FloorPlanObject, Point } from '../types';

interface UseCanvasInteractionProps {
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

export const useCanvasInteraction = ({
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
}: UseCanvasInteractionProps) => {
  const currentElement = useRef<DrawingElement | null>(null);
  const lastPanPoint = useRef<Point | null>(null);

  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / scale,
      y: (e.clientY - rect.top - pan.y) / scale
    };
  }, [scale, pan]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const findElementAt = useCallback((point: Point): string | null => {
    // Simple hit detection - in a real app, this would be more sophisticated
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (element.points.length > 0) {
        const firstPoint = element.points[0];
        const distance = Math.sqrt(
          Math.pow(point.x - firstPoint.x, 2) + Math.pow(point.y - firstPoint.y, 2)
        );
        if (distance < 20) {
          return element.id;
        }
      }
    }
    return null;
  }, [elements]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);

    if (selectedTool === 'select') {
      const elementId = findElementAt(point);
      onSelectElement(elementId);
    } else if (selectedTool === 'move') {
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
    } else if (selectedTool === 'erase') {
      const elementId = findElementAt(point);
      if (elementId) {
        // Remove element
        onUpdateElement(elementId, { points: [] }); // This would trigger deletion in parent
      }
    } else if (selectedTool === 'draw') {
      currentElement.current = {
        id: generateId(),
        type: 'freehand',
        points: [point],
        color: '#000000',
        strokeWidth: 2
      };
      onDrawingChange(true);
    } else if (selectedTool === 'line') {
      currentElement.current = {
        id: generateId(),
        type: 'line',
        points: [point],
        color: '#000000',
        strokeWidth: 2
      };
      onDrawingChange(true);
    } else if (selectedTool === 'rectangle') {
      currentElement.current = {
        id: generateId(),
        type: 'rectangle',
        points: [point],
        color: '#000000',
        strokeWidth: 2
      };
      onDrawingChange(true);
    } else if (selectedTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const textElement: DrawingElement = {
          id: generateId(),
          type: 'text',
          points: [point],
          color: '#000000',
          strokeWidth: 1,
          text,
          fontSize: 16
        };
        onAddElement(textElement);
      }
    } else if (selectedTool === 'object') {
      const newObject: FloorPlanObject = {
        id: generateId(),
        type: 'door', // This would come from selected object type
        position: point,
        rotation: 0,
        scale: 1,
        width: 80,
        height: 20
      };
      onAddObject(newObject);
    }
  }, [selectedTool, getCanvasPoint, findElementAt, onSelectElement, onDrawingChange, onAddElement, onAddObject, onUpdateElement]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);

    if (selectedTool === 'move' && lastPanPoint.current) {
      const deltaX = e.clientX - lastPanPoint.current.x;
      const deltaY = e.clientY - lastPanPoint.current.y;
      onPanChange({
        x: pan.x + deltaX,
        y: pan.y + deltaY
      });
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
    } else if (isDrawing && currentElement.current) {
      if (selectedTool === 'draw') {
        currentElement.current.points.push(point);
        onUpdateElement(currentElement.current.id, { points: [...currentElement.current.points] });
      } else if (selectedTool === 'line' || selectedTool === 'rectangle') {
        currentElement.current.points = [currentElement.current.points[0], point];
        onUpdateElement(currentElement.current.id, { points: [...currentElement.current.points] });
      }
    }
  }, [selectedTool, isDrawing, getCanvasPoint, pan, onPanChange, onUpdateElement]);

  const handleMouseUp = useCallback(() => {
    if (selectedTool === 'move') {
      lastPanPoint.current = null;
    } else if (isDrawing && currentElement.current) {
      onAddElement(currentElement.current);
      currentElement.current = null;
      onDrawingChange(false);
    }
  }, [selectedTool, isDrawing, onAddElement, onDrawingChange]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    // Zoom functionality could be added here
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  };
};