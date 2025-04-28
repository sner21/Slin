import React, { createContext, useContext, useState } from 'react';
import Dialog from './Dialog';

interface DialogConfig {
  id: string;
  title: string;
  content: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
}

interface DialogContextType {
  openDialog: (config: DialogConfig) => void;
  closeDialog: (id: string) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogs, setDialogs] = useState<DialogConfig[]>([]);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const openDialog = (config: DialogConfig) => {
    setDialogs(prev => [...prev, config]);
    setActiveDialog(config.id);
  };

  const closeDialog = (id: string) => {
    setDialogs(prev => prev.filter(dialog => dialog.id !== id));
    if (activeDialog === id) {
      const remaining = dialogs.filter(dialog => dialog.id !== id);
      setActiveDialog(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const handleDialogClick = (id: string) => {
    setActiveDialog(id);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialogs.map((dialog, index) => (

          <Dialog
            {...dialog}
            id={dialog.id}
            handleDialogClick={handleDialogClick}
            zIndex={1000 + (activeDialog === dialog.id ? dialogs.length : index)}
            onClose={() => closeDialog(dialog.id)}
          >
            {dialog.content}
          </Dialog>
       
      ))}
    </DialogContext.Provider>
  );
};

export default DialogProvider; 