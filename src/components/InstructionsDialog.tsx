
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InstructionsDialog: React.FC<InstructionsDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to Use the Strategy Board</DialogTitle>
          <DialogDescription>
            Create basketball plays and strategies with our interactive tool
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Drawing Tools</h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground">
              <li>Select the <strong>Move</strong> tool to reposition elements on the court</li>
              <li>Use <strong>Arrow</strong> tools to draw movement paths and plays</li>
              <li>The <strong>Dotted Arrow</strong> represents passes</li>
              <li>Use <strong>Two-way Arrow</strong> for give-and-go or screen actions</li>
              <li>The <strong>Curved Arrows</strong> can be drawn in two directions for showing arc movement paths</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Players</h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground">
              <li><strong>Blue circles</strong> represent home team players</li>
              <li><strong>Red circles</strong> represent away team players</li>
              <li>Click a player tool then click on the court to place it</li>
              <li>Drag players to reposition them</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Diagram Controls</h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground">
              <li>Use <strong>Undo/Redo</strong> to step through changes</li>
              <li>Click <strong>Save</strong> to name and store your play</li>
              <li><strong>Clear</strong> removes all elements from the board</li>
              <li>Hide or show the toolbar with the arrow button</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Tips</h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-muted-foreground">
              <li>Click on arrows to select and modify them</li>
              <li>For best results on tablets, use in landscape orientation</li>
              <li>Save your work frequently</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
