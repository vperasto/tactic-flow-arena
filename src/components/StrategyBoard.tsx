
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import PlayerMarker from './PlayerMarker';
import ArrowTool from './ArrowTool';
import Arrow from './Arrow';
import Toolbar from './Toolbar';
import InstructionsDialog from './InstructionsDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Player {
  id: string;
  number: number;
  team: 'home' | 'away';
  x: number;
  y: number;
}

interface ArrowData {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: string;
}

interface PlayData {
  id: string;
  name: string;
  players: Player[];
  arrows: ArrowData[];
  createdAt: string;
  updatedAt: string;
}

const StrategyBoard: React.FC = () => {
  // State
  const [activeTool, setActiveTool] = useState('move');
  const [players, setPlayers] = useState<Player[]>([]);
  const [arrows, setArrows] = useState<ArrowData[]>([]);
  const [selectedArrow, setSelectedArrow] = useState<string | null>(null);
  const [history, setHistory] = useState<{players: Player[], arrows: ArrowData[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [playName, setPlayName] = useState('');
  const [plays, setPlays] = useState<PlayData[]>([]);
  
  const courtRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Add to history when state changes
  useEffect(() => {
    if (players.length > 0 || arrows.length > 0) {
      // If we're not at the end of history, truncate it
      if (historyIndex !== history.length - 1) {
        setHistory(history.slice(0, historyIndex + 1));
      }
      
      setHistory(prev => [...prev, { players: [...players], arrows: [...arrows] }]);
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, arrows]);

  // Load plays from localStorage on mount
  useEffect(() => {
    const savedPlays = localStorage.getItem('koristaktiikka-plays');
    if (savedPlays) {
      try {
        setPlays(JSON.parse(savedPlays));
      } catch (e) {
        console.error('Failed to load saved plays', e);
      }
    }
  }, []);

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    setActiveTool(tool);
    setSelectedArrow(null);
  };

  // Handle court click
  const handleCourtClick = (e: React.MouseEvent) => {
    if (!courtRef.current) return;
    
    const courtRect = courtRef.current.getBoundingClientRect();
    const x = e.clientX - courtRect.left;
    const y = e.clientY - courtRect.top;
    
    if (activeTool === 'player-home' || activeTool === 'player-away') {
      const team = activeTool === 'player-home' ? 'home' : 'away';
      const newPlayer: Player = {
        id: uuidv4(),
        number: players.filter(p => p.team === team).length + 1,
        team,
        x,
        y
      };
      
      setPlayers([...players, newPlayer]);
    }
    
    // Deselect arrow on court click
    setSelectedArrow(null);
  };

  // Handle arrow creation
  const handleArrowCreated = (startX: number, startY: number, endX: number, endY: number, type: string) => {
    const newArrow: ArrowData = {
      id: uuidv4(),
      startX,
      startY,
      endX,
      endY,
      type
    };
    
    setArrows([...arrows, newArrow]);
  };

  // Handle player drag
  const handlePlayerDragEnd = (id: string, x: number, y: number) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, x, y } : player
    ));
  };

  // Handle arrow update
  const handleArrowUpdate = (id: string, startX: number, startY: number, endX: number, endY: number) => {
    setArrows(arrows.map(arrow => 
      arrow.id === id ? { ...arrow, startX, startY, endX, endY } : arrow
    ));
  };

  // Handle arrow delete
  const handleArrowDelete = (id: string) => {
    setArrows(arrows.filter(arrow => arrow.id !== id));
    setSelectedArrow(null);
  };

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const prevState = history[newIndex];
      setPlayers(prevState.players);
      setArrows(prevState.arrows);
      setHistoryIndex(newIndex);
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setPlayers(nextState.players);
      setArrows(nextState.arrows);
      setHistoryIndex(newIndex);
    }
  };

  // Handle save
  const handleSave = () => {
    setSaveDialogOpen(true);
  };

  // Handle clear
  const handleClear = () => {
    setPlayers([]);
    setArrows([]);
    setSelectedArrow(null);
    setHistory([]);
    setHistoryIndex(-1);
  };

  // Handle export
  const handleExport = () => {
    // Implementation for exporting the current state
    toast({
      title: "Export feature",
      description: "Export functionality will be available in the next version",
    });
  };

  // Toggle instructions dialog
  const handleToggleInstructions = () => {
    setInstructionsOpen(!instructionsOpen);
  };

  // Save play to localStorage
  const savePlay = () => {
    if (!playName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your play",
        variant: "destructive"
      });
      return;
    }
    
    const newPlay: PlayData = {
      id: uuidv4(),
      name: playName,
      players: [...players],
      arrows: [...arrows],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedPlays = [...plays, newPlay];
    setPlays(updatedPlays);
    localStorage.setItem('koristaktiikka-plays', JSON.stringify(updatedPlays));
    
    setSaveDialogOpen(false);
    setPlayName('');
    
    toast({
      title: "Play saved",
      description: `"${playName}" has been saved successfully`,
    });
  };

  // Determine if an arrow tool is active
  const isArrowToolActive = () => {
    return ['arrow', 'dotted-arrow', 'bidirectional-arrow', 'curved-arrow', 'curved-arrow-reverse'].includes(activeTool);
  };

  // Get the current arrow type
  const getCurrentArrowType = () => {
    if (activeTool === 'dotted-arrow') return 'dotted-arrow';
    if (activeTool === 'bidirectional-arrow') return 'bidirectional-arrow';
    if (activeTool === 'curved-arrow') return 'curved-arrow';
    if (activeTool === 'curved-arrow-reverse') return 'curved-arrow-reverse';
    return 'arrow'; // Default arrow
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-action bg-clip-text text-transparent">
        Koristaktiikka – Strategy Board
      </h1>
      
      <div className="grid md:grid-cols-[1fr_3fr] gap-4">
        <div className="space-y-4">
          <Toolbar
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSave={handleSave}
            onClear={handleClear}
            onExport={handleExport}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onToggleInstructions={handleToggleInstructions}
          />
        </div>
        
        <div className="relative">
          <div
            ref={courtRef}
            className="court-container rounded-lg shadow-lg"
            onClick={handleCourtClick}
            style={{ 
              backgroundImage: 'url(https://vperasto.github.io/koristaktiikka/img//basketball_court_full.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Court lines would be drawn here */}
            <div className="court-lines">
              {/* We would add court markings here */}
            </div>
            
            {/* Player markers */}
            {players.map((player) => (
              <PlayerMarker
                key={player.id}
                id={player.id}
                number={player.number}
                team={player.team}
                initialX={player.x}
                initialY={player.y}
                onDragEnd={handlePlayerDragEnd}
              />
            ))}
            
            {/* Arrow drawing tool */}
            <ArrowTool
              onArrowCreated={handleArrowCreated}
              isActive={isArrowToolActive()}
              arrowType={getCurrentArrowType()}
            />
            
            {/* Arrows */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="0"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#FF4D4D" />
                </marker>
                <marker
                  id="arrowhead-start"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto-start-reverse"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#FF4D4D" />
                </marker>
              </defs>
              
              {arrows.map((arrow) => (
                <Arrow
                  key={arrow.id}
                  id={arrow.id}
                  startX={arrow.startX}
                  startY={arrow.startY}
                  endX={arrow.endX}
                  endY={arrow.endY}
                  type={arrow.type || 'arrow'}
                  onDelete={handleArrowDelete}
                  onUpdate={handleArrowUpdate}
                  selected={selectedArrow === arrow.id}
                  onSelect={setSelectedArrow}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
      
      {/* Save play dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Play</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="play-name">Play Name</Label>
            <Input
              id="play-name"
              value={playName}
              onChange={(e) => setPlayName(e.target.value)}
              placeholder="Enter a name for your play"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={savePlay}>Save Play</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Instructions dialog */}
      <InstructionsDialog 
        open={instructionsOpen}
        onOpenChange={setInstructionsOpen}
      />
    </div>
  );
};

export default StrategyBoard;
