
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
  Trash,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';

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
  onToggleInstructions: () => void;
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
  canRedo,
  onToggleInstructions
}) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'dotted-arrow', icon: ArrowRight, label: 'Dotted Arrow' },
    { id: 'bidirectional-arrow', icon: ArrowRightLeft, label: 'Two-way Arrow' },
    { id: 'curved-arrow', icon: ArrowRight, label: 'Curved Arrow' },
    { id: 'curved-arrow-reverse', icon: ArrowRight, label: 'Curved Arrow (Alt)' },
    { id: 'player-home', icon: Circle, label: 'Home Player' },
    { id: 'player-away', icon: Circle, label: 'Away Player' },
  ];

  return (
    <div className="bg-card rounded-lg shadow-lg">
      <Collapsible
        open={!isCollapsed}
        onOpenChange={(open) => setIsCollapsed(!open)}
        className="w-full"
      >
        <div className="p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleInstructions}
              className="aspect-square"
            >
              <Info className="h-5 w-5" />
              <span className="sr-only">Instructions</span>
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="aspect-square">
                {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                <span className="sr-only">{isCollapsed ? 'Show Tools' : 'Hide Tools'}</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="flex gap-2">
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

        <CollapsibleContent>
          <div className="flex flex-wrap gap-2 p-4 pt-0">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                type="button"
                variant={activeTool === tool.id ? "default" : "outline"}
                size="icon"
                className={cn(
                  "aspect-square",
                  tool.id === 'dotted-arrow' && "border-dashed",
                  tool.id === 'curved-arrow' && "rounded-tl-full rounded-bl-full",
                  tool.id === 'curved-arrow-reverse' && "rounded-tr-full rounded-br-full",
                  tool.id.includes('player-home') && "border-blue-500",
                  tool.id.includes('player-away') && "border-red-500"
                )}
                onClick={() => onToolSelect(tool.id)}
              >
                <tool.icon className={cn(
                  "h-5 w-5",
                  tool.id.includes('player-home') && "text-blue-500",
                  tool.id.includes('player-away') && "text-red-500",
                  tool.id === 'curved-arrow' && "transform rotate-90",
                  tool.id === 'curved-arrow-reverse' && "transform -rotate-90"
                )} />
                <span className="sr-only">{tool.label}</span>
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Toolbar;
