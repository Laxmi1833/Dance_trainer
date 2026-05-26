import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackPanel({ message, advance }) {
  return (
    <div className="w-full mt-6 bg-background-end/60 p-6 rounded-2xl border border-secondary/30 relative shadow-lg">
      <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">AI Coach Feedback</h4>
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl font-medium text-secondary drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"
        >
          {message || "Waiting for perfect form..."}
        </motion.p>
      </AnimatePresence>

      <AnimatePresence>
        {advance && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute -top-4 -right-4 bg-accent text-white px-4 py-2 text-sm font-bold rounded-full glow-pink z-10"
          >
            Move Next Step!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
