# Landfill Separation Data System

An industrial dataset collection, multi-modal item registration, and 6-chute machine sorting simulation platform engineered for automated waste separation and computer vision training.

---

## Overview

The **Landfill Separation Data System** is built to prepare, inspect, and train machine learning models for high-speed industrial waste conveyor sorting systems. It features a complete pipeline for multi-angle vision capture, physical dimension profiling, raw dataset management across 6 distinct chutes, and real-time pneumatic separation simulation.

> **Industrial Machine Compatibility**: See [SYSTEM_GUIDE.md](./SYSTEM_GUIDE.md) for detailed hardware compatibility specifications covering High-Speed Optical Air-Jet Sorters (TOMRA, STEINERT), AI Robotic Delta Cells (AMP Robotics, ZenRobotics), Sensor-Fusion Separators, and PLC/Edge camera integration protocols (OPC UA, Modbus TCP, ROS2).

---

## 6-Category Separation Schema

The automated sorting machine classifies items across 6 target chutes:

| Chute # | Category | Data Format | Target Materials |
| :--- | :--- | :--- | :--- |
| **Chute #1** | **Plastic** | `plastic.json` | PET, HDPE, PP, LDPE bottles, jugs, containers |
| **Chute #2** | **Iron & Aluminium** | `iron-aluminium.csv` | Steel food cans, aluminium beverage cans, foil |
| **Chute #3** | **Glass** | `glass.csv` | Amber, flint/clear, green glass jars and bottles |
| **Chute #4** | **Wood & Paper** | `wood.csv` | Corrugated cardboard, timber offcuts, pallets, office paper |
| **Chute #5** | **Textile** | `textile.csv` | Cotton garments, synthetic fabric, denim, polyester |
| **Chute #6** | **General Waste** | `general_waste.csv` | Unclassified items, composite packaging, non-recyclables |

---

## Key Features

### 1. Item Registration & Multi-Angle Racur Capture
- **Physical Specifications**: Records item title, material classification, height (cm), width (cm), and surface characteristics.
- **Multi-Angle Photography**: Integrated live camera feed and file upload supporting 5 standard racurs:
  - Top (90° overhead)
  - Side (0° front profile)
  - Side (90° lateral profile)
  - Isometric (45° conveyor view)
  - Bottom (base profile)
- **Computer Vision Readiness**: Automatic dimension extraction, bounding box estimation, and training readiness verification.

### 2. Raw Data Scroll-Down Cell
- **Direct Dataset Inspection**: View and interact with all 6 data files in tabular view or raw source code view.
- **Inline Editing & CRUD**: Edit cell values in-place, delete records, or add new items directly to individual category datasets.
- **Live Search & Filtering**: Fast multi-field filtering across records.
- **Export & Synchronization**: Download individual file formats (`.json` or `.csv`) with synchronized state.

### 3. AI Separation & Chute Simulator
- **Optical Laser & NIR Profiler**: Simulates conveyor belt transit (2.4 m/s) with real-time laser profiling and spectral matching against registered training classes.
- **Automated Diverter & Pneumatic Ejector**: Visualizes routing to Chutes #1 through #5, with fallback to Chute #6 (General Waste) for unknown or composite materials.
- **Cycle Telemetry**: Real-time confidence scores, cycle diagnostics, and historical event logging.

### 4. ML Dataset Exporter
- **Multi-Modal JSON Manifest**: Complete metadata linking bounding boxes, dimension vectors, and image racurs.
- **YOLOv8 YAML Specification**: Ready-to-train configuration for object detection models.
- **COCO Dataset Format**: Standardized multi-class segmentation and annotation structure.
- **Master CSV**: Tabular summary of all registered landfill separation items.

---

## Tech Stack

- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (High-Density Industrial Dark theme)
- **Icons**: Lucide React
- **Client APIs**: Canvas 2D, WebRTC Camera Stream API, Blob / File API

---

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```
