// Render neon skeleton using MediaPipe outputs
export const drawSkeleton = (ctx, jointPositions) => {
  if (!jointPositions || Object.keys(jointPositions).length === 0) return;
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  ctx.strokeStyle = '#8B5CF6'; // primary
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = '#8B5CF6';
  ctx.shadowBlur = 10;

  // Connection logic mapped to MediaPipe naming conventions if available from backend
  const connections = [
    ['LEFT_SHOULDER', 'LEFT_ELBOW'], ['LEFT_ELBOW', 'LEFT_WRIST'],
    ['RIGHT_SHOULDER', 'RIGHT_ELBOW'], ['RIGHT_ELBOW', 'RIGHT_WRIST'],
    ['LEFT_SHOULDER', 'RIGHT_SHOULDER'], ['LEFT_HIP', 'RIGHT_HIP'],
    ['LEFT_SHOULDER', 'LEFT_HIP'], ['RIGHT_SHOULDER', 'RIGHT_HIP'],
    ['LEFT_HIP', 'LEFT_KNEE'], ['LEFT_KNEE', 'LEFT_ANKLE'],
    ['RIGHT_HIP', 'RIGHT_KNEE'], ['RIGHT_KNEE', 'RIGHT_ANKLE']
  ];
  
  ctx.beginPath();
  connections.forEach(([j1, j2]) => {
     if(jointPositions[j1] && jointPositions[j2]) {
         ctx.moveTo(jointPositions[j1].x * ctx.canvas.width, jointPositions[j1].y * ctx.canvas.height);
         ctx.lineTo(jointPositions[j2].x * ctx.canvas.width, jointPositions[j2].y * ctx.canvas.height);
     }
  });
  ctx.stroke();

  // Draw points with neon pink glow
  Object.values(jointPositions).forEach((pos) => {
    if (pos.x && pos.y) {
       const x = pos.x * ctx.canvas.width;
       const y = pos.y * ctx.canvas.height;
       
       ctx.beginPath();
       ctx.arc(x, y, 5, 0, 2 * Math.PI);
       ctx.fillStyle = '#EC4899'; // accent
       ctx.shadowColor = '#EC4899';
       ctx.fill();
    }
  });

};
