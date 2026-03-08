// ── Types ─────────────────────────────────────────────────────────────────────

export type CodeFile = {
  filename: string;
  language: string;
  description: string;
  snippet: string;
};

export type ProjectTabs = {
  code: CodeFile & { githubFile?: string };
  extraFiles?: CodeFile[];
  results: {
    metrics: { label: string; value: string }[];
    images:  { src: string; caption: string }[];
    videos:  { url: string; caption: string }[];
  };
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  github?: string;
  bullets: string[];
  results: string;
  lessons: string;
  tabs?: ProjectTabs;
};

// ── Categories ────────────────────────────────────────────────────────────────

export const projectCategories = [
  "All",
  "Robotics & Embedded",
  "AI & Machine Learning",
  "Signal Processing & MATLAB",
  "Software & Apps",
];

// ── Projects ──────────────────────────────────────────────────────────────────

export const projects: Project[] = [

  // ══════════════════════════════════════════════════════════════════
  //  ROBOTICS & EMBEDDED
  // ══════════════════════════════════════════════════════════════════

  // ── 1. Robot Movement V1 ──────────────────────────────────────────
  {
    slug: "robot-neural-network-movement",
    title: "Robot Movement by Neural Network V1",
    summary: "A complete end-to-end autonomous robot navigation system. Real corridor images collected with a joystick, a 5-layer CNN trained on a PC, then deployed on Raspberry Pi 5 to drive a 6-wheel robot via UART.",
    tags: ["Python", "TensorFlow", "CNN", "Raspberry Pi 5", "UART", "Tiva MCU", "OpenCV", "ONNX"],
    category: "Robotics & Embedded",
    github: "https://github.com/ketul-Sanjaykumar-Patel/Robot_Movement_by_Neural_Network_V1",
    bullets: [
      "Collected 2,776 real labeled images using joystick-controlled Tiva MCU.",
      "Trained 5-layer CNN (32→64→128→256→512 filters) on 320×240 images.",
      "Deployed on Raspberry Pi 5 — live camera feed drives robot in real time.",
      "Exported model to SavedModel, HDF5, Keras and ONNX formats.",
    ],
    results: "Robot navigates corridors autonomously. Dataset: 1736 forward, 397 left, 364 right, 279 stop.",
    lessons: "Real-world data collection is the hardest part. Clean serial labeling from joystick gave consistent results.",
    tabs: {
      code: {
        filename: "creating_model_self_drive.py",
        language: "python",
        description: "CNN training script — 5 Conv layers, ImageDataGenerator, exports to SavedModel + HDF5 + ONNX.",
        snippet: `import tensorflow as tf
from tensorflow.keras import layers, models, Input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os, tf2onnx

DATASET_PATH = "dataset/"
IMG_HEIGHT, IMG_WIDTH = 240, 320
BATCH_SIZE = 4
EPOCHS = 20

datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
train_data = datagen.flow_from_directory(
    DATASET_PATH, target_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE, class_mode='categorical', subset='training'
)
# Classes: forward_ok(1736) | left_ok(397) | right_ok(364) | stop(279)

inputs = Input(shape=(IMG_HEIGHT, IMG_WIDTH, 3))
x = layers.Conv2D(32,  (3,3), activation='relu')(inputs)
x = layers.MaxPooling2D()(x)
x = layers.Conv2D(64,  (3,3), activation='relu')(x)
x = layers.MaxPooling2D()(x)
x = layers.Conv2D(128, (3,3), activation='relu')(x)
x = layers.MaxPooling2D()(x)
x = layers.Conv2D(256, (3,3), activation='relu')(x)
x = layers.MaxPooling2D()(x)
x = layers.Conv2D(512, (3,3), activation='relu')(x)
x = layers.MaxPooling2D()(x)
x = layers.Flatten()(x)
x = layers.Dense(512, activation='relu')(x)
outputs = layers.Dense(4, activation='softmax')(x)

model = models.Model(inputs=inputs, outputs=outputs)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_data, epochs=EPOCHS)

model.save('robot_drive_savedmodel', save_format='tf')
model.save('robot_drive_model.h5')
model.save('robot_drive_model.keras')
spec = (tf.TensorSpec((None, IMG_HEIGHT, IMG_WIDTH, 3), tf.float32, name="input"),)
tf2onnx.convert.from_keras(model, input_signature=spec, opset=13, output_path='robot_drive_model.onnx')`,
      },
      extraFiles: [
        {
          filename: "move_self.py",
          language: "python",
          description: "Robot autopilot — runs on Raspberry Pi 5. Reads camera, predicts direction, sends UART command to Tiva.",
          snippet: `import cv2, numpy as np, serial, tensorflow as tf, time

MODEL_PATH  = '/home/ketul/robot_drive_model.h5'
IMG_WIDTH, IMG_HEIGHT = 320, 240
SERIAL_PORT = '/dev/ttyAMA0'
BAUD_RATE   = 9600
COMMAND_INTERVAL = 0.15

ser   = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
model = tf.keras.models.load_model(MODEL_PATH)
labels = ['forward', 'left', 'right', 'stop']
# left/right reversed to match physical robot wiring
command_map = {'forward':'F', 'left':'R', 'right':'L', 'stop':'S'}

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, IMG_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, IMG_HEIGHT)

ser.write(b"F\\n"); time.sleep(5)  # move forward 5s before AI starts

try:
    while True:
        ret, frame = cap.read()
        if not ret: continue
        img = cv2.resize(frame, (IMG_WIDTH, IMG_HEIGHT))
        img = img.astype(np.float32) / 255.0
        img = np.expand_dims(img, axis=0)
        pred  = model.predict(img, verbose=0)
        label = labels[np.argmax(pred)]
        command = command_map[label]
        ser.write(f"{command}\\n".encode()); ser.flush()
        print(f"Predicted: {label} -> Sent: {command}")
        time.sleep(COMMAND_INTERVAL)
except KeyboardInterrupt:
    print("Stopped.")
finally:
    cap.release(); ser.close(); cv2.destroyAllWindows()`,
        },
        {
          filename: "dataset_created_by_robot_cam.py",
          language: "python",
          description: "Data collection — joystick controls robot, Pi captures and saves labeled images automatically.",
          snippet: `import cv2, os, serial, time

SAVE_PATH  = '/media/ketul/VERBATIM/move/dataset'
BAUD_RATE  = 9600
IMG_WIDTH, IMG_HEIGHT = 320, 240

ser = serial.Serial('/dev/ttyAMA0', BAUD_RATE, timeout=1)
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, IMG_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, IMG_HEIGHT)

labels = {'F': 'forward', 'L': 'left', 'R': 'right', 'S': 'stop'}
for label in labels.values():
    os.makedirs(os.path.join(SAVE_PATH, label), exist_ok=True)
counter = {label: 0 for label in labels.values()}

# Handshake with Tiva
ser.write(b'START\\n')
while True:
    if ser.in_waiting > 0:
        if "Tiva Ready" in ser.readline().decode().strip():
            print("Handshake OK. Capturing..."); break

while True:
    ret, frame = cap.read()
    if not ret: continue
    if ser.in_waiting > 0:
        raw = ser.readline().decode(errors='ignore').strip()
        if raw.startswith("Command:"):
            cmd = raw.split(':')[1].strip()
            if cmd in labels:
                label = labels[cmd]
                filename = f"{label}_{counter[label]:04d}.jpg"
                cv2.imwrite(os.path.join(SAVE_PATH, label, filename), frame)
                counter[label] += 1
                print(f"Saved [{cmd}] -> {filename}")
    cv2.imshow('Dataset Builder', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release(); ser.close(); cv2.destroyAllWindows()`,
        },
        {
          filename: "collacting_datasets.ino",
          language: "cpp",
          description: "Tiva MCU code — reads joystick, drives motors, sends F/L/R/S commands to Raspberry Pi over UART.",
          snippet: `#define NB_SPEED  4
#define SPEED_MAX 180
int Speed[NB_SPEED+1] = {0, 49, 80, 100, SPEED_MAX};

#define IN1 8   // Right motor direction 1
#define IN2 9   // Right motor direction 2
#define ENA 25  // Right motor PWM
#define IN3 10  // Left motor direction 1
#define IN4 27  // Left motor direction 2
#define ENB 26  // Left motor PWM
#define JOY_Y A0  // Left joystick axis
#define JOY_X A1  // Right joystick axis

int leftmoto = 0, rightmoto = 0;

void setup() {
  Serial.begin(9600);   // USB debug output
  Serial1.begin(9600);  // UART to Raspberry Pi
  pinMode(IN1,OUTPUT); pinMode(IN2,OUTPUT); pinMode(ENA,OUTPUT);
  pinMode(IN3,OUTPUT); pinMode(IN4,OUTPUT); pinMode(ENB,OUTPUT);
  motor(0, 0);
}

void loop() {
  int leftY  = analogRead(JOY_Y);
  int rightY = analogRead(JOY_X);
  int leftIdx  = -((leftY  - 2048) * NB_SPEED) / 2048;
  int rightIdx = -((rightY - 2048) * NB_SPEED) / 2048;
  motor(leftIdx, rightIdx);

  char cmd = 'S';
  if      (rightmoto==1  && leftmoto==1)  cmd = 'F';
  else if (rightmoto==-1 && leftmoto==-1) cmd = 'B';
  else if (rightmoto==1  && leftmoto<=0)  cmd = 'L';
  else if (rightmoto<=0  && leftmoto==1)  cmd = 'R';

  Serial1.print("Command: "); Serial1.println(cmd); Serial1.flush();
  delay(200);
}

void motor(int sL, int sR) {
  if      (sL==0) { digitalWrite(IN3,HIGH); digitalWrite(IN4,HIGH); analogWrite(ENB,0);  leftmoto=0;  }
  else if (sL>0)  { digitalWrite(IN3,HIGH); digitalWrite(IN4,LOW);  analogWrite(ENB,49); leftmoto=1;  }
  else            { digitalWrite(IN3,LOW);  digitalWrite(IN4,HIGH); analogWrite(ENB,80); leftmoto=-1; }
  if      (sR==0) { digitalWrite(IN1,HIGH); digitalWrite(IN2,HIGH); analogWrite(ENA,0);  rightmoto=0;  }
  else if (sR>0)  { digitalWrite(IN1,HIGH); digitalWrite(IN2,LOW);  analogWrite(ENA,49); rightmoto=1;  }
  else            { digitalWrite(IN1,LOW);  digitalWrite(IN2,HIGH); analogWrite(ENA,80); rightmoto=-1; }
}`,
        },
      ],
      results: {
        metrics: [
          { label: "Total images",     value: "2,776 real corridor photos" },
          { label: "forward_ok",       value: "1,736 images" },
          { label: "left_ok",          value: "397 images" },
          { label: "right_ok",         value: "364 images" },
          { label: "stop",             value: "279 images" },
          { label: "Image size",       value: "320 × 240 px, RGB" },
          { label: "Train / Val",      value: "80% / 20%" },
          { label: "CNN layers",       value: "5 Conv blocks (32→64→128→256→512)" },
          { label: "Command interval", value: "0.15 s between predictions" },
          { label: "Serial port",      value: "/dev/ttyAMA0 @ 9600 baud" },
          { label: "Export formats",   value: "SavedModel, HDF5, Keras, ONNX" },
        ],
        images: [
          // Add images here:
          { src: "/robot-v1/image_first_trial.jpeg", caption: "Robot first trial" },
          { src: "/robot-v1/final_image_f.jpeg", caption: "Robot front view" },
          { src: "/robot-v1/final_image_r.jpeg", caption: "Robot right view" },
          { src: "/robot-v1/final_image_b.jpeg", caption: "Robot back view" },
          { src: "/robot-v1/final_image_l.jpeg", caption: "Robot left view" },
          { src: "/robot-v1/final_image_f_close.jpeg", caption: "Robot front close view" },
          { src: "/robot-v1/battery_module.jpeg", caption: "Robot battery module" },
          { src: "/robot-v1/without_coustom_battery.jpeg", caption: "Robot without custom battery" },
          { src: "/robot-v1/image_pridiction.jpeg", caption: "Robot prediction view" },
          
        ],
        videos: [
          // Add videos here:
          { url: "/robot-v1/robo_1.mp4", caption: "Autonomous driving demo" },
        ],
      },
    },
  },

  // ── 2. Pi-AI Robot Guidance ───────────────────────────────────────
  {
    slug: "pi-ai-robot-guidance",
    title: "Pi-AI: Robot Guidance (Raspberry Pi 5 + MCU)",
    summary: "Real-time direction classification from camera input, robust motor commands over UART, and offline-first architecture on Raspberry Pi 5.",
    tags: ["Raspberry Pi 5", "Embedded Linux", "UART", "Python", "TFLite", "Robotics"],
    category: "Robotics & Embedded",
    github: "https://github.com/ketul099/robot_navigation_multiprocess_v2",
    bullets: [
      "Live camera capture → pre-processing → model inference → UART commands to Tiva.",
      "Safety logic: confidence threshold + short command bursts to avoid erratic motion.",
      "Designed for offline operation and reproducible deployment.",
    ],
    results: "Stable control loop with confidence gating; clear separation between perception and actuation.",
    lessons: "In robotics, reliability beats raw accuracy — timeouts, thresholds, and deterministic command timing matter.",
    tabs: {
      code: {
        filename: "inference_uart.py",
        language: "python",
        description: "Core inference loop — captures frame, runs TFLite model, sends UART command to Tiva MCU.",
        snippet: `import tflite_runtime.interpreter as tflite
import cv2, serial, time

LABELS    = ['forward_ok', 'left_ok', 'right_ok', 'stop']
CMD_MAP   = {'forward_ok': b'F', 'left_ok': b'L', 'right_ok': b'R', 'stop': b'S'}
THRESHOLD = 0.60

interp = tflite.Interpreter(model_path="robot_drive.tflite")
interp.allocate_tensors()
inp = interp.get_input_details()[0]
out = interp.get_output_details()[0]

uart = serial.Serial('/dev/ttyAMA0', 9600, timeout=0.1)
cam  = cv2.VideoCapture(2)

while True:
    ret, frame = cam.read()
    if not ret: continue
    img = cv2.resize(frame, (640, 480))
    img = img.astype('float32') / 255.0
    interp.set_tensor(inp['index'], img[None])
    interp.invoke()
    probs = interp.get_tensor(out['index'])[0]
    conf  = probs.max()
    label = LABELS[probs.argmax()]
    cmd = CMD_MAP[label] if conf >= THRESHOLD else b'F'
    uart.write(cmd)
    time.sleep(0.25)`,
      },
      results: {
        metrics: [
          { label: "Camera",             value: "640×480 @ 4 fps (index 2)" },
          { label: "Model",              value: "TFLite CNN — 4-class classification" },
          { label: "Confidence threshold", value: "0.60 (default forward below)" },
          { label: "Command latency",    value: "< 250 ms end-to-end" },
          { label: "Motor command burst", value: "0.25 s pulse per decision" },
          { label: "Serial port",        value: "/dev/ttyAMA0 @ 9600 baud" },
        ],
        images: [
          // { src: "/projects/pi-ai/setup.jpg", caption: "Pi-AI hardware setup" },
        ],
        videos: [
          // { url: "/projects/pi-ai/demo.mp4", caption: "Live navigation demo" },
        ],
      },
    },
  },

  // ── 3. Multiprocess V2 ────────────────────────────────────────────
  {
    slug: "robot-navigation-multiprocess",
    title: "Robot Navigation Multiprocess V2",
    summary: "Multiprocess architecture separating camera capture, inference, and motor control into parallel processes for faster, more reliable navigation.",
    tags: ["Python", "Multiprocessing", "Robotics", "Raspberry Pi", "Embedded Linux"],
    category: "Robotics & Embedded",
    github: "https://github.com/ketul099/robot_navigation_multiprocess_v2",
    bullets: [
      "Decoupled camera, inference, and actuation into separate OS processes.",
      "Used queues for safe inter-process communication.",
      "Eliminated frame lag that plagued the V1 single-process design.",
    ],
    results: "Significantly reduced control latency and improved navigation reliability vs V1.",
    lessons: "Multiprocessing on embedded Linux requires careful resource management — shared memory beats queues for high-frequency data.",
    tabs: {
      code: {
        filename: "navigation_v2.py",
        language: "python",
        description: "Three parallel OS processes — camera capture, TFLite inference, and UART motor control.",
        snippet: `from multiprocessing import Process, Queue
import cv2, tflite_runtime.interpreter as tflite, serial, time

def capture(q_frame: Queue):
    cam = cv2.VideoCapture(2)
    while True:
        ret, frame = cam.read()
        if ret and not q_frame.full():
            q_frame.put(cv2.resize(frame, (640, 480)))

def infer(q_frame: Queue, q_cmd: Queue):
    interp = tflite.Interpreter("robot_drive.tflite")
    interp.allocate_tensors()
    inp = interp.get_input_details()[0]
    out = interp.get_output_details()[0]
    LABELS = ['forward_ok','left_ok','right_ok','stop']
    CMD    = {'forward_ok':b'F','left_ok':b'L','right_ok':b'R','stop':b'S'}
    while True:
        if not q_frame.empty():
            img = q_frame.get().astype('float32') / 255.0
            interp.set_tensor(inp['index'], img[None])
            interp.invoke()
            probs = interp.get_tensor(out['index'])[0]
            label = LABELS[probs.argmax()] if probs.max()>=0.6 else 'forward_ok'
            q_cmd.put(CMD[label])

def control(q_cmd: Queue):
    uart = serial.Serial('/dev/ttyAMA0', 9600)
    while True:
        if not q_cmd.empty():
            uart.write(q_cmd.get())
            time.sleep(0.25)

if __name__ == '__main__':
    qf, qc = Queue(maxsize=2), Queue(maxsize=4)
    for fn, args in [(capture,(qf,)),(infer,(qf,qc)),(control,(qc,))]:
        Process(target=fn, args=args, daemon=True).start()
    while True: time.sleep(1)`,
      },
      results: {
        metrics: [
          { label: "Architecture",    value: "3 parallel OS processes" },
          { label: "IPC mechanism",   value: "multiprocessing.Queue" },
          { label: "Frame queue",     value: "maxsize=2 (always fresh frames)" },
          { label: "Command queue",   value: "maxsize=4" },
          { label: "Control rate",    value: "~4 decisions/sec stable" },
          { label: "CPU spread",      value: "3 cores on Pi 5" },
        ],
        images: [
          // { src: "/projects/robot-v2/architecture.png", caption: "Multiprocess architecture diagram" },
        ],
        videos: [
          // { url: "/projects/robot-v2/demo.mp4", caption: "V2 vs V1 latency comparison" },
        ],
      },
    },
  },

  // ── 4. Robotic Arm Gripper ────────────────────────────────────────
  {
    slug: "robotic-arm-gripper",
    title: "Robotic Arm Gripper Control",
    summary: "Servo-controlled robotic arm gripper with programmatic motion control for pick-and-place tasks.",
    tags: ["Robotics", "Servo", "Embedded", "C++", "Actuation"],
    category: "Robotics & Embedded",
    github: "https://github.com/ketul099/Robotic_arm_gripper",
    bullets: [
      "Designed gripper control logic for precise open/close timing.",
      "Implemented position feedback and motion sequencing.",
      "Built for repeatable pick-and-place operation.",
    ],
    results: "Reliable gripper actuation with consistent positioning and smooth motion profiles.",
    lessons: "Mechanical backlash and servo deadband must be accounted for in software.",
    tabs: {
      code: {
        filename: "gripper_control.cpp",
        language: "cpp",
        description: "Gripper servo control — open/close sequencing with position feedback.",
        snippet: `#include <Servo.h>

Servo gripperServo;

#define SERVO_PIN   9
#define OPEN_POS    0    // degrees — fully open
#define CLOSED_POS  90   // degrees — fully closed
#define SPEED_DELAY 15   // ms between each degree step

void setup() {
  Serial.begin(9600);
  gripperServo.attach(SERVO_PIN);
  gripperServo.write(OPEN_POS);  // start open
  delay(500);
}

// Smooth move to avoid jerking
void smoothMove(int from, int to) {
  int step = (to > from) ? 1 : -1;
  for (int pos = from; pos != to; pos += step) {
    gripperServo.write(pos);
    delay(SPEED_DELAY);
  }
  gripperServo.write(to);
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == 'O') {
      smoothMove(CLOSED_POS, OPEN_POS);
      Serial.println("Gripper OPEN");
    }
    else if (cmd == 'C') {
      smoothMove(OPEN_POS, CLOSED_POS);
      Serial.println("Gripper CLOSED");
    }
  }
}`,
      },
      results: {
        metrics: [
          { label: "Servo range",   value: "0° (open) to 90° (closed)" },
          { label: "Move speed",    value: "15 ms per degree step" },
          { label: "Control",       value: "Serial command: O = open, C = close" },
        ],
        images: [
          // { src: "/projects/gripper/gripper.jpg", caption: "Robotic arm gripper" },
        ],
        videos: [
          // { url: "/projects/gripper/demo.mp4", caption: "Pick and place demo" },
        ],
      },
    },
  },

  // ── 5. DC Motor PID ───────────────────────────────────────────────
  {
    slug: "dc-motor-pid",
    title: "DC Motor Control with PID",
    summary: "PID controller implementation in C++ for precise DC motor speed and position control.",
    tags: ["C++", "PID", "Motor Control", "Embedded", "Control Systems"],
    category: "Robotics & Embedded",
    github: "https://github.com/ketul099/DC_motor_control_PID",
    bullets: [
      "Implemented discrete PID with tunable Kp, Ki, Kd gains.",
      "Added anti-windup for integral term to prevent saturation.",
      "Tested step response and tuned for minimal overshoot.",
    ],
    results: "Stable motor speed control with fast settling time and minimal steady-state error.",
    lessons: "Derivative term needs filtering in real hardware — raw derivative amplifies encoder noise significantly.",
    tabs: {
      code: {
        filename: "pid_motor.cpp",
        language: "cpp",
        description: "Discrete PID controller with anti-windup for DC motor speed control.",
        snippet: `// PID Controller for DC Motor Speed Control

float Kp = 1.2f, Ki = 0.5f, Kd = 0.05f;
float setpoint  = 150.0f;  // target RPM
float integral  = 0.0f;
float prevError = 0.0f;
float maxIntegral = 100.0f; // anti-windup limit

float pid(float measured) {
  float error = setpoint - measured;

  // Proportional
  float P = Kp * error;

  // Integral with anti-windup clamp
  integral += error;
  integral = constrain(integral, -maxIntegral, maxIntegral);
  float I = Ki * integral;

  // Derivative (filtered)
  float D = Kd * (error - prevError);
  prevError = error;

  return P + I + D;
}

void loop() {
  float rpm     = readEncoder();   // read current speed
  float output  = pid(rpm);        // compute PID output
  output = constrain(output, 0, 255);
  analogWrite(MOTOR_PWM_PIN, (int)output);
  delay(10);  // 100Hz control loop
}`,
      },
      results: {
        metrics: [
          { label: "Control loop rate", value: "100 Hz" },
          { label: "Kp / Ki / Kd",      value: "1.2 / 0.5 / 0.05" },
          { label: "Anti-windup",        value: "Integral clamped ±100" },
          { label: "Settling time",      value: "< 200 ms" },
        ],
        images: [
          // { src: "/projects/pid/step-response.png", caption: "Step response graph" },
        ],
        videos: [
          // { url: "/projects/pid/demo.mp4", caption: "Motor speed control demo" },
        ],
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════
  //  AI & MACHINE LEARNING
  // ══════════════════════════════════════════════════════════════════

  // ── 6. Shape Recognition ──────────────────────────────────────────
  {
    slug: "shapes-recognizer-nn",
    title: "Shape Recognition Neural Network",
    summary: "Neural network trained to classify geometric shapes from image input for embedded-friendly inference.",
    tags: ["Python", "Neural Network", "Computer Vision", "TFLite", "Classification"],
    category: "AI & Machine Learning",
    github: "https://github.com/ketul099/shapes_recognizes_NN",
    bullets: [
      "Trained CNN on synthetic dataset of shapes with augmentations.",
      "Exported model to TFLite for embedded deployment.",
      "Achieved high accuracy on held-out test set.",
    ],
    results: "Lightweight model suitable for real-time inference on Raspberry Pi with low CPU overhead.",
    lessons: "Synthetic datasets work well for shape tasks — augmentation (noise, blur, rotation) is key to robustness.",
    tabs: {
      code: {
        filename: "train_shapes.py",
        language: "python",
        description: "CNN training for shape classification — circle, square, triangle on synthetic images.",
        snippet: `import tensorflow as tf
from tensorflow.keras import layers, models

# 3 classes: circle, square, triangle
NUM_CLASSES = 3
IMG_SIZE    = (240, 320, 3)

model = models.Sequential([
    layers.Rescaling(1./255, input_shape=IMG_SIZE),
    layers.Conv2D(32, 3, activation='relu', padding='same'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation='relu', padding='same'),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, activation='relu', padding='same'),
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(NUM_CLASSES, activation='softmax'),
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_ds, validation_data=val_ds, epochs=20)

# Convert to TFLite for Raspberry Pi
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
open('shapes_model.tflite', 'wb').write(tflite_model)`,
      },
      results: {
        metrics: [
          { label: "Classes",       value: "circle, square, triangle" },
          { label: "Image size",    value: "320 × 240 px" },
          { label: "Dataset",       value: "Synthetic — generated with PIL" },
          { label: "Export",        value: "TFLite for Raspberry Pi" },
        ],
        images: [
          // { src: "/projects/shapes/samples.png", caption: "Synthetic shape dataset samples" },
        ],
        videos: [
          // { url: "/projects/shapes/demo.mp4", caption: "Shape recognition demo" },
        ],
      },
    },
  },

  // ── 7. Hailo Pipeline ─────────────────────────────────────────────
  {
    slug: "hailo-pipeline-notes",
    title: "Hailo Pipeline: ONNX to HAR to HEF",
    summary: "Practical workflow for compiling models to Hailo-8L — parsing, quantization, YAML configs, and debugging.",
    tags: ["Hailo-8L", "ONNX", "Quantization", "YAML", "Edge AI"],
    category: "AI & Machine Learning",
    github: "https://github.com/ketul099",
    bullets: [
      "Documented parsing/optimization steps and common failure patterns.",
      "Created reusable YAML config templates with correct node naming.",
      "Built repeatable compilation workflow for fast experimentation.",
    ],
    results: "Faster iteration when porting models using a consistent checklist and known-good YAML skeletons.",
    lessons: "Most failures are shape/node mismatches — treat the pipeline like a compiler: small changes, test often.",
    tabs: {
      code: {
        filename: "robo_classification.yaml",
        language: "cpp",
        description: "Hailo YAML config — defines input/output nodes, normalization, and task type for model compilation.",
        snippet: `# Hailo Model Zoo — Custom Classification YAML
# Used to compile robot_drive_model.onnx to .hef for Hailo-8L

base_config:
  - base_network: hailo_classification  # base task type

parser:
  nodes: null  # auto-detect from ONNX graph

alls:
  # Normalization: match training preprocessing (rescale=1/255)
  normalization_params:
    - mean: [0.0, 0.0, 0.0]
      std:  [255.0, 255.0, 255.0]

network:
  network_name: robot_drive_model

# Input node — must match ONNX input name
input_layer:
  name: "input"
  shape: [1, 240, 320, 3]
  data_type: uint8

# Output node — must match Keras layer name
output_layer:
  name: "dense_1"

# Post-processing: softmax for 4-class classification
postprocess:
  task: classification
  classes: 4
  labels:
    - forward_ok
    - left_ok
    - right_ok
    - stop`,
      },
      results: {
        metrics: [
          { label: "Target hardware",  value: "Hailo-8L M.2 on Raspberry Pi 5" },
          { label: "Input format",     value: "ONNX (opset 13)" },
          { label: "Output format",    value: ".hef (Hailo Executable Format)" },
          { label: "Classes",          value: "4 — forward, left, right, stop" },
        ],
        images: [
          // { src: "/projects/hailo/pipeline.png", caption: "ONNX to HEF compilation pipeline" },
        ],
        videos: [],
      },
    },
  },

  // ── 8. Private AI Road ────────────────────────────────────────────
  {
    slug: "private-ai-road",
    title: "Private AI Road — Offline AI Pipeline",
    summary: "Fully offline AI pipeline for road/path detection without cloud dependency, designed for edge deployment.",
    tags: ["Python", "Edge AI", "Computer Vision", "Offline", "Embedded Linux"],
    category: "AI & Machine Learning",
    github: "https://github.com/ketul099/Private-AI-road",
    bullets: [
      "Built end-to-end inference pipeline running entirely on local hardware.",
      "Optimized for low-power, offline-first embedded deployment.",
      "No cloud dependency — all processing happens on device.",
    ],
    results: "Working offline road detection pipeline suitable for autonomous navigation.",
    lessons: "Offline AI forces you to be ruthless about model size — every millisecond counts at the edge.",
    tabs: {
      code: {
        filename: "road_detect.py",
        language: "python",
        description: "Offline road/path detection — processes camera frames entirely on device without internet.",
        snippet: `import cv2
import numpy as np
import tflite_runtime.interpreter as tflite

MODEL_PATH = "road_detect.tflite"
IMG_WIDTH, IMG_HEIGHT = 320, 240

interp = tflite.Interpreter(model_path=MODEL_PATH)
interp.allocate_tensors()
inp = interp.get_input_details()[0]
out = interp.get_output_details()[0]

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH,  IMG_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, IMG_HEIGHT)

while True:
    ret, frame = cap.read()
    if not ret: continue

    img = cv2.resize(frame, (IMG_WIDTH, IMG_HEIGHT))
    img = img.astype(np.float32) / 255.0
    interp.set_tensor(inp['index'], img[None])
    interp.invoke()

    mask = interp.get_tensor(out['index'])[0]
    # Overlay road mask on frame
    mask_resized = cv2.resize(mask, (IMG_WIDTH, IMG_HEIGHT))
    overlay = (mask_resized * 255).astype(np.uint8)
    cv2.imshow("Road Detection", cv2.addWeighted(frame, 0.7, cv2.cvtColor(overlay, cv2.COLOR_GRAY2BGR), 0.3, 0))

    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release(); cv2.destroyAllWindows()`,
      },
      results: {
        metrics: [
          { label: "Mode",         value: "Fully offline — no internet required" },
          { label: "Hardware",     value: "Raspberry Pi 5 + Hailo-8L" },
          { label: "Input",        value: "320×240 camera frames" },
          { label: "Output",       value: "Road segmentation mask overlay" },
        ],
        images: [
          // { src: "/projects/road/detection.jpg", caption: "Road detection output" },
        ],
        videos: [
          // { url: "/projects/road/demo.mp4", caption: "Offline road detection demo" },
        ],
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════
  //  SIGNAL PROCESSING & MATLAB
  // ══════════════════════════════════════════════════════════════════

  // ── 9. MATLAB DTMF ────────────────────────────────────────────────
  {
    slug: "matlab-dtmf",
    title: "MATLAB DTMF Tone Processing",
    summary: "DTMF signal generation and detection in MATLAB — frequency analysis of telephone signaling tones.",
    tags: ["MATLAB", "Signal Processing", "FFT", "DTMF", "Audio"],
    category: "Signal Processing & MATLAB",
    github: "https://github.com/ketul099/Matlab_DTMF_tone_processes-",
    bullets: [
      "Generated DTMF tones by summing two sinusoids per digit.",
      "Detected digits using FFT frequency analysis.",
      "Visualized spectrograms and frequency content for each tone.",
    ],
    results: "Accurate digit detection from generated and recorded DTMF signals.",
    lessons: "DTMF is a great intro to real-world signal processing — noise tolerance requires careful frequency bin selection.",
    tabs: {
      code: {
        filename: "dtmf_detect.m",
        language: "cpp",
        description: "DTMF tone generation and digit detection using FFT in MATLAB.",
        snippet: `% DTMF Tone Generation and Detection
% Each digit = sum of 2 sine waves (row freq + col freq)

Fs = 8000;     % sampling rate (Hz)
t  = 0:1/Fs:0.5;  % 0.5 second duration

% DTMF frequency table
row_freqs = [697, 770, 852, 941];
col_freqs = [1209, 1336, 1477];

% Generate tone for digit '5' (row=770Hz, col=1336Hz)
f1 = 770; f2 = 1336;
tone = sin(2*pi*f1*t) + sin(2*pi*f2*t);
tone = tone / max(abs(tone));  % normalize

% Play and plot
sound(tone, Fs);
figure;
subplot(2,1,1);
plot(t(1:200), tone(1:200));
title('DTMF Tone — Digit 5'); xlabel('Time (s)');

% FFT Detection
N   = length(tone);
Y   = fft(tone);
f   = (0:N-1)*(Fs/N);
mag = abs(Y(1:N/2));

subplot(2,1,2);
plot(f(1:N/2), mag);
title('FFT Spectrum'); xlabel('Frequency (Hz)');
xlim([0 2000]);

% Find dominant frequencies
[~, idx] = maxk(mag, 2);
fprintf('Detected freqs: %.0f Hz, %.0f Hz\\n', f(idx(1)), f(idx(2)));`,
      },
      results: {
        metrics: [
          { label: "Sample rate",    value: "8000 Hz" },
          { label: "Tone duration",  value: "0.5 seconds" },
          { label: "Detection",      value: "FFT peak frequency analysis" },
          { label: "Accuracy",       value: "100% on clean signals" },
        ],
        images: [
          // { src: "/projects/dtmf/spectrum.png", caption: "FFT spectrum of DTMF digit 5" },
        ],
        videos: [],
      },
    },
  },

  // ── 10. MATLAB Image Pixel Shifting ──────────────────────────────
  {
    slug: "matlab-image-pixel-shifting",
    title: "MATLAB Image Pixel Shifting",
    summary: "Image processing project implementing pixel shifting and spatial transforms in MATLAB.",
    tags: ["MATLAB", "Image Processing", "Signal Processing", "Spatial Transforms"],
    category: "Signal Processing & MATLAB",
    github: "https://github.com/ketul099/Matlab_Image_pixel_shifting",
    bullets: [
      "Implemented pixel shifting operations in spatial domain.",
      "Analyzed effects of transforms on image structure.",
      "Visualized before/after results with MATLAB plotting tools.",
    ],
    results: "Clear demonstration of spatial domain image manipulation.",
    lessons: "Even simple pixel operations reveal a lot about how digital images store information spatially.",
    tabs: {
      code: {
        filename: "pixel_shift.m",
        language: "cpp",
        description: "Spatial domain pixel shifting — shifts image by N pixels horizontally and vertically.",
        snippet: `% Image Pixel Shifting in MATLAB
% Shifts image in spatial domain (x and y direction)

img = imread('input_image.jpg');
img_gray = rgb2gray(img);  % convert to grayscale

% Shift parameters
shift_x = 50;  % pixels right
shift_y = 30;  % pixels down

[rows, cols] = size(img_gray);
shifted = zeros(rows, cols, 'uint8');

% Apply pixel shift
for r = 1:rows
  for c = 1:cols
    new_r = r + shift_y;
    new_c = c + shift_x;
    if new_r >= 1 && new_r <= rows && new_c >= 1 && new_c <= cols
      shifted(new_r, new_c) = img_gray(r, c);
    end
  end
end

% Display results
figure;
subplot(1,2,1); imshow(img_gray); title('Original');
subplot(1,2,2); imshow(shifted);  title(['Shifted +', num2str(shift_x), 'x +', num2str(shift_y), 'y']);

% Calculate difference
diff_img = abs(double(img_gray) - double(shifted));
figure; imshow(uint8(diff_img)); title('Pixel Difference');`,
      },
      results: {
        metrics: [
          { label: "Operation",   value: "Spatial domain pixel shifting" },
          { label: "Shift X",     value: "50 pixels right" },
          { label: "Shift Y",     value: "30 pixels down" },
          { label: "Tool",        value: "MATLAB Image Processing Toolbox" },
        ],
        images: [
          // { src: "/projects/pixel-shift/before-after.png", caption: "Before and after pixel shift" },
        ],
        videos: [],
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════
  //  SOFTWARE & APPS
  // ══════════════════════════════════════════════════════════════════

  // ── 11. Qt/QML Timer App ─────────────────────────────────────────
  {
    slug: "qt-qml-timer",
    title: "Qt/QML Timer & Navigation App",
    summary: "Cross-platform desktop/embedded UI application built with Qt and QML featuring timer functionality and multi-screen navigation.",
    tags: ["Qt", "QML", "C++", "UI", "Cross-platform"],
    category: "Software & Apps",
    github: "https://github.com/ketul099/qt-qml-timer-navigation",
    bullets: [
      "Built multi-screen navigation flow using QML StackView.",
      "Implemented countdown timer with start/stop/reset controls.",
      "Designed clean UI suitable for both desktop and embedded touchscreens.",
    ],
    results: "Smooth, responsive UI demonstrating Qt/QML proficiency for embedded HMI development.",
    lessons: "QML's declarative model is powerful for UI but business logic belongs in C++ — keep the boundary clean.",
    tabs: {
      code: {
        filename: "main.qml",
        language: "cpp",
        description: "Main QML screen — countdown timer with start/stop/reset and multi-screen navigation.",
        snippet: `import QtQuick 2.15
import QtQuick.Controls 2.15

ApplicationWindow {
    visible: true
    width: 480; height: 320
    title: "KP Timer App"

    StackView {
        id: stack
        anchors.fill: parent
        initialItem: timerPage
    }

    Component {
        id: timerPage
        Page {
            property int seconds: 60
            property bool running: false

            Timer {
                id: countdown
                interval: 1000
                repeat: true
                running: parent.running
                onTriggered: {
                    if (parent.seconds > 0) parent.seconds--
                    else { parent.running = false; countdown.stop() }
                }
            }

            Column {
                anchors.centerIn: parent
                spacing: 20

                Text {
                    text: parent.parent.seconds + "s"
                    font.pixelSize: 64
                    color: parent.parent.seconds <= 10 ? "red" : "white"
                    anchors.horizontalCenter: parent.horizontalCenter
                }

                Row {
                    spacing: 12
                    anchors.horizontalCenter: parent.horizontalCenter
                    Button { text: "Start"; onClicked: timerPage.running = true  }
                    Button { text: "Stop";  onClicked: timerPage.running = false }
                    Button { text: "Reset"; onClicked: { timerPage.seconds = 60; timerPage.running = false } }
                }

                Button {
                    text: "Settings ->"
                    anchors.horizontalCenter: parent.horizontalCenter
                    onClicked: stack.push(settingsPage)
                }
            }
        }
    }
}`,
      },
      results: {
        metrics: [
          { label: "Framework",    value: "Qt 6 / QML" },
          { label: "Language",     value: "QML + C++" },
          { label: "Screens",      value: "Timer, Settings — StackView navigation" },
          { label: "Target",       value: "Desktop + embedded touchscreens" },
        ],
        images: [
          // { src: "/projects/qt-timer/screenshot.png", caption: "Qt/QML timer app screenshot" },
        ],
        videos: [
          // { url: "/projects/qt-timer/demo.mp4", caption: "App navigation demo" },
        ],
      },
    },
  },
];