import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-center p-8 mt-10 max-w-7xl mx-auto gap-12 relative">

      {/* Background Floaters */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

      {/* Left side: Graphic */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full flex justify-center perspective-1000 relative"
      >
        <div className="w-64 h-96 md:w-80 md:h-[500px] border border-primary/30 rounded-full bg-gradient-to-tr from-primary/10 to-transparent glow-purple flex items-center justify-center overflow-hidden">
          {/* Placeholder for dancer graphic */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60 mix-blend-screen mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-end to-transparent"></div>
        </div>
      </motion.div>

      {/* Right side: Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-heading mb-4 tracking-wider leading-tight text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, yoyo: Infinity }}
        >
          Dance With <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Vibe AI</span>
        </motion.h1>

        <p className="text-xl md:text-2xl text-secondary mb-10 font-medium glow-blue-text max-w-md drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
          Train your dance moves with real-time AI feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link to="/training">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-full font-bold text-lg tracking-wider glow-pink shadow-xl hover:shadow-primary/50 transition-all border border-accent/50"
            >
              Start Training
            </motion.button>
          </Link>
          <Link to="/styles">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-secondary rounded-full font-bold text-lg tracking-wider glow-blue text-secondary hover:bg-secondary/10 transition-all shadow-xl"
            >
              Explore Styles
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
