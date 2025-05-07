
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Move, 
  ArrowRight,
  ArrowRightLeft,
  Circle, 
  Undo, 
  Redo, 
  Save,
  Download,
  Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  activeTool: string;
  onToolSelect: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onClear: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolSelect,
  onUndo,
  onRedo,
  onSave,
  onClear,
  onExport,
  canUndo,
  canRedo
}) => {
  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'dotted-arrow', icon: ArrowRight, label: 'Dotted Arrow' },
    { id: 'bidirectional-arrow', icon: ArrowRightLeft, label: 'Two-way Arrow' },
    { id: 'curved-arrow', icon: ArrowRight, label: 'Curved Arrow' },
    { id: 'player-home', icon: Circle, label: 'Home Player' },
    { id: 'player-away', icon: Circle, label: 'Away Player' },
  ];

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg">
      <div className="flex flex-wrap gap-2 mb-4">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            type="button"
            variant={activeTool === tool.id ? "default" : "outline"}
            size="icon"
            className={cn(
              "aspect-square",
              tool.id === 'dotted-arrow' && "border-dashed",
              tool.id === 'curved-arrow' && "rounded-full",
              tool.id.includes('player-home') && "border-blue-500",
              tool.id.includes('player-away') && "border-red-500"
            )}
            onClick={() => onToolSelect(tool.id)}
          >
            <tool.icon className={cn(
              "h-5 w-5",
              tool.id.includes('player-home') && "text-blue-500",
              tool.id.includes('player-away') && "text-red-500",
              tool.id === 'curved-arrow' && "transform rotate-90"
            )} />
            <span className="sr-only">{tool.label}</span>
          </Button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="aspect-square"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo className="h-5 w-5" />
          <span className="sr-only">Undo</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="aspect-square"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo className="h-5 w-5" />
          <span className="sr-only">Redo</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="aspect-square"
          onClick={onSave}
        >
          <Save className="h-5 w-5" />
          <span className="sr-only">Save</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="aspect-square"
          onClick={onExport}
        >
          <Download className="h-5 w-5" />
          <span className="sr-only">Export</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="aspect-square text-destructive"
          onClick={onClear}
        >
          <Trash className="h-5 w-5" />
          <span className="sr-only">Clear</span>
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
