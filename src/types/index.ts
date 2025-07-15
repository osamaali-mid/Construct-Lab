export type Tool = 'select' | 'draw' | 'line' | 'rectangle' | 'move' | 'erase' | 'text' | 'object';

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: 'line' | 'rectangle' | 'freehand' | 'text';
  points: Point[];
  color: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
}

export interface FloorPlanObject {
  id: string;
  type: string;
  position: Point;
  rotation: number;
  scale: number;
  width: number;
  height: number;
}

export interface ObjectType {
  id: string;
  name: string;
  category: 'doors' | 'windows' | 'furniture' | 'fixtures';
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}