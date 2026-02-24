export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  bullets: string[];
  results: string;
  lessons: string;
  github?: string;
  demo?: string;
  category: string;
};

export const projectCategories = [
  "All",
  "Robotics & Embedded",
  "AI & Machine Learning",
  "Signal Processing & MATLAB",
  "Software & Apps",
];

export const projects: Project[] = [
  // ── ROBOTICS & EMBEDDED ──────────────────────────────────────────
  {
    slug: "pi-ai-robot-guidance",
    title: "Pi-AI: Robot Guidance (Raspberry Pi 5 + MCU)",
    summary: "Real-time direction classification from camera input, robust motor commands over UART, and offline-first architecture.",
    tags: ["Raspberry Pi 5", "Embedded Linux", "UART", "Python", "TFLite", "Robotics"],
    bullets: [
      "Live camera capture → pre-processing → model inference → UART commands to Tiva.",
      "Safety logic: confidence threshold + short command bursts to avoid erratic motion.",
      "Designed for offline operation and reproducible deployment.",
    ],
    results: "Stable control loop with confidence gating; clear separation between perception and actuation.",
    lessons: "In robotics, reliability beats raw accuracy — timeouts, thresholds, and deterministic command timing matter.",
    github: "https://github.com/ketul099/robot_navigation_multiprocess_v2",
    category: "Robotics & Embedded",
  },
  {
    slug: "robot-neural-network-movement",
    title: "Robot Movement by Neural Network V1",
    summary: "Neural network trained to control robot movement decisions from sensor input — direction classification for autonomous navigation.",
    tags: ["Python", "Neural Network", "Robotics", "Autonomous", "TFLite"],
    bullets: [
      "Trained lightweight NN model on movement direction labels.",
      "Integrated inference loop with real-time motor command output.",
      "V1 baseline for iterative improvement toward multiprocess architecture.",
    ],
    results: "Working autonomous navigation using NN-based decision making with smooth directional control.",
    lessons: "Simple models trained on good data outperform complex models trained on bad data — data quality is everything.",
    github: "https://github.com/ketul099/Robot_Movement_by_Neural_Network_V1",
    category: "Robotics & Embedded",
  },
  {
    slug: "robot-navigation-multiprocess",
    title: "Robot Navigation Multiprocess V2",
    summary: "Multiprocess architecture separating camera capture, inference, and motor control into parallel processes for faster, more reliable navigation.",
    tags: ["Python", "Multiprocessing", "Robotics", "Raspberry Pi", "Embedded Linux"],
    bullets: [
      "Decoupled camera, inference, and actuation into separate OS processes.",
      "Used queues and pipes for safe inter-process communication.",
      "Eliminated frame lag that plagued the V1 single-process design.",
    ],
    results: "Significantly reduced control latency and improved navigation reliability vs V1.",
    lessons: "Multiprocessing on embedded Linux requires careful resource management — shared memory beats queues for high-frequency data.",
    github: "https://github.com/ketul099/robot_navigation_multiprocess_v2",
    category: "Robotics & Embedded",
  },
  {
    slug: "robotic-arm-gripper",
    title: "Robotic Arm Gripper Control",
    summary: "Servo-controlled robotic arm gripper with programmatic motion control for pick-and-place tasks.",
    tags: ["Robotics", "Servo", "Embedded", "C++", "Actuation"],
    bullets: [
      "Designed gripper control logic for precise open/close timing.",
      "Implemented position feedback and motion sequencing.",
      "Built for repeatable pick-and-place operation.",
    ],
    results: "Reliable gripper actuation with consistent positioning and smooth motion profiles.",
    lessons: "Mechanical backlash and servo deadband must be accounted for in software — pure position commands are never enough.",
    github: "https://github.com/ketul099/Robotic_arm_gripper",
    category: "Robotics & Embedded",
  },
  {
    slug: "dc-motor-pid",
    title: "DC Motor Control with PID",
    summary: "PID controller implementation in C++ for precise DC motor speed and position control.",
    tags: ["C++", "PID", "Motor Control", "Embedded", "Control Systems"],
    bullets: [
      "Implemented discrete PID with tunable Kp, Ki, Kd gains.",
      "Added anti-windup for integral term to prevent saturation.",
      "Tested step response and tuned for minimal overshoot.",
    ],
    results: "Stable motor speed control with fast settling time and minimal steady-state error.",
    lessons: "Derivative term needs filtering in real hardware — raw derivative amplifies encoder noise significantly.",
    github: "https://github.com/ketul099/DC_motor_control_PID",
    category: "Robotics & Embedded",
  },

  // ── AI & MACHINE LEARNING ─────────────────────────────────────────
  {
    slug: "shapes-recognizer-nn",
    title: "Shape Recognition Neural Network",
    summary: "Neural network trained to classify geometric shapes from image input for embedded-friendly inference.",
    tags: ["Python", "Neural Network", "Computer Vision", "TFLite", "Classification"],
    bullets: [
      "Trained CNN on synthetic dataset of shapes with augmentations.",
      "Exported model to TFLite for embedded deployment.",
      "Achieved high accuracy on held-out test set.",
    ],
    results: "Lightweight model suitable for real-time inference on Raspberry Pi with low CPU overhead.",
    lessons: "Synthetic datasets work well for shape tasks — augmentation (noise, blur, rotation) is key to real-world robustness.",
    github: "https://github.com/ketul099/shapes_recognizes_NN",
    category: "AI & Machine Learning",
  },
  {
    slug: "hailo-pipeline-notes",
    title: "Hailo Pipeline: ONNX → HAR → HEF",
    summary: "Practical notes and workflow for compiling models to Hailo-8L — parsing, quantization, YAML configs, and debugging.",
    tags: ["Hailo-8L", "ONNX", "Quantization", "YAML", "Edge AI"],
    bullets: [
      "Documented parsing/optimization steps and common failure patterns.",
      "Created reusable YAML config templates with correct node naming.",
      "Built repeatable compilation workflow for fast experimentation.",
    ],
    results: "Faster iteration when porting models using a consistent checklist and known-good YAML skeletons.",
    lessons: "Most failures are shape/node mismatches — treat the pipeline like a compiler: small changes, test often.",
    github: "https://github.com/ketul099",
    category: "AI & Machine Learning",
  },
  {
    slug: "private-ai-road",
    title: "Private AI Road — Offline AI Pipeline",
    summary: "Fully offline AI pipeline for road/path detection without cloud dependency, designed for edge deployment.",
    tags: ["Python", "Edge AI", "Computer Vision", "Offline", "Embedded Linux"],
    bullets: [
      "Built end-to-end inference pipeline running entirely on local hardware.",
      "Optimized for low-power, offline-first embedded deployment.",
      "No cloud dependency — all processing happens on device.",
    ],
    results: "Working offline road detection pipeline suitable for autonomous navigation in network-denied environments.",
    lessons: "Offline AI forces you to be ruthless about model size and compute — every millisecond counts at the edge.",
    github: "https://github.com/ketul099/Private-AI-road",
    category: "AI & Machine Learning",
  },

  // ── SIGNAL PROCESSING & MATLAB ────────────────────────────────────
  {
    slug: "matlab-dtmf",
    title: "MATLAB DTMF Tone Processing",
    summary: "DTMF signal generation and detection in MATLAB — frequency analysis of telephone signaling tones.",
    tags: ["MATLAB", "Signal Processing", "FFT", "DTMF", "Audio"],
    bullets: [
      "Generated DTMF tones by summing two sinusoids per digit.",
      "Detected digits using FFT frequency analysis.",
      "Visualized spectrograms and frequency content for each tone.",
    ],
    results: "Accurate digit detection from generated and recorded DTMF signals using frequency domain analysis.",
    lessons: "DTMF is a great intro to real-world signal processing — noise tolerance requires careful frequency bin selection.",
    github: "https://github.com/ketul099/Matlab_DTMF_tone_processes-",
    category: "Signal Processing & MATLAB",
  },
  {
    slug: "matlab-image-pixel-shifting",
    title: "MATLAB Image Pixel Shifting",
    summary: "Image processing project implementing pixel shifting and spatial transforms in MATLAB.",
    tags: ["MATLAB", "Image Processing", "Signal Processing", "Spatial Transforms"],
    bullets: [
      "Implemented pixel shifting operations in spatial domain.",
      "Analyzed effects of transforms on image structure.",
      "Visualized before/after results with MATLAB plotting tools.",
    ],
    results: "Clear demonstration of spatial domain image manipulation and its effects on image content.",
    lessons: "Even simple pixel operations reveal a lot about how digital images store information spatially.",
    github: "https://github.com/ketul099/Matlab_Image_pixel_shifting",
    category: "Signal Processing & MATLAB",
  },

  // ── SOFTWARE & APPS ───────────────────────────────────────────────
  {
    slug: "qt-qml-timer",
    title: "Qt/QML Timer & Navigation App",
    summary: "Cross-platform desktop/embedded UI application built with Qt and QML featuring timer functionality and multi-screen navigation.",
    tags: ["Qt", "QML", "C++", "UI", "Cross-platform"],
    bullets: [
      "Built multi-screen navigation flow using QML StackView.",
      "Implemented countdown timer with start/stop/reset controls.",
      "Designed clean UI suitable for both desktop and embedded touchscreens.",
    ],
    results: "Smooth, responsive UI application demonstrating Qt/QML proficiency for embedded HMI development.",
    lessons: "QML's declarative model is powerful for UI but business logic belongs in C++ — keep the boundary clean.",
    github: "https://github.com/ketul099/qt-qml-timer-navigation",
    category: "Software & Apps",
  },
];
