import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Webcam from 'react-webcam';
import SkeletonOverlay from './SkeletonOverlay';

const WebcamFeed = forwardRef(({ joints }, ref) => {
  const webcamRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getScreenshot: () => {
      if (webcamRef.current) {
        return webcamRef.current.getScreenshot();
      }
      return null;
    }
  }));

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-2 border-primary/40 bg-black">
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={true}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <SkeletonOverlay joints={joints} />
    </div>
  );
});

export default WebcamFeed;
