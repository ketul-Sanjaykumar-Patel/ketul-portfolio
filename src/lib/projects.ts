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

export type ProjectStory = {
  overviewMetrics?: { label: string; value: string }[];
  diagram?: { src: string; caption: string };
  tables?: {
    title: string;
    columns: string[];
    rows: string[][];
    note?: string;
  }[];
  challenges?: {
    title: string;
    text: string;
  }[];
  outcomes?: string[];
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
  story?: ProjectStory;
  tabs?: ProjectTabs;
};

// ── Categories ────────────────────────────────────────────────────────────────

export const projectCategories = [
  "All",
  "Robotics & Embedded",
  "Motor Control & Power Electronics",
  "AI & Machine Learning",
  "Signal Processing & MATLAB",
  "Software & Apps",
];

// ── Projects ──────────────────────────────────────────────────────────────────

export const projects: Project[] = [

  {
    slug: "ehealth-iot-platform",
    title: "e-Health IoT Platform for Assisted Monitoring",
    summary:
      "Built a two-node e-health monitoring platform with Arduino R4 WiFi boards, a Raspberry Pi 5 gateway, and a live Flask dashboard to combine room sensing, body vitals, fall detection, GPS, and alert handling in one deployable prototype.",
    tags: ["Arduino R4 WiFi", "Raspberry Pi 5", "Flask", "SQLite", "I2C", "UART", "WiFi", "HTTP", "MPU6050", "GPS"],
    category: "Robotics & Embedded",
    bullets: [
      "Designed one fixed node and one mobile node, both built on Arduino R4 WiFi, then centralized their data on a Raspberry Pi 5 gateway.",
      "Integrated 9 sensor and module inputs across I2C, UART, analog, and WiFi transport, then normalized readings into JSON APIs and SQLite storage.",
      "Implemented fall detection, step counting, abnormal vital alerts, GPS tagging, and a browser dashboard that operators could understand without reading source code first.",
      "Documented the wiring, addresses, API routes, and data flow clearly enough for review, debugging, and a live jury demonstration path.",
    ],
    results:
      "As of May 2026, the platform is collecting fixed-node room and vital data plus mobile-node body, motion, and location data into one dashboard with historical storage and visible alert states. The next milestone is the live jury demonstration scheduled for June 2026.",
    lessons:
      "The hard part was not reading any single sensor. It was making shared buses, fall thresholds, wireless delivery, persistence, and operator-facing alerts behave predictably together. Splitting the system into a fixed node, a mobile node, and a Raspberry Pi gateway made the whole platform easier to debug and explain.",
    story: {
      overviewMetrics: [
        { label: "Sensors", value: "9 integrated inputs" },
        { label: "Nodes", value: "2 Arduino R4 WiFi platforms" },
        { label: "Protocols", value: "I2C, UART, WiFi, HTTP" },
        { label: "Interface", value: "Live Flask dashboard" },
      ],
      diagram: {
        src: "/ehealth/ehealth-architecture.svg",
        caption:
          "End-to-end flow from the fixed and mobile Arduino nodes into the Raspberry Pi 5 gateway, SQLite storage, and live browser dashboard.",
      },
      tables: [
        {
          title: "Sensor map",
          columns: ["Node", "Sensor or module", "Link", "Address or port"],
          rows: [
            ["Fixed", "BMP280", "I2C", "0x76 or 0x77"],
            ["Fixed", "MAX30105 pulse sensor", "I2C", "0x57"],
            ["Fixed", "LCD display", "I2C", "0x27 or 0x3F"],
            ["Fixed", "MPU6050 presence sensing", "I2C", "0x68"],
            ["Fixed", "Alcohol sensor", "Analog", "A0"],
            ["Mobile", "MPU6050 fall and steps", "I2C", "0x68"],
            ["Mobile", "MLX90614 IR temperature", "I2C", "0x5A"],
            ["Mobile", "LCD display", "I2C", "0x27 or 0x3F"],
            ["Mobile", "GPS module", "UART", "Serial1"],
          ],
          note:
            "Both Arduino nodes use one shared I2C bus for their local sensors. GPS is the exception and rides on Serial1 rather than the I2C bus.",
        },
      ],
      challenges: [
        {
          title: "Fall detection without constant false alarms",
          text:
            "Used a two-stage accelerometer rule: detect a high-g spike first, then confirm stillness inside a time window before raising the alert. That kept the logic explainable and tunable on-device.",
        },
        {
          title: "Shared I2C bus planning",
          text:
            "Mapped device addresses up front so multiple sensors could coexist cleanly on each Arduino R4 WiFi board without bus conflicts or messy trial-and-error wiring.",
        },
        {
          title: "Wireless pipeline across three layers",
          text:
            "Each Arduino assembled JSON locally and posted to the Raspberry Pi 5 over WiFi, letting the Pi own persistence, latest-state APIs, and dashboard rendering.",
        },
        {
          title: "Alerts that stay actionable",
          text:
            "Abnormal pulse, temperature, alcohol level, and fall events were surfaced both in logs and the browser dashboard, with a physical cancel button on the mobile node for fall alerts.",
        },
      ],
      outcomes: [
        "Delivered a two-node prototype that combines room monitoring and wearable or mobile health sensing in one system.",
        "Centralized live readings and historical records on a Raspberry Pi 5 using Flask endpoints and SQLite storage.",
        "Prepared the platform for a live jury demonstration scheduled for June 2026.",
        "Packaged the work into code, architecture, and documentation that reads clearly to recruiters as well as technical reviewers.",
      ],
    },
    tabs: {
      code: {
        filename: "rpi_server.py",
        language: "python",
        description:
          "Raspberry Pi 5 gateway server that receives JSON from both Arduino nodes, stores it in SQLite, and serves a live Flask dashboard.",
        snippet: `from flask import Flask, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)
DB_PATH = "ehealth.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS fixed_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            temperature REAL,
            pressure REAL,
            pulse INTEGER,
            alcohol INTEGER,
            presence INTEGER,
            alert TEXT
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS mobile_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            body_temp REAL,
            amb_temp REAL,
            steps INTEGER,
            fall INTEGER,
            lat REAL,
            lng REAL,
            gps_valid INTEGER
        )
    """)
    conn.commit()
    conn.close()

@app.route("/api/fixed", methods=["POST"])
def receive_fixed():
    data = request.get_json()
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO fixed_data
        (timestamp, temperature, pressure, pulse, alcohol, presence, alert)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        ts,
        data.get("temperature", 0),
        data.get("pressure", 0),
        data.get("pulse", 0),
        data.get("alcohol", 0),
        1 if data.get("presence") else 0,
        data.get("alert", "")
    ))
    conn.commit()
    conn.close()
    return jsonify({"status": "ok", "timestamp": ts}), 200`,
      },
      extraFiles: [
        {
          filename: "arduino1_fixed.ino",
          language: "cpp",
          description:
            "Fixed node firmware that reads room and vital sensors, raises simple threshold alerts, and posts JSON to the Raspberry Pi gateway every 2 seconds.",
          snippet: `#include <Wire.h>
#include <WiFiS3.h>
#include <Adafruit_BMP280.h>
#include <MAX30105.h>
#include <LiquidCrystal_I2C.h>

const char* SSID = "YOUR_WIFI_SSID";
const char* PASSWORD = "YOUR_WIFI_PASSWORD";
const char* RPI_IP = "192.168.1.100";
const int RPI_PORT = 5000;
const char* ENDPOINT = "/api/fixed";

Adafruit_BMP280 bmp;
MAX30105 particleSensor;
LiquidCrystal_I2C lcd(0x27, 16, 2);
const int ALCOHOL_PIN = A0;

void loop() {
  float temp = bmp.readTemperature();
  float pressure = bmp.readPressure() / 100.0F;
  int pulse = readPulse();
  int alcohol = analogRead(ALCOHOL_PIN);
  bool presence = detectPresence();

  String alert = "";
  if (pulse > 120 || pulse < 40) alert = "PULSE_ALERT";
  if (temp > 38.0) alert = "TEMP_ALERT";
  if (alcohol > 600) alert = "ALCOHOL_ALERT";

  String json = "{";
  json += "\\"node\\":\\"fixed\\",";
  json += "\\"temperature\\":" + String(temp, 2) + ",";
  json += "\\"pressure\\":" + String(pressure, 2) + ",";
  json += "\\"pulse\\":" + String(pulse) + ",";
  json += "\\"alcohol\\":" + String(alcohol) + ",";
  json += "\\"presence\\":" + String(presence ? "true" : "false") + ",";
  json += "\\"alert\\":\\"" + alert + "\\"";
  json += "}";

  sendToRPi(json);
}`,
        },
        {
          filename: "arduino2_mobile.ino",
          language: "cpp",
          description:
            "Mobile node firmware that tracks body temperature, steps, GPS position, and a cancelable fall alert before posting its state to the gateway.",
          snippet: `#include <Wire.h>
#include <WiFiS3.h>
#include <MPU6050.h>
#include <Adafruit_MLX90614.h>
#include <LiquidCrystal_I2C.h>
#include <TinyGPS++.h>

MPU6050 mpu;
Adafruit_MLX90614 mlx;
TinyGPSPlus gps;
bool fallDetected = false;
bool alertActive = false;
unsigned long fallTime = 0;
const int FALL_THRESHOLD = 2.5 * 16384;
const unsigned long FALL_CONFIRM_MS = 2000;

void loop() {
  while (Serial1.available()) gps.encode(Serial1.read());

  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  checkFall(ax, ay, az);
  countStep(az);

  float bodyTemp = mlx.readObjectTempC();
  float ambTemp = mlx.readAmbientTempC();
  float lat = gps.location.isValid() ? gps.location.lat() : 0.0;
  float lng = gps.location.isValid() ? gps.location.lng() : 0.0;

  String json = "{";
  json += "\\"node\\":\\"mobile\\",";
  json += "\\"body_temp\\":" + String(bodyTemp, 2) + ",";
  json += "\\"amb_temp\\":" + String(ambTemp, 2) + ",";
  json += "\\"steps\\":" + String(stepCount) + ",";
  json += "\\"fall\\":" + String(alertActive ? "true" : "false") + ",";
  json += "\\"lat\\":" + String(lat, 6) + ",";
  json += "\\"lng\\":" + String(lng, 6) + ",";
  json += "\\"gps_valid\\":" + String(gps.location.isValid() ? "true" : "false");
  json += "}";

  sendToRPi(json);
}`,
        },
        {
          filename: "fall_detection.ino",
          language: "cpp",
          description:
            "Standalone spike-window detector used to tune the fall logic before folding it into the mobile node firmware.",
          snippet: `#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;
const float SPIKE_THRESHOLD_G = 2.5;
const float STILL_THRESHOLD_G = 0.3;
const unsigned long WINDOW_MS = 500;
const float LSB_PER_G = 4096.0;

bool spikeDetected = false;
unsigned long spikeTime = 0;

void loop() {
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  float ax_g = ax / LSB_PER_G;
  float ay_g = ay / LSB_PER_G;
  float az_g = az / LSB_PER_G;
  float mag = sqrt(ax_g * ax_g + ay_g * ay_g + az_g * az_g);
  unsigned long now = millis();

  if (!spikeDetected && mag > SPIKE_THRESHOLD_G) {
    spikeDetected = true;
    spikeTime = now;
  } else if (spikeDetected) {
    unsigned long elapsed = now - spikeTime;
    if (elapsed <= WINDOW_MS && mag < STILL_THRESHOLD_G) {
      onFallDetected(now, elapsed);
      spikeDetected = false;
    } else if (elapsed > WINDOW_MS) {
      spikeDetected = false;
    }
  }
}`,
        },
      ],
      results: {
        metrics: [
          { label: "Integrated inputs", value: "9 sensor and module channels" },
          { label: "Upload interval", value: "2 seconds per node" },
          { label: "Gateway surface", value: "2 POST APIs, 2 GET APIs, Flask dashboard" },
          { label: "Persistence", value: "SQLite tables for fixed and mobile telemetry" },
        ],
        images: [
          {
            src: "/ehealth/ehealth-architecture.svg",
            caption: "System architecture from Arduino nodes through the Raspberry Pi gateway into storage and the browser dashboard.",
          },
          {
            src: "/ehealth/ehealth-dashboard.svg",
            caption: "Dashboard summary showing the fixed-node vitals, mobile-node telemetry, and fall alert visibility.",
          },
        ],
        videos: [],
      },
    },
  },

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
          { src: "/robot-v1/r1.jpeg", caption: "Robot without custom battery" },
          { src: "/robot-v1/image_pridiction.jpeg", caption: "Robot prediction view" },
          
        ],
        videos: [
          // Add videos here:
          { url: "/robot-v1/robo_1.mp4", caption: "Autonomous driving demo" },
          { url: "/robot-v1/robo_2.mp4", caption: "Robot navigation demo" },
        ],
      },
    },
  },

  // ── 2. Pi-AI Robot Guidance ───────────────────────────────────────
  {
    slug: "pi-ai-robot-guidance",
    title: "Robot Autopilot: Hailo-8L + EDGEVISION",
    summary: "A fused robot guidance stack for Raspberry Pi 5 that combines Hailo HEF inference, structural edge analysis, decision fusion, and UART motor control to a Tiva MCU.",
    tags: ["Raspberry Pi 5", "Hailo-8L", "OpenCV", "Picamera2", "UART", "Embedded Linux", "Edge AI", "Robotics"],
    category: "Robotics & Embedded",
    bullets: [
      "Built a full autopilot loop that fuses Hailo direction classification with EDGEVISION geometry cues before sending commands to the motor controller.",
      "Upgraded the model pipeline to MobileNetV2 at 224 x 224, exported ONNX plus calibration data, and compiled hardware-specific HEF binaries for Hailo-8L.",
      "Added centre-line correction, obstacle blocking, HUD overlays, Pi Camera or USB camera support, and headless mode for SSH testing.",
      "Kept the control path practical: UART to Tiva MCU, confidence gating, deterministic command intervals, and explicit stop fallbacks.",
    ],
    results: "This version moves beyond a pure classifier demo. The Pi 5 now runs a fused autonomy stack where Hailo handles fast direction prediction, EDGEVISION adds structural awareness, and the final decision layer can correct drift or stop the robot before unsafe commands are sent.",
    lessons: "The biggest improvement came from treating autonomy as signal fusion instead of trusting one model output. Edge geometry, confidence thresholds, and stop-first safety logic made the system much more believable in real deployment.",
    tabs: {
      code: {
        filename: "robot_autopilot.py",
        language: "python",
        description: "Fused autopilot loop - Hailo HEF inference, EDGEVISION edge analysis, decision fusion, HUD overlays, and UART motor control.",
        snippet: `CLASS_MAP = {
    0: 'forward_ok',
    1: 'left_ok',
    2: 'right_ok',
    3: 'stop',
}

UART_COMMANDS = {
    'forward_ok': 'F\\n',
    'left_ok':    'L\\n',
    'right_ok':   'R\\n',
    'stop':       'S\\n',
}

CONF_THRESHOLD = 0.70
COMMAND_INTERVAL = 0.15
OBSTACLE_THRESHOLD = 0.25

def fuse_decision(nn_label, nn_conf, steer_err, blocked):
    if blocked:
        return 'stop', "obstacle_detected"
    if nn_conf < CONF_THRESHOLD:
        return 'stop', f"low_conf({nn_conf:.2f})"
    if nn_label == 'stop':
        return 'stop', "nn_stop"
    if abs(steer_err) > 0.35 and nn_label == 'forward_ok':
        if steer_err < 0:
            return 'left_ok', f"centre_correct(err={steer_err:.2f})"
        return 'right_ok', f"centre_correct(err={steer_err:.2f})"
    return nn_label, "nn"

with InferVStreams(net_group, in_params, out_params) as pipeline:
    with net_group.activate():
        while True:
            frame = grab_frame(cam, cam_type)
            out, edges, n_objs, steer_err, blocked = process_edges(frame)

            inp = preprocess(frame)
            probs = pipeline.infer({in_name: inp})[out_name][0]

            if probs.max() > 10 or probs.min() < -1:
                probs = np.exp(probs - probs.max())
                probs = probs / probs.sum()

            nn_conf = float(np.max(probs))
            nn_idx = int(np.argmax(probs))
            nn_label = CLASS_MAP.get(nn_idx, 'stop')

            decision, reason = fuse_decision(nn_label, nn_conf, steer_err, blocked)

            now = time.time()
            if now - last_cmd_t >= COMMAND_INTERVAL:
                send_uart(ser, decision)
                last_cmd_t = now`,
      },
      extraFiles: [
        {
          filename: "train.py",
          language: "python",
          description: "Training pipeline - MobileNetV2 classifier, augmentation, calibration export, and ONNX opset 11 output for Hailo compilation.",
          snippet: `IMG_H = 224
IMG_W = 224
ONNX_OPSET = 11
N_CALIB = 64

def build_model(num_classes: int, finetune: bool = False):
    base = MobileNetV2(
        input_shape=(IMG_H, IMG_W, 3),
        include_top=False,
        weights='imagenet'
    )
    base.trainable = False

    inputs = Input(shape=(IMG_H, IMG_W, 3), name="input_image")
    x = base(inputs, training=False)
    x = layers.GlobalAveragePooling2D(name="gap")(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation='relu')(x)
    outputs = layers.Dense(num_classes, activation='softmax', name="predictions")(x)
    model = models.Model(inputs=inputs, outputs=outputs, name="robot_drive")
    return model

def export_calibration_images(dataset_path: str, output_dir: str, n: int = N_CALIB):
    calib_gen = ImageDataGenerator(rescale=1. / 255).flow_from_directory(
        dataset_path, target_size=(IMG_H, IMG_W), batch_size=n, class_mode=None, shuffle=True
    )
    calib_images = next(calib_gen)
    np.save(os.path.join(output_dir, 'calibration_images.npy'), calib_images)`,
        },
        {
          filename: "compile_hailo.py",
          language: "python",
          description: "Hailo Dataflow Compiler pipeline - parse ONNX, quantize with representative images, and compile HEF for hailo8l or hailo8 targets.",
          snippet: `INPUT_NODE = "input_image"
OUTPUT_NODE = "predictions"
IMG_H = 224
IMG_W = 224

def parse_onnx(runner: ClientRunner, onnx_path: str):
    runner.translate_onnx_model(
        onnx_path,
        net_name="robot_drive",
        start_node_names=[INPUT_NODE],
        end_node_names=[OUTPUT_NODE],
        net_input_shapes={INPUT_NODE: [None, IMG_H, IMG_W, 3]}
    )

def optimize_and_quantize(runner: ClientRunner, calib_path: str):
    calib_images = np.load(calib_path)
    runner.optimize(calib_images)

def compile_to_hef(runner: ClientRunner, output_dir: str, hw_arch: str) -> str:
    hef_path = os.path.join(output_dir, f'robot_drive_{hw_arch}.hef')
    hef_bytes = runner.compile()
    with open(hef_path, 'wb') as f:
        f.write(hef_bytes)
    return hef_path`,
        },
        {
          filename: "edgevision.py",
          language: "python",
          description: "Standalone EDGEVISION app - CLAHE, Canny, Hough lines, contour merging, HUD overlays, and Pi Camera or USB camera support.",
          snippet: `_clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(16, 16))

def process_frame(frame, state):
    H, W = frame.shape[:2]
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = _clahe.apply(gray)

    ks = state['blur_k'] * 2 + 1
    blurred = cv2.bilateralFilter(gray, ks, 55, 55)
    edges = cv2.Canny(blurred, state['canny_lo'], state['canny_hi'])

    if state['ground_boost']:
        gz = H // 2
        reg_b = cv2.GaussianBlur(blurred[gz:, :], (9, 9), 0)
        g_edges = cv2.Canny(reg_b, max(10, state['canny_lo'] // 3), max(30, state['canny_hi'] // 3))
        edges[gz:, :] = cv2.bitwise_or(edges[gz:, :], g_edges)

    hough_lines = _detect_lines(edges, W, H, state)
    contours = _merge_nearby_contours(
        [c for c in cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]
         if cv2.contourArea(c) > state['min_area']],
        merge_dist=40
    )
    return frame.copy(), edges, len(contours), len(hough_lines)`,
        },
        {
          filename: "edge_detection_camera.html",
          language: "html",
          description: "Browser UI prototype for live edge tuning - camera preview, threshold sliders, blend controls, object outlining, and HUD-style stats.",
          snippet: `<div class="side-panel">
  <button class="cam-btn" id="camBtn" onclick="toggleCamera()">START CAMERA</button>

  <div class="section-title">// DETECTION MODE</div>
  <div class="control-group">
    <div class="toggle-row">
      <button class="toggle-btn on" id="btnEdges" onclick="toggleMode('edges')">EDGES</button>
      <button class="toggle-btn on orange" id="btnObjects" onclick="toggleMode('objects')">OBJECTS</button>
      <button class="toggle-btn" id="btnOriginal" onclick="toggleMode('original')">BLEND</button>
    </div>
  </div>

  <div class="control-group">
    <div class="control-label">LOW THRESHOLD <span id="lowVal">40</span></div>
    <input type="range" id="lowThresh" min="5" max="150" value="40">
  </div>

  <div class="stats-grid">
    <div class="stat-box"><div class="stat-val" id="statFps">--</div><div class="stat-lbl">FPS</div></div>
    <div class="stat-box"><div class="stat-val" id="statEdge">--</div><div class="stat-lbl">EDGES %</div></div>
  </div>
</div>`,
        },
      ],
      results: {
        metrics: [
          { label: "Display camera",        value: "1280 x 720 live HUD on Raspberry Pi 5" },
          { label: "Inference input",       value: "224 x 224 RGB for MobileNetV2 / Hailo" },
          { label: "Direction classes",     value: "4 classes - forward, left, right, stop" },
          { label: "Target accelerator",    value: "Hailo-8L on Raspberry Pi 5" },
          { label: "Confidence gate",       value: "0.70 minimum confidence before movement" },
          { label: "Command interval",      value: "0.15 s between UART writes" },
          { label: "Obstacle fallback",     value: "Centre-zone contour threshold = 25%" },
          { label: "Loop target",           value: "~30 fps end-to-end, 200+ fps NPU-only target" },
          { label: "Motor link",            value: "Tiva MCU over /dev/ttyS0 or /dev/ttyAMA0" },
        ],
        images: [
          { src: "/robot-autopilot/autopilot-stack.svg", caption: "Autopilot stack: Hailo inference + EDGEVISION geometry + UART motor control" },
        ],
        videos: [
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
    github: "https://github.com/ketul-Sanjaykumar-Patel/robot_navigation_multiprocess_v2",
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
    github: "https://github.com/ketul-Sanjaykumar-Patel/Robotic_arm_gripper",
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
          { src: "/gripper/x7.jpg", caption: " full hardware" },
          { src: "/gripper/x1.jpg", caption: " mechanical structure" },
          { src: "/gripper/x3.jpg", caption: " mechanical structure " },
          { src: "/gripper/x4.jpg", caption: " flex sensors glow " },
          { src: "/gripper/x5.jpg", caption: " flex sensors glow " },
          { src: "/gripper/x6.jpg", caption: " flex sensors glow " },
          { src: "/gripper/x2.jpg", caption: " experiment" },
          { src: "/gripper/x8.jpg", caption: " trial photo" },

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
    title: "DC Motor Control with PID, PWM and Embedded C++",
    summary:
      "Implemented a discrete closed-loop DC motor speed controller in embedded C++ using PWM actuation, anti-windup protection, step-response testing, and tuning for low steady-state error.",
    tags: ["Embedded C++", "PID", "PWM", "Motor Control", "Closed-Loop Control", "Validation"],
    category: "Motor Control & Power Electronics",
    github: "https://github.com/ketul-Sanjaykumar-Patel/DC_motor_control_PID",
    bullets: [
      "Implemented a discrete PID loop with tunable Kp, Ki, and Kd gains for closed-loop DC motor speed regulation.",
      "Drove the motor through PWM output, then clamped the integral term to reduce saturation and recovery issues.",
      "Tested step response, tuned for low overshoot, and used measured behavior to refine control stability.",
    ],
    results:
      "Reached stable motor speed regulation with fast settling, low steady-state error, and a control loop that stayed predictable during step-response testing.",
    lessons:
      "Derivative action is useful, but raw derivative terms amplify measurement noise quickly on real hardware. Filtering and anti-windup matter as much as the core PID formula.",
    story: {
      overviewMetrics: [
        { label: "Control loop", value: "100 Hz update rate" },
        { label: "PWM range", value: "8-bit output 0 to 255" },
        { label: "Settling time", value: "< 200 ms target result" },
        { label: "Protection", value: "Integral clamp at ±100" },
      ],
      diagram: {
        src: "/motor-control/pid-loop.svg",
        caption: "Closed-loop speed-control path from setpoint through PID and PWM actuation to measured RPM feedback.",
      },
      tables: [
        {
          title: "Validation & testing",
          columns: ["Validation step", "Details"],
          rows: [
            ["Test objective", "Regulate DC motor speed with low overshoot and low steady-state error."],
            ["Test setup", "Embedded C++ loop driving PWM output while reading measured motor speed feedback."],
            ["Tools used", "Step-response testing, gain tuning, serial observation, and response comparison after each change."],
            ["Expected result", "Fast convergence to target speed without unstable oscillation or large saturation effects."],
            ["Observed result", "Stable speed control with quick settling and visibly improved response after gain tuning."],
            ["Issue found", "Derivative action amplified noisy feedback and made the loop more sensitive than expected."],
            ["Fix or improvement", "Kept anti-windup clamping and treated derivative behavior carefully to maintain practical stability."],
          ],
        },
      ],
      outcomes: [
        "Turned a textbook PID controller into a hardware-aware embedded control exercise with measurable behavior.",
        "Showed control-loop thinking that is relevant to embedded validation and motor-control roles, not just robotics demos.",
      ],
    },
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
          { label: "Kp / Ki / Kd", value: "1.2 / 0.5 / 0.05" },
          { label: "PWM output", value: "8-bit duty command 0 to 255" },
          { label: "Anti-windup", value: "Integral clamped ±100" },
          { label: "Settling time", value: "< 200 ms" },
        ],
        images: [
          { src: "/motor-control/pid-loop.svg", caption: "PID loop structure for closed-loop DC motor speed control" },
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
    github: "https://github.com/ketul-Sanjaykumar-Patel/shapes_recognizes_NN",
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
          { src: "/shapes/frist_result.png", caption: " frist_result " },
          { src: "/shapes/result.jpeg", caption: " result " },

          { src: "/shapes/training_error.jpeg", caption: "Synthetic shape recognition errors" },
          { src: "/shapes/training_error_1.jpeg", caption: "Synthetic shape recognition errors " },
          { src: "/shapes/training_error_2.jpeg", caption: "Synthetic shape recognition errors " },
          { src: "/shapes/training_error_3.jpeg", caption: "Synthetic shape recognition errors " },
          { src: "/shapes/training_error_4.jpeg", caption: "Synthetic shape recognition errors " },
          { src: "/shapes/training_error_5.jpeg", caption: "Synthetic shape recognition errors " },

          { src: "/shapes/circle_0.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_1.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_2.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_3.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_4.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_5.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_6.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_7.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/circle_8.png", caption: "Synthetic shape dataset circle " },
          { src: "/shapes/square_0.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_1.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_2.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_3.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_4.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_5.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_6.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_7.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/square_8.png", caption: "Synthetic shape dataset square " },
          { src: "/shapes/triangle_0.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_1.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_2.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_3.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_4.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_5.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_6.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_7.png", caption: "Synthetic shape dataset triangle " },
          { src: "/shapes/triangle_8.png", caption: "Synthetic shape dataset triangle " },

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
    title: "Hailo Deployment Pipeline for Robot Direction",
    summary: "A reproducible path from dataset and MobileNetV2 training to ONNX export, calibration generation, HEF compilation, and Raspberry Pi 5 deployment on Hailo hardware.",
    tags: ["Hailo-8L", "MobileNetV2", "ONNX", "Quantization", "Raspberry Pi 5", "Edge AI"],
    category: "AI & Machine Learning",
    bullets: [
      "Moved the model to a Hailo-friendly training setup: MobileNetV2 backbone, 224 x 224 input, and ONNX opset 11 output.",
      "Exported representative calibration images for post-training quantization and automated the DFC steps in compile_hailo.py.",
      "Captured the common deployment failure points - node naming, shape divisibility, unsupported ops, and class-map mismatches - in code instead of trial-and-error notes.",
    ],
    results: "The model path is now a real deployment pipeline instead of an experiment chain: train -> export ONNX -> generate calibration set -> compile HEF -> run on Pi. That made it much faster to iterate on robot-direction models for Hailo hardware.",
    lessons: "Compiler-friendly model design matters as much as raw accuracy. Input size, opset version, node names, and representative quantization images decide whether a model survives deployment.",
    tabs: {
      code: {
        filename: "compile_hailo.py",
        language: "python",
        description: "Compilation pipeline - translate ONNX into Hailo IR, quantize with calibration images, then emit HEF for hailo8l or hailo8.",
        snippet: `INPUT_NODE = "input_image"
OUTPUT_NODE = "predictions"
IMG_H = 224
IMG_W = 224

def parse_onnx(runner: ClientRunner, onnx_path: str):
    runner.translate_onnx_model(
        onnx_path,
        net_name="robot_drive",
        start_node_names=[INPUT_NODE],
        end_node_names=[OUTPUT_NODE],
        net_input_shapes={INPUT_NODE: [None, IMG_H, IMG_W, 3]}
    )

def optimize_and_quantize(runner: ClientRunner, calib_path: str):
    calib_images = np.load(calib_path)
    assert calib_images.shape[1:] == (IMG_H, IMG_W, 3)
    assert calib_images.dtype == np.float32
    runner.optimize(calib_images)

def compile_to_hef(runner: ClientRunner, output_dir: str, hw_arch: str) -> str:
    hef_path = os.path.join(output_dir, f'robot_drive_{hw_arch}.hef')
    hef_bytes = runner.compile()
    with open(hef_path, 'wb') as f:
        f.write(hef_bytes)
    return hef_path`,
      },
      extraFiles: [
        {
          filename: "train.py",
          language: "python",
          description: "Training and export step tuned for Hailo deployment - MobileNetV2, opset 11 ONNX export, and representative calibration output.",
          snippet: `IMG_H = 224
IMG_W = 224
ONNX_OPSET = 11
N_CALIB = 64

base = MobileNetV2(
    input_shape=(IMG_H, IMG_W, 3),
    include_top=False,
    weights='imagenet'
)

inputs = Input(shape=(IMG_H, IMG_W, 3), name="input_image")
x = base(inputs, training=False)
x = layers.GlobalAveragePooling2D(name="gap")(x)
outputs = layers.Dense(num_classes, activation='softmax', name="predictions")(x)

spec = (tf.TensorSpec((None, IMG_H, IMG_W, 3), tf.float32, name="input_image"),)
tf2onnx.convert.from_keras(model, input_signature=spec, opset=ONNX_OPSET, output_path=onnx_path)`,
        },
        {
          filename: "robot_direction.yaml",
          language: "yaml",
          description: "Earlier Hailo model-zoo style config used during experiments with TFLite-based compilation and node mapping.",
          snippet: `base:
- base/mobilenet.yaml
network:
  network_name: robot_direction
paths:
  network_path:
  - /local/workspace/robot_compile/direction_classifier_model.tflite
  alls_script: /local/workspace/robot_compile/robot_direction.alls
parser:
  nodes:
  - serving_default_input_image:0
  - StatefulPartitionedCall:0`,
        },
        {
          filename: "robot_direction.alls",
          language: "yaml",
          description: "Normalization script for Hailo experiments - centres pixel values into the range expected by the compiled classifier.",
          snippet: `normalization1 = normalization([127.5, 127.5, 127.5], [127.5, 127.5, 127.5])`,
        },
      ],
      results: {
        metrics: [
          { label: "Backbone",          value: "MobileNetV2 classifier for robot direction" },
          { label: "Input shape",       value: "224 x 224 x 3 (divisible for Hailo constraints)" },
          { label: "Export format",     value: "ONNX opset 11 + calibration_images.npy" },
          { label: "Compilation target", value: "hailo8l or hailo8 hardware profiles" },
          { label: "Quantization set",  value: "64 float32 representative images by default" },
          { label: "HEF output",        value: "robot_drive_hailo8l.hef for Pi 5 deployment" },
        ],
        images: [
          { src: "/hailo/compiler-flow.svg", caption: "Deployment flow from dataset to HEF on Hailo hardware" },
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
    github: "https://github.com/ketul-Sanjaykumar-Patel/Private-AI-road",
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
    github: "https://github.com/ketul-Sanjaykumar-Patel/Matlab_DTMF_tone_processes-",
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
    github: "https://github.com/ketul-Sanjaykumar-Patel/Matlab_Image_pixel_shifting",
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
    github: "https://github.com/ketul-Sanjaykumar-Patel/qt-qml-timer-navigation",
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
