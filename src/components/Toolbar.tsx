import React from 'react';
import { 
  MousePointer, 
  Pencil, 
  Minus, 
  Square, 
  Move, 
  Eraser, 
  Type, 
  Package,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { Tool } from '../types';
import './Toolbar.css';

interface ToolbarProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
  onClear: () => void;
  scale: number;
  onScaleChange: (scale: number) => void;
}

const tools = [
  { id: 'select' as Tool, icon: MousePointer, label: 'Select', shortcut: 'V' },
  { id: 'draw' as Tool, icon: Pencil, label: 'Draw', shortcut: 'D' },
  { id: 'line' as Tool, icon: Minus, label: 'Line', shortcut: 'L' },
  { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle', shortcut: 'R' },
  { id: 'move' as Tool, icon: Move, label: 'Move', shortcut: 'M' },
  { id: 'erase' as Tool, icon: Eraser, label: 'Erase', shortcut: 'E' },
  { id: 'text' as Tool, icon: Type, label: 'Text', shortcut: 'T' },
  { id: 'object' as Tool, icon: Package, label: 'Objects', shortcut: 'O' },
];

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onClear,
  scale,
  onScaleChange
}) => {
  const handleZoomIn = () => {
    onScaleChange(Math.min(scale * 1.2, 3));
  };

  const handleZoomOut = () => {
    onScaleChange(Math.max(scale / 1.2, 0.1));
  };

  const handleResetZoom = () => {
    onScaleChange(1);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <h1 className="app-title">Floor Plan Lab</h1>
      </div>

      <div className="toolbar-section">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => onToolSelect(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <Icon size={20} />
              <span className="tool-label">{tool.label}</span>
            </button>
          );
        })}
      </div>

      <div className="toolbar-section">
        <div className="zoom-controls">
          <button
            className="tool-button"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button
            className="tool-button"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            className="tool-button"
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <button
          className="tool-button clear-button"
          onClick={onClear}
          title="Clear All"
        >
          <Trash2 size={20} />
          <span className="tool-label">Clear</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;