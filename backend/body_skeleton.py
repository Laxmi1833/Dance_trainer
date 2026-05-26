# body_skeleton.py

import cv2
import mediapipe as mp
import numpy as np


# MediaPipe Setup

mp_pose = mp.solutions.pose

# Create ONE global model (important for performance)
pose_model = mp_pose.Pose(
    model_complexity=1,
    smooth_landmarks=True,
    enable_segmentation=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)


# Feature Extraction

def extract_features(result):
    if not result or not result.pose_landmarks:
        return None, False

    lm = result.pose_landmarks.landmark
    features = []

    bones = [
        (11, 13), (13, 15),
        (12, 14), (14, 16),
        (23, 25), (25, 27),
        (24, 26), (26, 28)
    ]

    spine_bone = (11, 23)

    try:
        # Visibility check
        leg_vis = [lm[idx].visibility for idx in [23,24,25,26,27,28]]
        lower_body_visible = sum(leg_vis) / len(leg_vis) > 0.4

        # Bone vectors
        for a, b in bones:
            dx = lm[b].x - lm[a].x
            dy = lm[b].y - lm[a].y
            length = np.sqrt(dx**2 + dy**2) + 1e-6
            features.extend([dx/length, dy/length])

        # Spine
        dx = lm[spine_bone[1]].x - lm[spine_bone[0]].x
        dy = lm[spine_bone[1]].y - lm[spine_bone[0]].y
        length = np.sqrt(dx**2 + dy**2) + 1e-6
        features.extend([dx/length, dy/length])

        return features, lower_body_visible

    except Exception as e:
        print("Feature extraction error:", e)
        return None, False


# Frame Analysis (USED BY API)

def analyze_frame(frame):
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = pose_model.process(rgb)

    features, visible = extract_features(result)

    if features is None:
        return None

    return features, visible



# DTW Distance

def dtw_distance(seq1, seq2):
    n, m = len(seq1), len(seq2)

    if n == 0 or m == 0:
        return float('inf'), 0

    arr1 = np.array(seq1)
    arr2 = np.array(seq2)

    dist_matrix = np.linalg.norm(
        arr1[:, None, :] - arr2[None, :, :],
        axis=2
    )

    dtw = np.full((n+1, m+1), np.inf)
    dtw[0, 0] = 0

    for i in range(1, n+1):
        for j in range(1, m+1):
            cost = dist_matrix[i-1, j-1]
            dtw[i, j] = cost + min(
                dtw[i-1, j],
                dtw[i, j-1],
                dtw[i-1, j-1]
            )

    # Backtrack
    i, j = n, m
    path_len = 0

    while i > 0 and j > 0:
        path_len += 1
        min_prev = min(dtw[i-1, j], dtw[i, j-1], dtw[i-1, j-1])

        if min_prev == dtw[i-1, j-1]:
            i -= 1
            j -= 1
        elif min_prev == dtw[i-1, j]:
            i -= 1
        else:
            j -= 1

    path_len += i + j

    return dtw[n, m], path_len



# Load Reference Video

def load_reference_video(path):
    cap = cv2.VideoCapture(path)
    sequence = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        result = analyze_frame(frame)

        if result:
            features, _ = result
            sequence.append(features)

    cap.release()

    print(f"{path} → frames loaded:", len(sequence))
    return sequence



# Similarity Score

def calculate_similarity_score(ref_sequence, user_sequence):

    if len(user_sequence) <= 10:
        return 0.0, "Sequence too short"

    usr_features = [f[0] for f in user_sequence]
    usr_visibility = [f[1] for f in user_sequence]

    usr_arr = np.array(usr_features)

    # Motion check
    motion_variance = float(np.var(usr_arr, axis=0).sum())

    # Visibility check
    visibility_ratio = float(sum(usr_visibility)) / len(usr_visibility)

    # DTW
    dist, path_len = dtw_distance(ref_sequence, usr_features)
    avg_cost = dist / path_len if path_len > 0 else float('inf')

    similarity = 100.0 * (1.0 - (avg_cost / 2.5))
    similarity = max(0.0, min(100.0, similarity))

    # Penalties
    if motion_variance < 0.2:
        return similarity * 0.05, "No movement detected"

    if visibility_ratio < 0.6:
        return similarity * 0.1, "Body not visible properly"

    return similarity, f"Great! Accuracy: {similarity:.1f}%"