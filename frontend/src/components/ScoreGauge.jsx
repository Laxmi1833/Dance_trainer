import { motion } from 'framer-motion';

export default function ScoreGauge({ score }) {
  // Color logic: 0-40 red, 40-70 yellow, 70-100 green
  let color = '#ef4444'; // red
  
  if (score >= 70) {
    color = '#22c55e'; // green
  } else if (score >= 40) {
    color = '#eab308'; // yellow
  }

  // Circle defaults
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" className="transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-gray-800"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="drop-shadow-[0_0_10px_currentColor]"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-heading font-bold drop-shadow-md" style={{ color }}>{Math.round(score)}</span>
        <span className="text-xs text-gray-400 font-semibold tracking-wider">SCORE</span>
      </div>
    </div>
  );
}
