import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Download,
  Video,
  Eye,
  Sliders,
  RefreshCw,
  Layers,
  Crosshair,
  CheckCircle2,
  X,
  Gauge,
  Info,
  Maximize2,
  ScanLine
} from 'lucide-react';
import { WasteItem, ItemImage } from '../types';

interface Rotation360PreviewProps {
  item: WasteItem;
  categoryColor: string;
  chuteNumber: number;
  categoryName: string;
  onClose: () => void;
}

export const Rotation360Preview: React.FC<Rotation360PreviewProps> = ({
  item,
  categoryColor,
  chuteNumber,
  categoryName,
  onClose,
}) => {
  // Generation state
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(true);
  const [synthesisProgress, setSynthesisProgress] = useState<number>(15);
  const [synthesisStep, setSynthesisStep] = useState<string>('Ingesting registered multi-angle vision racurs...');

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [renderMode, setRenderMode] = useState<'studio' | 'inspection' | 'chute'>('studio');
  const [showAiOverlay, setShowAiOverlay] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<'interactive' | 'video'>('interactive');

  // Video recording output
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const imagesMapRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const images = item.images || [];

  // Angle mapping helper
  const getAngleDegrees = useCallback((angle: string): number => {
    switch (angle) {
      case 'front': return 0;
      case 'isometric': return 45;
      case 'side': return 90;
      case 'detail': return 135;
      case 'back': return 180;
      case 'bottom': return 270;
      case 'top': return 315;
      default: return 0;
    }
  }, []);

  // Preload registered images into HTMLImageElements
  useEffect(() => {
    let isCancelled = false;
    const map = new Map<string, HTMLImageElement>();

    images.forEach((img) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.src = img.url;
      map.set(img.angle, el);
    });
    imagesMapRef.current = map;

    return () => {
      isCancelled = true;
    };
  }, [images]);

  // Simulated AI synthesis pipeline
  const runAiSynthesis = useCallback(() => {
    setIsSynthesizing(true);
    setSynthesisProgress(10);
    setSynthesisStep('Ingesting registered multi-angle vision racurs...');

    const t1 = setTimeout(() => {
      setSynthesisProgress(38);
      setSynthesisStep(`AI feature extraction: ${images.length} camera viewpoints analyzed...`);
    }, 450);

    const t2 = setTimeout(() => {
      setSynthesisProgress(68);
      setSynthesisStep('Synthesizing continuous 360° cylindrical surface trajectory...');
    }, 950);

    const t3 = setTimeout(() => {
      setSynthesisProgress(92);
      setSynthesisStep('Interpolating 72 azimuth keyframes & rendering 360° video sequence...');
    }, 1400);

    const t4 = setTimeout(() => {
      setSynthesisProgress(100);
      setSynthesisStep('360° Rotation Preview ready!');
      setTimeout(() => {
        setIsSynthesizing(false);
        setIsPlaying(true);
      }, 350);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [images.length]);

  useEffect(() => {
    const cancel = runAiSynthesis();
    return () => cancel();
  }, [runAiSynthesis]);

  // Video generation using MediaRecorder on canvas
  const generateVideoBlob = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    // Check MediaRecorder support
    if (typeof MediaRecorder === 'undefined') return;

    try {
      setIsRecordingVideo(true);
      recordedChunksRef.current = [];

      // Determine supported mime type
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setVideoBlobUrl(url);
        setIsRecordingVideo(false);
      };

      recorder.start();

      // Record for 1 full rotation at 1x speed (~3.6 seconds)
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 3600);
    } catch (err) {
      console.warn('MediaRecorder not available or failed:', err);
      setIsRecordingVideo(false);
    }
  }, []);

  // Trigger video recording automatically after synthesis
  useEffect(() => {
    if (!isSynthesizing && !videoBlobUrl && !isRecordingVideo) {
      const timer = setTimeout(() => {
        generateVideoBlob();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSynthesizing, videoBlobUrl, isRecordingVideo, generateVideoBlob]);

  // Canvas 360 Rendering Loop
  useEffect(() => {
    if (isSynthesizing) return;

    let animId: number;

    const render = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Update rotation angle if playing
      if (isPlaying) {
        // Base rotation speed: 70 degrees per second * playbackSpeed
        setCurrentAngle((prev) => (prev + 70 * playbackSpeed * delta) % 360);
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2 + 15;

      // 1. CLEAR & BACKGROUND
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(centerX, centerY - 20, 20, centerX, centerY, width / 1.4);
      if (renderMode === 'studio') {
        bgGrad.addColorStop(0, '#1e293b');
        bgGrad.addColorStop(0.7, '#0f172a');
        bgGrad.addColorStop(1, '#020617');
      } else if (renderMode === 'inspection') {
        bgGrad.addColorStop(0, '#064e3b');
        bgGrad.addColorStop(0.6, '#022c22');
        bgGrad.addColorStop(1, '#02120e');
      } else {
        // Chute industrial mode
        bgGrad.addColorStop(0, '#1e1e24');
        bgGrad.addColorStop(0.7, '#131316');
        bgGrad.addColorStop(1, '#09090b');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = renderMode === 'inspection' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. 3D TURNTABLE BASE
      const rad = (currentAngle * Math.PI) / 180;
      const turntableY = centerY + 90;
      const turntableRadiusX = 140;
      const turntableRadiusY = 38;

      // Outer drop glow
      ctx.save();
      ctx.shadowColor = categoryColor;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.ellipse(centerX, turntableY, turntableRadiusX, turntableRadiusY, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `${categoryColor}55`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Platform base surface
      const discGrad = ctx.createRadialGradient(centerX, turntableY, 10, centerX, turntableY, turntableRadiusX);
      discGrad.addColorStop(0, '#334155');
      discGrad.addColorStop(0.7, '#1e293b');
      discGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = discGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, turntableY, turntableRadiusX, turntableRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Concentric inner rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, turntableY, turntableRadiusX * 0.7, turntableRadiusY * 0.7, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, turntableY, turntableRadiusX * 0.4, turntableRadiusY * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Degree radial tick marks that rotate with the turntable
      const tickCount = 16;
      for (let i = 0; i < tickCount; i++) {
        const tickAngle = (i * (360 / tickCount) + currentAngle) * (Math.PI / 180);
        const cos = Math.cos(tickAngle);
        const sin = Math.sin(tickAngle);

        const innerX = centerX + cos * (turntableRadiusX * 0.82);
        const innerY = turntableY + sin * (turntableRadiusY * 0.82);
        const outerX = centerX + cos * (turntableRadiusX * 0.96);
        const outerY = turntableY + sin * (turntableRadiusY * 0.96);

        const isMajor = i % 4 === 0;
        ctx.strokeStyle = isMajor ? categoryColor : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = isMajor ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.stroke();
      }

      // Azimuth laser beam from origin
      const pointerX = centerX + Math.cos(rad) * (turntableRadiusX * 0.95);
      const pointerY = turntableY + Math.sin(rad) * (turntableRadiusY * 0.95);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX, turntableY);
      ctx.lineTo(pointerX, pointerY);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(pointerX, pointerY, 4, 0, Math.PI * 2);
      ctx.fill();

      // 3. OBJECT RENDERING & CONTINUOUS ROTATION SIMULATION
      // Select best matching image source based on angle
      // 0° = front, 45° = isometric, 90° = side, 180° = back, etc.
      const normalizedAngle = ((currentAngle % 360) + 360) % 360;

      let chosenAngleKey = 'front';
      if (normalizedAngle >= 25 && normalizedAngle < 70) {
        chosenAngleKey = imagesMapRef.current.has('isometric') ? 'isometric' : 'front';
      } else if (normalizedAngle >= 70 && normalizedAngle < 155) {
        chosenAngleKey = imagesMapRef.current.has('side') ? 'side' : 'front';
      } else if (normalizedAngle >= 155 && normalizedAngle < 240) {
        chosenAngleKey = imagesMapRef.current.has('back') ? 'back' : 'side';
      } else if (normalizedAngle >= 240 && normalizedAngle < 310) {
        chosenAngleKey = imagesMapRef.current.has('side') ? 'side' : 'front';
      } else {
        chosenAngleKey = 'front';
      }

      const imgEl = imagesMapRef.current.get(chosenAngleKey) || imagesMapRef.current.get('front') || imagesMapRef.current.values().next().value;

      // Calculate horizontal perspective foreshortening
      // Horizontal scale oscillates smoothly as object spins:
      const cosAngle = Math.cos(rad);
      // Smooth optical width scale (never completely collapses to zero)
      const scaleX = Math.max(0.28, Math.abs(cosAngle));
      const flipH = cosAngle < 0 ? -1 : 1;

      // Draw reflective shadow on turntable below object
      ctx.save();
      ctx.translate(centerX, turntableY);
      ctx.scale(scaleX * 0.9, 0.25);
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();
      ctx.restore();

      // Draw Main Object
      if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
        ctx.save();
        ctx.translate(centerX, centerY - 10);
        // Apply horizontal rotation scale and perspective flip
        ctx.scale(flipH * scaleX, 1);

        const targetW = 210;
        const targetH = 175;

        // Draw the image centered
        ctx.drawImage(imgEl, -targetW / 2, -targetH / 2, targetW, targetH);

        // Specular highlight sweep across object as it turns towards light source
        const lightAngleDiff = Math.cos(rad - Math.PI / 4);
        if (lightAngleDiff > 0) {
          const specGrad = ctx.createLinearGradient(-targetW / 2, 0, targetW / 2, 0);
          specGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          specGrad.addColorStop(Math.min(1, Math.max(0, lightAngleDiff)), 'rgba(255, 255, 255, 0.22)');
          specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = specGrad;
          ctx.fillRect(-targetW / 2, -targetH / 2, targetW, targetH);
        }

        ctx.restore();
      } else {
        // Fallback procedural object
        ctx.save();
        ctx.translate(centerX, centerY - 10);
        ctx.scale(scaleX, 1);
        ctx.fillStyle = categoryColor;
        ctx.beginPath();
        ctx.roundRect(-45, -70, 90, 140, 12);
        ctx.fill();
        ctx.restore();
      }

      // 4. INSPECTION / OPTICAL OVERLAYS
      if (renderMode === 'inspection' || showAiOverlay) {
        // Vertical scanning laser
        const scanY = centerY - 80 + ((time * 0.08) % 160);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX - 130, scanY);
        ctx.lineTo(centerX + 130, scanY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Laser glow
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - 130, scanY);
        ctx.lineTo(centerX + 130, scanY);
        ctx.stroke();

        // Corner optical bounding brackets
        const boxW = 230;
        const boxH = 190;
        const bLeft = centerX - boxW / 2;
        const bTop = centerY - 15 - boxH / 2;
        const bRight = bLeft + boxW;
        const bBottom = bTop + boxH;
        const cornerLen = 16;

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;

        // Top Left
        ctx.beginPath();
        ctx.moveTo(bLeft, bTop + cornerLen);
        ctx.lineTo(bLeft, bTop);
        ctx.lineTo(bLeft + cornerLen, bTop);
        ctx.stroke();

        // Top Right
        ctx.beginPath();
        ctx.moveTo(bRight - cornerLen, bTop);
        ctx.lineTo(bRight, bTop);
        ctx.lineTo(bRight, bTop + cornerLen);
        ctx.stroke();

        // Bottom Left
        ctx.beginPath();
        ctx.moveTo(bLeft, bBottom - cornerLen);
        ctx.lineTo(bLeft, bBottom);
        ctx.lineTo(bLeft + cornerLen, bBottom);
        ctx.stroke();

        // Bottom Right
        ctx.beginPath();
        ctx.moveTo(bRight - cornerLen, bBottom);
        ctx.lineTo(bRight, bBottom);
        ctx.lineTo(bRight, bBottom - cornerLen);
        ctx.stroke();

        // Center optical reticle
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 10);
        ctx.lineTo(centerX + 12, centerY - 10);
        ctx.moveTo(centerX, centerY - 22);
        ctx.lineTo(centerX, centerY + 2);
        ctx.stroke();
      }

      // 5. TOP & BOTTOM TELEMETRY LABELS
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`θ: ${Math.round(currentAngle).toString().padStart(3, '0')}° AZIMUTH`, 16, 26);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`CAM: ORBIT +15° ELEVATION`, 16, 42);
      ctx.fillText(`VIEWPOINT: ${chosenAngleKey.toUpperCase()}`, 16, 56);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`AI VISION: 60 FPS`, width - 16, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`CHUTE #${chuteNumber} • ${categoryName.toUpperCase()}`, width - 16, 42);
      ctx.fillText(`RESIN: ${item.material}`, width - 16, 56);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isSynthesizing, isPlaying, playbackSpeed, renderMode, showAiOverlay, categoryColor, chuteNumber, categoryName, item.material, currentAngle]);

  // Handle downloading the generated video file
  const handleDownloadVideo = () => {
    if (!videoBlobUrl) {
      // If blob URL is not ready yet, trigger generation
      generateVideoBlob();
      return;
    }

    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = `${item.id}_360_rotation_preview.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wide">
                AI 360° Vision Rotation Video
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SYNTHESIZED
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Continuous cylindrical azimuth projection interpolated from {images.length} registered vision racurs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Interactive Canvas vs Native Video Loop */}
          {videoBlobUrl && (
            <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-slate-800/80 rounded-lg border border-slate-700 text-xs font-mono">
              <button
                id="btn-toggle-interactive-mode"
                onClick={() => setDisplayMode('interactive')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  displayMode === 'interactive'
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3D Turntable
              </button>
              <button
                id="btn-toggle-video-mode"
                onClick={() => setDisplayMode('video')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  displayMode === 'video'
                    ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>WebM Loop</span>
              </button>
            </div>
          )}

          {/* Download Video Button */}
          <button
            id="btn-download-360-video"
            onClick={handleDownloadVideo}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all border cursor-pointer ${
              downloadSuccess
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Download the compiled 360-degree rotation video"
          >
            {downloadSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{downloadSuccess ? 'Downloaded!' : 'Export Video'}</span>
          </button>

          {/* Close preview / back to photos */}
          <button
            id="btn-close-360-preview"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Return to static racurs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
        {/* Synthesis Loading Overlay */}
        {isSynthesizing && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-cyan-500/40 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-sm font-bold font-mono text-white">
                Generating 360° Rotation Preview
              </h4>
              <p className="text-xs font-mono text-emerald-400 min-h-[20px]">
                {synthesisStep}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs space-y-1">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${synthesisProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Azimuth Keyframes</span>
                <span>{synthesisProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Display Mode 1: Interactive Canvas Turntable */}
        {displayMode === 'interactive' && (
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              // Allow mouse dragging to rotate turntable
              const startX = e.clientX;
              const startAngle = currentAngle;
              setIsPlaying(false);

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const diff = moveEvent.clientX - startX;
                setCurrentAngle(((startAngle + diff * 0.8) % 360 + 360) % 360);
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
              };

              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
          />
        )}

        {/* Display Mode 2: Native HTML5 Video Loop */}
        {displayMode === 'video' && videoBlobUrl && (
          <div className="w-full h-full flex items-center justify-center p-4 bg-black">
            <video
              src={videoBlobUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="max-w-full max-h-full rounded-xl border border-slate-800 shadow-2xl object-contain"
            />
          </div>
        )}

        {/* Quick Angle Badge Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-emerald-400 shadow-sm flex items-center gap-1.5 backdrop-blur-xs">
          <RotateCw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: `${3.6 / playbackSpeed}s` }} />
          <span>AZIMUTH {Math.round(currentAngle)}°</span>
        </div>

        {/* Recording status pill */}
        {isRecordingVideo && (
          <div className="absolute top-3 right-3 bg-rose-950/80 border border-rose-600/50 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-rose-300 shadow-sm flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>ENCODING WEBM LOOP...</span>
          </div>
        )}
      </div>

      {/* Playback Controls & Video Scrubber */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2.5">
        {/* Scrubber Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 w-7 text-right">0°</span>
          <div className="relative flex-1 flex items-center">
            <input
              id="range-360-azimuth-scrubber"
              type="range"
              min="0"
              max="359"
              value={Math.round(currentAngle)}
              onChange={(e) => {
                setCurrentAngle(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 w-9">360°</span>
        </div>

        {/* Action Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          {/* Left: Play/Pause, Step, Speed */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-play-pause-360"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-2xs cursor-pointer"
              title={isPlaying ? 'Pause Rotation' : 'Play 360° Rotation'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            {/* Step -15° */}
            <button
              id="btn-step-left-360"
              onClick={() => {
                setIsPlaying(false);
                setCurrentAngle((prev) => (prev - 15 + 360) % 360);
              }}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Step -15°"
            >
              -15°
            </button>

            {/* Step +15° */}
            <button
              id="btn-step-right-360"
              onClick={() => {
                setIsPlaying(false);
                setCurrentAngle((prev) => (prev + 15) % 360);
              }}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Step +15°"
            >
              +15°
            </button>

            {/* Speed Presets */}
            <div className="flex items-center gap-0.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700 ml-1">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    playbackSpeed === s
                      ? 'bg-slate-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Middle: Render Modes */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
            <button
              id="btn-render-mode-studio"
              onClick={() => setRenderMode('studio')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                renderMode === 'studio'
                  ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Studio
            </button>
            <button
              id="btn-render-mode-inspection"
              onClick={() => setRenderMode('inspection')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                renderMode === 'inspection'
                  ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Laser Scan
            </button>
            <button
              id="btn-render-mode-chute"
              onClick={() => setRenderMode('chute')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                renderMode === 'chute'
                  ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Chute
            </button>
          </div>

          {/* Right: Re-synthesize & Toggle Overlay */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-toggle-ai-overlay"
              onClick={() => setShowAiOverlay(!showAiOverlay)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono transition-colors border cursor-pointer ${
                showAiOverlay
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle AI Reticle & Telemetry Overlay"
            >
              <Crosshair className="w-3 h-3" />
              <span className="hidden sm:inline">HUD</span>
            </button>

            <button
              id="btn-resynthesize-360"
              onClick={runAiSynthesis}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono transition-colors cursor-pointer"
              title="Re-run AI synthesis"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Regen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
