import { motion, AnimatePresence } from 'framer-motion';

interface SwipeIndicatorsProps {
  opacity: number;
  selection: number;
  completed: boolean;
}

export default function SwipeIndicators({
  opacity,
  selection,
  completed,
}: SwipeIndicatorsProps) {
  const getText = () => {
    if (completed) return 'Completed';
    if (selection === -1) return 'NOPE';
    if (selection === 2) return 'LOVE';
    if (selection === 1) return 'LIKE';
    return '';
  };

  return (
    <AnimatePresence>
      {opacity > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            {getText()}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

