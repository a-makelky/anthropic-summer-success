import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  itemName: string;
  itemType: string;
}

const shakeAnimation = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  itemName,
  itemType
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
          <AlertDialogContent className="sm:max-w-[425px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <AlertDialogHeader>
                <motion.div
                  className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
                  animate="shake"
                  variants={shakeAnimation}
                >
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </motion.div>
                
                <AlertDialogTitle className="text-center text-xl">
                  Delete {itemType}?
                </AlertDialogTitle>
                
                <AlertDialogDescription className="text-center">
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Are you sure you want to delete this {itemType.toLowerCase()}?
                    <br />
                    <span className="font-semibold text-foreground mt-2 block">
                      "{itemName}"
                    </span>
                    <br />
                    <span className="text-red-600 font-medium">
                      This action cannot be undone.
                    </span>
                  </motion.div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <AlertDialogFooter className="mt-6">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="mr-2"
                >
                  Cancel
                </Button>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="destructive"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Deleting...
                      </motion.div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </span>
                    )}
                  </Button>
                </motion.div>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmDialog;