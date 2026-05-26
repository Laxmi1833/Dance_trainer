import { motion } from 'framer-motion';

export default function DanceCard({ title, description, steps, onClick, comingSoon }) {
  return (
    <motion.div 
      whileHover={!comingSoon ? { scale: 1.05 } : {}}
      whileTap={!comingSoon ? { scale: 0.95 } : {}}
      onClick={!comingSoon ? onClick : undefined}
      className={`p-6 rounded-xl border-2 flex flex-col h-full
                 ${comingSoon 
                    ? 'border-gray-800 bg-black/40 cursor-not-allowed opacity-75 grayscale' 
                    : 'border-primary/50 bg-background-end cursor-pointer transform transition-all glow-purple hover:border-accent hover:glow-pink'} 
                 relative overflow-hidden group shadow-lg`}
    >
      {!comingSoon && <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
      
      <div className="relative z-10 flex flex-col h-full flex-1">
        <h3 className={`font-heading text-3xl mb-2 transition-colors drop-shadow-md ${comingSoon ? 'text-gray-500' : 'text-primary group-hover:text-accent'}`}>
          {title}
        </h3>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1">{description}</p>
        
        <div className="mt-auto">
          {comingSoon ? (
            <div className="inline-block px-3 py-1 bg-gray-900/80 text-gray-400 text-xs font-bold rounded border border-gray-700 tracking-widest uppercase">
              Coming Soon
            </div>
          ) : (
            <div className="text-xs font-bold text-secondary tracking-widest uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              {steps} Steps
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
