import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DanceCard from '../components/DanceCard';
import useSessionStore from '../store/sessionStore';
import { getStyles } from '../services/api';
import { motion } from 'framer-motion';

export default function StylesPage() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const setSelectedStyle = useSessionStore((state) => state.setSelectedStyle);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch from backend
    getStyles()
      .then(res => {
        setStyles(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch styles, using fallback", err);
        // Fallback for UI if backend isn't returning yet
        setStyles([
          { id: 'waacking', name: 'Waacking', description: 'Arm-intensive movements and poses.', steps: 5 },
          { id: 'locking', name: 'Locking', description: 'Funky rhythmic freezes and grooves.', steps: 18, comingSoon: true },
          { id: 'hiphop', name: 'Hip Hop', description: 'Bounce, rock, skate, and groove.', steps: 32, comingSoon: true }
        ]);
        setLoading(false);
      });
  }, []);

  const handleSelect = (style) => {
    setSelectedStyle(style.name);
    navigate('/training');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 pt-12 flex flex-col items-center">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-5xl md:text-6xl text-primary mb-12 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]"
      >
        EXPLORE STYLES
      </motion.h2>
      
      {loading ? (
        <div className="text-secondary text-xl animate-pulse glow-blue-text font-bold">Loading styles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
          {styles.map((style, i) => (
            <motion.div 
              key={style.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <DanceCard 
                title={style.name}
                description={style.description}
                steps={style.steps}
                comingSoon={style.comingSoon}
                onClick={() => handleSelect(style)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
