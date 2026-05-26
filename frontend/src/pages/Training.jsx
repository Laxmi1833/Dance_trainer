import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamFeed from '../components/WebcamFeed';
import ScoreGauge from '../components/ScoreGauge';
import FeedbackPanel from '../components/FeedbackPanel';
import useSessionStore from '../store/sessionStore';
import { analyzeFrame, startRecording, stopRecording, compareDance, setStep as apiSetStep, resetSession } from '../services/api';
import { dataURLtoBlob } from '../utils/frameEncoder';

export default function Training() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const { selectedStyle, currentStep, setCurrentStep, scoreHistory, addScoreRecord } = useSessionStore();

  const [joints, setJoints] = useState({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("Get ready! Press U to start");
  const [advance, setAdvance] = useState(false);
  const [isCapturing, setIsCapturing] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const stepNames = {
    1: "Circle",
    2: "Twirl",
    3: "Step",
    4: "Combo",
    5: "Air Screw Wack"
  };

  // Auto-redirect if style not selected, else set step based on style
  useEffect(() => {
    if (!selectedStyle) {
      navigate('/styles');
    } else if (selectedStyle.toLowerCase().includes('waacking')) {
      setCurrentStep(5); // Step 5 is Air Screw Wack
      apiSetStep(5).catch(err => console.error(err));
    } else {
      apiSetStep(currentStep).catch(err => console.error(err));
    }
  }, [selectedStyle, navigate, setCurrentStep]);

  useEffect(() => {
    let interval;
    if (isCapturing) {
      interval = setInterval(async () => {
        if (webcamRef.current) {
          const screensrc = webcamRef.current.getScreenshot();
          if (screensrc) {
            try {
              const imageBlob = dataURLtoBlob(screensrc);
              const response = await analyzeFrame(imageBlob);
              const data = response.data;

              if (data.features) setJoints(data.features);
              setIsVisible(data.visible !== false);
            } catch (err) {
              console.error("Analysis failed: ", err.message);
            }
          }
        }
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isCapturing]);

  const handleStartRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setFeedback("Recording started...");
      try {
        await startRecording();
      } catch (e) {
        console.error("Start failed", e);
      }
    }
  };

  const handleStopRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setFeedback("Recording stopped. Press COMPARE to evaluate.");
      try {
        await stopRecording();
      } catch (e) {
        console.error("Stop failed", e);
      }
    }
  };

  const handleCompare = async () => {
    setFeedback("Evaluating...");
    try {
      const res = await compareDance();
      if (res.data.score !== undefined) {
        setScore(res.data.score);
        addScoreRecord(res.data.score);
      }
      if (res.data.feedback) setFeedback(res.data.feedback);
    } catch (e) {
      console.error("Compare failed", e);
      setFeedback("Evaluation failed.");
    }
  };

  const handleReset = async () => {
    try {
      await resetSession();
      setScore(0);
      setFeedback("Session reset. Ready!");
    } catch (e) {
      console.error("Reset failed", e);
    }
  };

  const handleToggleRecording = () => {
    if (!isRecording) handleStartRecording();
    else handleStopRecording();
  };

  // Keyboard controls: 'u' to start, 'y' to stop, 1-5 for step selection
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if ((e.key === 'u' || e.key === 'U') && !isRecording) {
        handleStartRecording();
      } else if ((e.key === 'y' || e.key === 'Y') && isRecording) {
        handleStopRecording();
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const stepNum = parseInt(e.key);
        setCurrentStep(stepNum);
        setFeedback(`Switched to Step ${stepNum} - ${stepNames[stepNum]}`);
        try {
          await apiSetStep(stepNum);
        } catch (err) {
          console.error("Failed to set step", err);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, currentStep, setCurrentStep]);

  const handleFinish = () => {
    setIsCapturing(false);
    navigate('/results');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 mt-4 relative">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="font-heading text-3xl md:text-5xl text-secondary mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] uppercase tracking-wide">
          {selectedStyle} - Step {currentStep} {stepNames[currentStep] && `: ${stepNames[currentStep]}`}
        </h2>
        <WebcamFeed ref={webcamRef} joints={joints} />

        <div className="flex flex-wrap gap-2 md:gap-3 mt-4 justify-center w-full">
          {Object.entries(stepNames).map(([key, name]) => {
            const stepNum = parseInt(key);
            return (
              <button
                key={stepNum}
                onClick={async () => {
                  setCurrentStep(stepNum);
                  setFeedback(`Switched to Step ${stepNum} - ${name}`);
                  try {
                    await apiSetStep(stepNum);
                  } catch (err) {
                    console.error("Failed to set step", err);
                  }
                }}
                className={`px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold rounded-full border border-primary/40 transition-all duration-300 font-sans tracking-widest ${currentStep === stepNum ? 'bg-primary/80 text-white shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'bg-black/60 text-gray-400 hover:border-primary/80 hover:text-white'}`}
              >
                [{stepNum}] {name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleToggleRecording}
            className={`px-6 py-3 font-bold rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all font-sans tracking-widest text-sm text-white ${isRecording ? 'bg-gradient-to-r from-red-600 to-red-800' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}
          >
            {isRecording ? "STOP RECORDING (Y)" : "START RECORDING (U)"}
          </button>

          <button
            onClick={handleCompare}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] hover:shadow-blue-500 transition-all font-sans tracking-widest text-sm"
          >
            COMPARE
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-bold rounded-full hover:shadow-gray-500 transition-all font-sans tracking-widest text-sm"
          >
            RESET
          </button>

          <button
            onClick={handleFinish}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)] hover:shadow-pink-500 transition-all font-sans tracking-widest text-sm"
          >
            FINISH
          </button>
        </div>
      </div>

      <div className="w-full md:w-96 flex flex-col items-center bg-background-start/80 border border-primary/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 blur-[50px] rounded-full" />

        <div className="relative z-10 w-full flex flex-col items-center h-full">
          <h3 className="font-sans font-bold text-gray-400 tracking-widest text-sm mb-6">REAL-TIME METRICS</h3>
          {!isVisible && (
            <div className="text-red-400 text-center font-bold mb-4 animate-pulse w-full bg-red-500/20 py-2 px-3 rounded-lg border border-red-500/50 text-sm shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              ⚠️ Body not fully visible! Please step back.
            </div>
          )}
          <ScoreGauge score={score} />
          <FeedbackPanel message={feedback} advance={advance} />

          <div className="w-full mt-auto p-4 border border-secondary/20 rounded-xl bg-black/40">
            <h4 className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">Live Flow</h4>
            <div className="flex items-end gap-1 h-20 w-full opacity-80">
              {scoreHistory.slice(-20).map((s, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-all duration-300 ${s > 70 ? 'bg-green-500 glow-blue' : s > 40 ? 'bg-yellow-500 glow-pink' : 'bg-red-500 glow-purple'}`} style={{ height: `${Math.max(10, s)}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
