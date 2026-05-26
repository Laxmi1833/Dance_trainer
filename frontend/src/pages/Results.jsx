import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useSessionStore from '../store/sessionStore';
import ScoreGauge from '../components/ScoreGauge';

export default function Results() {
  const { scoreHistory, selectedStyle, resetSession } = useSessionStore();
  
  const avgScore = scoreHistory.length > 0 
    ? scoreHistory.reduce((a, b) => a + b, 0) / scoreHistory.length 
    : 0; 

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 pt-12 flex flex-col items-center relative h-full justify-center mt-12">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-6xl md:text-7xl text-primary mb-12 drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] tracking-wide uppercase"
      >
        SESSION COMPLETE
      </motion.h1>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full flex flex-col md:flex-row gap-12 items-center justify-center bg-background-end/90 backdrop-blur-xl border-2 border-primary/30 p-10 rounded-3xl shadow-[0_0_30px_rgba(139,92,246,0.2)] relative z-10"
      >
         <div className="flex flex-col items-center flex-1">
            <h3 className="font-bold text-gray-400 tracking-widest mb-8 text-sm">FINAL MASTERY</h3>
            <ScoreGauge score={avgScore} />
         </div>

         <div className="flex-1 w-full flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-black/50 border border-secondary/30 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <h4 className="text-secondary font-bold text-lg mb-2 glow-blue-text font-sans">Performance Summary</h4>
               <p className="text-gray-300 text-sm leading-relaxed">
                 Excellent rhythm during the {selectedStyle || 'Dance'} routine! Your accuracy peaked during the transition sequences. You maintained strong form for 80% of the active frames. Keep practicing to fluidly connect your moves.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
              <Link to="/training" className="flex-1" onClick={() => useSessionStore.getState().setCurrentStep(1)}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-gradient-to-r from-accent to-pink-600 rounded-full font-bold tracking-widest text-sm glow-pink shadow-xl hover:shadow-accent/50 text-white"
                >
                  RETRY MIX
                </motion.button>
              </Link>
              <Link to="/styles" className="flex-1" onClick={resetSession}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 border-2 border-secondary rounded-full font-bold tracking-widest text-sm glow-blue text-secondary hover:bg-secondary/10 transition-all shadow-xl"
                >
                  BACK TO STYLES
                </motion.button>
              </Link>
            </div>
         </div>
      </motion.div>
    </div>
  );
}
