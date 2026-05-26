# main.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2

from body_skeleton import (
    analyze_frame,
    calculate_similarity_score,
    load_reference_video
)

# =============================
# App Init
# =============================
app = FastAPI()

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================
# Global State (single user)
# =============================
user_sequence = []
recording = False
current_step = 1

print("Loading reference videos...")

step_references = {}

@app.on_event("startup")
def load_videos():
    global step_references

    print("Loading reference videos...")

    step_references = {
        1: load_reference_video("circle.mp4"),
        2: load_reference_video("twirl.mp4"),
        3: load_reference_video("step.mp4"),
        4: load_reference_video("circle_twirl_step.mp4"),
        5: load_reference_video("air_skrew_wack.mp4"),
    }

    print("✅ Backend Ready")

step_names = {
    1: "Circle",
    2: "Twirl",
    3: "Step",
    4: "Combo",
    5: "Air Screw"
}

print("✅ Backend Ready")


# =============================
# Health Check
# =============================
@app.get("/")
def home():
    return {"message": "Dance AI Backend Running 🚀"}


# =============================
# 1️⃣ Analyze Frame (REAL-TIME)
# =============================
@app.post("/analyze-frame")
async def analyze_frame_api(file: UploadFile = File(...)):
    global user_sequence, recording

    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result = analyze_frame(frame)

    if result is None:
        return {"features": None, "visible": False}

    features, visible = result

    # Store if recording
    if recording:
        user_sequence.append((features, visible))

    return {
        "features": features,
        "visible": visible
    }


# =============================
# 2️⃣ Start Recording
# =============================
@app.post("/start-recording")
def start_recording():
    global user_sequence, recording

    user_sequence = []
    recording = True

    return {
        "status": "recording_started"
    }


# =============================
# 3️⃣ Stop Recording
# =============================
@app.post("/stop-recording")
def stop_recording():
    global recording

    recording = False

    return {
        "status": "recording_stopped"
    }


# =============================
# 4️⃣ Compare Dance
# =============================
@app.post("/compare")
def compare():
    global user_sequence, current_step

    if len(user_sequence) < 10:
        return {
            "score": 0,
            "feedback": "Not enough data. Record longer."
        }

    ref = step_references.get(current_step)

    if not ref:
        return {
            "score": 0,
            "feedback": "Invalid step selected"
        }

    score, feedback = calculate_similarity_score(ref, user_sequence)

    return {
        "score": round(score, 2),
        "feedback": feedback,
        "step": step_names[current_step]
    }


# =============================
# 5️⃣ Change Step
# =============================
@app.post("/set-step/{step_id}")
def set_step(step_id: int):
    global current_step

    if step_id not in step_references:
        return {"status": "invalid_step"}

    current_step = step_id

    return {
        "status": "step_changed",
        "current_step": step_names[current_step]
    }


# =============================
# 6️⃣ Reset (optional)
# =============================
@app.post("/reset")
def reset():
    global user_sequence, recording

    user_sequence = []
    recording = False

    return {
        "status": "reset_done"
    }