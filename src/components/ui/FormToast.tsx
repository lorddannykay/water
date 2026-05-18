import { AnimatePresence, motion } from 'motion/react';

export function FormToast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="form-toast"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
