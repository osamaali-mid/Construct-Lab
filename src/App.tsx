import React, { useState, useRef, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import ObjectPanel from './components/ObjectPanel';
import { Tool, DrawingElement, FloorPlanObject } from './types';
import './App.css';

function App() {
  const [selectedTool, setSelectedTool] = useState<Tool>('select');
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [objects, setObjects] = useState<FloorPlanObject[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addElement = useCallback((element: DrawingElement) => {
    setElements(prev => [...prev, element]);
  }, []);

  const addObject = useCallback((object: FloorPlanObject) => {
    setObjects(prev => [...prev, object]);
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DrawingElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const clearCanvas = useCallback(() => {
    setElements([]);
    setObjects([]);
    setSelectedElement(null);
  }, []);

  return (
    <div className="app">
      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onClear={clearCanvas}
        scale={scale}
        onScaleChange={setScale}
      />
      
      <div className="main-content">
        <Canvas
          ref={canvasRef}
          selectedTool={selectedTool}
          elements={elements}
          objects={objects}
          selectedElement={selectedElement}
          isDrawing={isDrawing}
          scale={scale}
          pan={pan}
          onAddElement={addElement}
          onAddObject={addObject}
          onUpdateElement={updateElement}
          onSelectElement={setSelectedElement}
          onDrawingChange={setIsDrawing}
          onPanChange={setPan}
        />
        
        <ObjectPanel
          onObjectSelect={(type) => {
            setSelectedTool('object');
            // Store selected object type for placement
          }}
        />
      </div>
    </div>
  );
}

export default App;