import React, { useState } from 'react';
import { DoorOpen, Square, Circle, Sofa, Bath, ChefHat } from 'lucide-react';
import { ObjectType } from '../types';
import './ObjectPanel.css';

interface ObjectPanelProps {
  onObjectSelect: (type: string) => void;
}

const objectCategories = {
  doors: [
    { id: 'door', name: 'Door', icon: DoorOpen, defaultWidth: 80, defaultHeight: 20 },
    { id: 'double-door', name: 'Double Door', icon: DoorOpen, defaultWidth: 120, defaultHeight: 20 },
    { id: 'sliding-door', name: 'Sliding Door', icon: DoorOpen, defaultWidth: 100, defaultHeight: 20 },
  ],
  furniture: [
    { id: 'sofa', name: 'Sofa', icon: Sofa, defaultWidth: 180, defaultHeight: 80 },
    { id: 'table-round', name: 'Round Table', icon: Circle, defaultWidth: 100, defaultHeight: 100 },
    { id: 'table-rect', name: 'Rectangle Table', icon: Square, defaultWidth: 160, defaultHeight: 80 },
  ],
  fixtures: [
    { id: 'toilet', name: 'Toilet', icon: Bath, defaultWidth: 40, defaultHeight: 60 },
    { id: 'sink', name: 'Sink', icon: Bath, defaultWidth: 60, defaultHeight: 40 },
    { id: 'shower', name: 'Shower', icon: Bath, defaultWidth: 90, defaultHeight: 90 },
    { id: 'cooktop', name: 'Cooktop', icon: ChefHat, defaultWidth: 60, defaultHeight: 60 },
  ]
};

const ObjectPanel: React.FC<ObjectPanelProps> = ({ onObjectSelect }) => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof objectCategories>('doors');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`object-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-header">
        <h3>Objects</h3>
        <button 
          className="collapse-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="category-tabs">
            {Object.keys(objectCategories).map((category) => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category as keyof typeof objectCategories)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="objects-grid">
            {objectCategories[activeCategory].map((obj) => {
              const Icon = obj.icon;
              return (
                <button
                  key={obj.id}
                  className="object-button"
                  onClick={() => onObjectSelect(obj.id)}
                  title={obj.name}
                >
                  <Icon size={24} />
                  <span className="object-name">{obj.name}</span>
                </button>
              );
            })}
          </div>

          <div className="panel-help">
            <p>Select an object and click on the canvas to place it.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ObjectPanel;