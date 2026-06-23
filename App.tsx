import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  ChevronLeft,
  Zap,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  StopCircle,
  Clock,
  Lock,
  ShieldCheck,
  CloudLightning,
  Trash2,
  BookOpen,
  Youtube,
  Check,
  AlertTriangle,
  X,
  Book,
  Bookmark,
  Globe,
  ExternalLink,
  User,
  History,
  Activity,
  Calendar,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Award,
  Timer,
  BrainCircuit,
  Quote,
  Plus,
  Search,
  FileText,
  PlusCircle,
  Settings
} from 'lucide-react';
import Button from './components/Button';
import GlassCard from './components/GlassCard';
import { analyzeBJJVideo, validateBJJSource, adaptLearningResource } from './services/geminiService';
import { saveAnalysisToHistory, getAnalysisHistory, deleteAnalysisFromHistory } from './services/historyService';
import { MetricsService } from './services/metricsService';
import { RagService } from './services/ragService';
import { openDB } from 'idb';
import { AnalysisResult, AppView, VideoState, FighterAnalysis, RagSource, TechniqueProgress, LearningAdaptationLog } from './types';

// Constants
const MAX_DURATION_SEC = 45;

// --- Sub-component for Analyzing View (Simplified) ---
const AnalyzingView: React.FC<{ executionTime: number; onCancel?: () => void }> = ({ executionTime, onCancel }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-white/90 backdrop-blur-xl animate-fade-in relative overflow-hidden">

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-purple-600">
            <BrainCircuit size={32} className="animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Video</h2>
        <p className="text-gray-500 text-sm mb-6">Consulting knowledge base...</p>

        {/* Live Timer */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full font-mono text-xs text-gray-500 border border-gray-200 mb-12">
          <Timer size={12} className="text-gray-400" />
          {executionTime.toFixed(1)}s
        </div>

        {/* Apple-style Cancel Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="group flex items-center gap-2 px-6 py-2.5 bg-gray-100/80 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full text-sm font-medium tracking-wide transition-all duration-300 border border-gray-200/50 hover:border-red-200 shadow-sm backdrop-blur-md active:scale-95"
          >
            <X size={16} className="transition-transform group-hover:rotate-90 duration-300" />
            Cancel Analysis
          </button>
        )}
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [videoState, setVideoState] = useState<VideoState>({ blob: null, url: null, duration: 0 });
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [historyList, setHistoryList] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [activeFighterIndex, setActiveFighterIndex] = useState(0); // 0 or 1
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [fromHistory, setFromHistory] = useState(false);

  // Tab and RAG State
  const [activeTab, setActiveTab] = useState<'sparring' | 'library' | 'progress'>('sparring');
  const [ragSources, setRagSources] = useState<RagSource[]>([]);
  const [progressList, setProgressList] = useState<TechniqueProgress[]>([]);
  const [adaptationLogs, setAdaptationLogs] = useState<LearningAdaptationLog[]>([]);
  const [isUploadingRag, setIsUploadingRag] = useState(false);
  const [ragUploadError, setRagUploadError] = useState<string | null>(null);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("");
  const [isSubmittingYoutube, setIsSubmittingYoutube] = useState(false);

  // API Key config states
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem('VITE_API_KEY') || '');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const loadProgressData = useCallback(async () => {
    const list = await RagService.getTechniqueProgressList();
    setProgressList(list);
    const logs = await RagService.getAdaptationLogs();
    setAdaptationLogs(logs);
  }, []);

  const loadRagSources = useCallback(async () => {
    const list = await RagService.getRagSources();
    setRagSources(list);
  }, []);

  useEffect(() => {
    loadRagSources();
    loadProgressData();

    // Check if API key is present in environment or localstorage
    const envKey = process.env.API_KEY;
    const hasEnvKey = envKey && envKey !== 'undefined' && envKey !== 'null' && envKey.trim() !== '';
    const hasLocalKey = localStorage.getItem('VITE_API_KEY');
    if (!hasEnvKey && !hasLocalKey) {
      setApiKeyMissing(true);
    }
  }, [loadRagSources, loadProgressData]);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('VITE_API_KEY', key);
    setApiKeyInput(key);
    setApiKeyMissing(false);
    setShowSettingsModal(false);
    // Reload page to re-initialize Gemini clients
    window.location.reload();
  };

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Compression Simulation State
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  // Analysis Timer State
  const [executionTime, setExecutionTime] = useState(0);
  const analysisIntervalRef = useRef<number | null>(null);

  // Cancellation State
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- EFFECTS ---

  // Fix for Black Screen: Re-attach stream to video element when view changes to 'record'
  useEffect(() => {
    if (view === 'record' && streamRef.current && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = streamRef.current;
      // Force play to ensure preview starts on some mobile browsers
      videoPreviewRef.current.play().catch(e => console.warn("Video play error:", e));
    }
  }, [view]);

  // --- ACTIONS ---

  const loadHistory = async () => {
    setLoadingHistory(true);
    setView('history');
    const data = await getAnalysisHistory();
    setHistoryList(data);
    setLoadingHistory(false);
  };

  const handleDeleteHistoryItem = async (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (!id) return;
    const success = await deleteAnalysisFromHistory(id);
    if (success) {
      setHistoryList(prev => prev.filter(item => item.id !== id));
    } else {
      setError("Could not delete history record.");
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera
        audio: true
      });
      streamRef.current = stream;
      // We set srcObject in the useEffect now
      setView('record');
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Cannot access camera. Please check permissions.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      handleVideoIngest(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    // Timer Logic
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= MAX_DURATION_SEC) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);

      // Stop tracks
      streamRef.current?.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleVideoIngest(file);
    }
  };

  const handleVideoIngest = (blob: Blob) => {
    setView('preview');
    // Simulate Compression/Validation Phase
    setIsCompressing(true);
    setCompressionProgress(0);

    const interval = setInterval(() => {
      setCompressionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompressing(false);
          const url = URL.createObjectURL(blob);
          setVideoState({ blob, url, duration: 0 });
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleAnalyze = async () => {
    if (!videoState.blob) return;

    // 1. Fase de Transmisión Segura (Upload)
    setView('uploading');

    // REDUCIDO: Simulamos menos tiempo para dar sensación de velocidad (500ms vs 2000ms)
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Fase de Inferencia (Analysis)
    setView('analyzing');
    setExecutionTime(0);
    const startTime = Date.now();

    // Start UI Timer
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    analysisIntervalRef.current = window.setInterval(() => {
      setExecutionTime((Date.now() - startTime) / 1000);
    }, 100);

    // Initialize Abort Controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Fetch dynamic library context (RAG)
      const ragContext = await RagService.compileRagContext();

      const result = await analyzeBJJVideo(
        videoState.blob,
        ragContext,
        abortControllerRef.current.signal
      );

      // Track BJJ sparring results & adapt queries if stagnating
      await RagService.trackSparringAudit(result.fighters, adaptLearningResource);
      await loadProgressData();

      // Stop Timer
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      setExecutionTime((Date.now() - startTime) / 1000); // Set final precise time

      setAnalysis(result);
      setActiveFighterIndex(0); // Reset to first fighter
      setFromHistory(false);
      setView('result');

      // 3. Guardado Local (LocalStorage)
      saveAnalysisToHistory(result);

    } catch (err: any) {
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);

      if (err.message === "Analysis cancelled by user") {
        console.log("Analysis was cancelled successfully.");
        return; // Exit silently, view already changed
      }

      console.error("Analysis failed:", err);
      setError("Technical audit failed. Please try again.");
      setView('preview');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    setView('preview'); // Instantly return to preview
  };

  const handleSelectHistoryItem = (item: AnalysisResult) => {
    setAnalysis(item);
    setActiveFighterIndex(0);
    setFromHistory(true);
    setView('result');
  };

  const resetApp = () => {
    // CU-06: Reiniciar Análisis (Gestión de Ciclo de Vida y Memoria)

    // 1. Liberar Recursos de Hardware (Cámara/Micrófono)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 2. Limpiar Timers Activos
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    // 3. Borrado Seguro de Datos (Memoria RAM)
    // Revocamos la URL del blob para permitir que el GC libere la memoria del video.
    if (videoState.url) {
      URL.revokeObjectURL(videoState.url);
    }

    // 4. Limpiar Buffers Temporales
    chunksRef.current = [];
    mediaRecorderRef.current = null;

    // 5. Restablecer Estado de la Interfaz
    // Si venimos del historial y queremos volver atrás, vamos a history. Si no, a home.
    if (fromHistory) {
      setView('history');
      setAnalysis(null);
      setFromHistory(false);
    } else {
      setView('home');
      setVideoState({ blob: null, url: null, duration: 0 }); // Nullify Blob
      setAnalysis(null); // Nullify JSON Diagnosis
      setError(null);
      setRecordingTime(0);
      setIsRecording(false);
      setIsCompressing(false);
      setCompressionProgress(0);
      setShowReferenceModal(false);
      setActiveFighterIndex(0);
      setExecutionTime(0);
    }
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setRagUploadError("El archivo PDF supera el límite de 10MB.");
      return;
    }

    setIsUploadingRag(true);
    setRagUploadError(null);

    const tempId = `pdf-${Date.now()}`;
    const pendingSource: RagSource = {
      id: tempId,
      type: 'pdf',
      name: file.name,
      contentSummary: "Validando el contenido del PDF con IA...",
      validated: false,
      timestamp: Date.now(),
      techniquesCovered: []
    };

    setRagSources(prev => [pendingSource, ...prev]);
    await RagService.saveRagSource(pendingSource);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const validationResult = await validateBJJSource('pdf', { base64Pdf: base64Data, title: file.name });

        if (validationResult.valid) {
          const finalSource: RagSource = {
            ...pendingSource,
            name: validationResult.name || file.name,
            contentSummary: validationResult.summary,
            validated: true,
            techniquesCovered: validationResult.techniques
          };
          await RagService.saveRagSource(finalSource);
          setRagSources(prev => prev.map(s => s.id === tempId ? finalSource : s));
        } else {
          const failedSource: RagSource = {
            ...pendingSource,
            contentSummary: `Rechazado: ${validationResult.reason || "El contenido no está relacionado con BJJ."}`,
            validated: false
          };
          await RagService.saveRagSource(failedSource);
          setRagSources(prev => prev.map(s => s.id === tempId ? failedSource : s));
        }
      } catch (err: any) {
        console.error("PDF validation failed:", err);
        const failedSource: RagSource = {
          ...pendingSource,
          contentSummary: "Error durante la validación del PDF.",
          validated: false
        };
        await RagService.saveRagSource(failedSource);
        setRagSources(prev => prev.map(s => s.id === tempId ? failedSource : s));
      } finally {
        setIsUploadingRag(false);
      }
    };
    reader.onerror = () => {
      setRagUploadError("No se pudo leer el archivo PDF.");
      setIsUploadingRag(false);
    };
  };

  const handleYoutubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrlInput.trim()) return;

    setIsSubmittingYoutube(true);
    setRagUploadError(null);

    const tempId = `yt-${Date.now()}`;
    const pendingSource: RagSource = {
      id: tempId,
      type: 'youtube',
      name: "Enlace de YouTube",
      url: youtubeUrlInput,
      contentSummary: "Obteniendo detalles del video y validando...",
      validated: false,
      timestamp: Date.now(),
      techniquesCovered: []
    };

    setRagSources(prev => [pendingSource, ...prev]);
    await RagService.saveRagSource(pendingSource);

    try {
      let title = "Video de YouTube BJJ";
      try {
        const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(youtubeUrlInput)}`;
        const res = await fetch(oembedUrl);
        const data = await res.json();
        if (data.title) {
          title = data.title;
        }
      } catch (oembedErr) {
        console.warn("Failed oembed fetch:", oembedErr);
      }

      const validationResult = await validateBJJSource('youtube', { url: youtubeUrlInput, title });

      if (validationResult.valid) {
        const finalSource: RagSource = {
          ...pendingSource,
          name: validationResult.name || title,
          contentSummary: validationResult.summary,
          validated: true,
          techniquesCovered: validationResult.techniques
        };
        await RagService.saveRagSource(finalSource);
        setRagSources(prev => prev.map(s => s.id === tempId ? finalSource : s));
        setYoutubeUrlInput("");
      } else {
        const failedSource: RagSource = {
          ...pendingSource,
          name: title,
          contentSummary: `Rechazado: ${validationResult.reason || "El video no está relacionado con BJJ."}`,
          validated: false
        };
        await RagService.saveRagSource(failedSource);
        setRagSources(prev => prev.map(s => s.id === tempId ? failedSource : s));
      }
    } catch (err: any) {
      console.error("YouTube validation failed:", err);
      const failedSource: RagSource = {
        ...pendingSource,
        contentSummary: "Error durante la validación del video.",
        validated: false
      };
      await RagService.saveRagSource(failedSource);
      setRagSources(prev => prev.map(s => s.id === tempId ? failedSource : s));
    } finally {
      setIsSubmittingYoutube(false);
    }
  };

  const handleDeleteRagSource = async (id: string) => {
    const success = await RagService.deleteRagSource(id);
    if (success) {
      setRagSources(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleResetSystem = async () => {
    if (window.confirm("¿Estás seguro de que quieres restablecer todo el sistema? Esto borrará toda tu biblioteca RAG, progreso y logs de aprendizaje, e historial de combates.")) {
      await RagService.clearAllRagData();
      
      try {
        const db = await openDB('openbjj-db', 1);
        await db.clear('analysis-store');
      } catch (dbErr) {
        console.error("Error clearing history database store:", dbErr);
      }
      
      setRagSources([]);
      setProgressList([]);
      setAdaptationLogs([]);
      resetApp();
    }
  };

  const getActiveData = (): FighterAnalysis | null => {
    if (!analysis || !analysis.fighters) return null;
    return analysis.fighters[activeFighterIndex];
  };

  const handleOpenVideoReference = () => {
    const data = getActiveData();
    if (!data?.youtube_query) return;

    // "Gestor de Enlaces" Logic
    const query = data.youtube_query;
    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.youtube.com/results?search_query=${encodedQuery}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // --- VIEWS ---

  const renderSparringTab = () => (
    <div className="flex flex-col p-6 animate-fade-in">
      <header className="mb-10 mt-6 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">OpenBJJ</h1>
          <p className="text-gray-500 mt-1.5 text-base">Technical Jiu-Jitsu Audit with RAG</p>
        </div>
        <button 
          onClick={() => setShowSettingsModal(true)} 
          className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 text-gray-500 shadow-sm transition-colors active:scale-95 shrink-0"
          title="Configuración de API Key"
        >
          <Settings size={20} />
        </button>
      </header>

      <div className="flex flex-col gap-6 justify-center">
        <GlassCard
          onClick={handleStartCamera}
          className="p-8 flex flex-col items-center justify-center gap-4 h-48 group hover:bg-white transition-all shadow-md"
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Camera size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-850">Record Sparring</h2>
          <p className="text-gray-450 text-xs">Secure Camera (Max 45s)</p>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-40">
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileUpload}
            />
            <GlassCard className="p-4 flex flex-col items-center justify-center gap-3 h-full group hover:bg-white transition-all shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <h2 className="font-bold text-gray-850 text-sm">Upload Video</h2>
              </div>
            </GlassCard>
          </div>

          <GlassCard
            onClick={loadHistory}
            className="p-4 flex flex-col items-center justify-center gap-3 h-40 group hover:bg-white transition-all shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <History size={24} />
            </div>
            <div className="text-center">
              <h2 className="font-bold text-gray-850 text-sm">History</h2>
            </div>
          </GlassCard>
        </div>

        {/* System Settings/Metrics */}
        <div className="mt-6 flex flex-col gap-3 items-center">
          <button
            onClick={() => {
              const summary = MetricsService.getSummary();
              if (summary) {
                alert(`📊 INFORME DE METRICAS DEL SISTEMA\n\nEjecuciones: ${summary.totalRuns}\nTasa de Éxito: ${summary.successRate}\nLatencia Promedio: ${summary.avgLatency}\nTokens Totales: ${summary.totalTokens}\nCosto Est.: ${summary.estimatedCost}\nÚltimo Error: ${summary.lastError}`);
              } else {
                alert("No se han registrado métricas todavía.");
              }
            }}
            className="text-xs text-gray-450 hover:text-blue-500 flex items-center gap-1.5 transition-colors"
          >
            <Activity size={12} /> Ver Estado del Sistema
          </button>
          
          <button
            onClick={handleResetSystem}
            className="text-[10px] text-red-400 hover:text-red-650 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={10} /> Restablecer Todo el Sistema
          </button>
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-2 text-gray-400 text-xs items-center">
        <Lock size={12} />
        <span>Privacidad Local Extremo a Extremo</span>
      </div>
    </div>
  );

  const renderLibraryTab = () => (
    <div className="flex flex-col p-6 animate-fade-in">
      <header className="mb-8 mt-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Biblioteca RAG</h1>
        <p className="text-gray-500 mt-1.5 text-sm">Sube PDFs o videos de YouTube para indexar técnicas personalizadas.</p>
      </header>

      {ragUploadError && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <div className="flex-1">{ragUploadError}</div>
          <button onClick={() => setRagUploadError(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Input section */}
      <div className="space-y-6">
        {/* PDF Uploader */}
        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center hover:border-blue-500 transition-all relative cursor-pointer group bg-white shadow-sm">
          <input 
            type="file" 
            accept="application/pdf" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handlePdfUpload} 
            disabled={isUploadingRag} 
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <p className="text-sm font-semibold text-gray-700">Subir PDF de BJJ</p>
            <p className="text-xs text-gray-450">Manuales, reglas, o guías escritas (Máx 10MB)</p>
          </div>
        </div>

        {/* YouTube Link Submitter */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
            <Youtube size={16} className="text-red-500" />
            Indexar Enlace de YouTube
          </h3>
          <form onSubmit={handleYoutubeSubmit} className="flex gap-2">
            <input
              type="url"
              placeholder="Pega enlace de YouTube aquí..."
              value={youtubeUrlInput}
              onChange={e => setYoutubeUrlInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs outline-none focus:bg-white focus:border-blue-500 transition-colors"
              disabled={isSubmittingYoutube}
            />
            <button
              type="submit"
              className="p-3 bg-black hover:bg-gray-805 text-white rounded-2xl transition-colors disabled:opacity-50"
              disabled={isSubmittingYoutube || !youtubeUrlInput}
            >
              {isSubmittingYoutube ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus size={20} />
              )}
            </button>
          </form>
        </div>

        {/* Sources List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-450 uppercase tracking-wider pl-1">Fuentes Indexadas ({ragSources.length})</h3>
          
          {ragSources.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-gray-200/50 text-gray-450 p-6 flex flex-col items-center gap-2">
              <BookOpen size={28} className="text-gray-300" />
              <p className="text-sm font-semibold">Tu biblioteca está vacía</p>
              <p className="text-xs max-w-xs leading-relaxed">Sube contenido para que el coach analice tus sparring utilizando tu propia biblioteca en lugar de solo la base estándar.</p>
            </div>
          ) : (
            ragSources.map((source) => {
              const isPdf = source.type === 'pdf';
              const isRejected = source.contentSummary.startsWith("Rechazado");
              const isPending = !source.validated && !isRejected;

              return (
                <GlassCard key={source.id} className="p-4 border-0 shadow-sm bg-white relative">
                  <div className="flex gap-3 items-start pr-8">
                    <div className={`p-2 rounded-xl shrink-0 ${isPdf ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                      {isPdf ? <FileText size={18} /> : <Youtube size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{source.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {source.contentSummary}
                      </p>
                      {source.techniquesCovered.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {source.techniquesCovered.slice(0, 4).map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-50 border border-gray-150 rounded text-[10px] font-medium text-gray-650">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges / Validation Indicators */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {source.validated && (
                      <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center" title="Validado e Indexado">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    {isPending && (
                      <div className="w-4 h-4 border-2 border-gray-305 border-t-blue-500 rounded-full animate-spin" title="Validando..." />
                    )}
                    {isRejected && (
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center" title="Contenido Inválido (No es BJJ)">
                        <X size={12} strokeWidth={3} />
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteRagSource(source.id)}
                      className="p-1 text-gray-350 hover:text-red-500 rounded transition-colors"
                      title="Eliminar de RAG"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => {
    const masteredCount = progressList.filter(p => p.status === 'mastered').length;
    const learningCount = progressList.filter(p => p.status === 'learning').length;
    
    return (
      <div className="flex flex-col p-6 animate-fade-in">
        <header className="mb-8 mt-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Seguimiento</h1>
          <p className="text-gray-500 mt-1.5 text-sm">IA Coach: Monitorea tus técnicas y adecua los recursos automáticamente.</p>
        </header>

        {/* Coach Overview Card */}
        <GlassCard className="p-6 bg-gradient-to-br from-gray-900 to-blue-950 text-white border-0 shadow-lg mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-blue-300 font-bold">Estado de tu Aprendizaje</span>
              <h2 className="text-2xl font-bold mt-1">Tu Nivel de Jiu-Jitsu</h2>
            </div>
            <div className="p-2.5 bg-white/10 rounded-2xl text-blue-300 shadow-inner">
              <Award size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
            <div>
              <p className="text-xs text-blue-200">Técnicas Dominadas</p>
              <p className="text-2xl font-black mt-1 flex items-baseline gap-1 text-green-400">
                {masteredCount} <span className="text-xs text-gray-400 font-normal">hechas</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-200">En Aprendizaje</p>
              <p className="text-2xl font-black mt-1 flex items-baseline gap-1 text-yellow-400">
                {learningCount} <span className="text-xs text-gray-400 font-normal">activas</span>
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/5 rounded-xl text-xs text-blue-100 flex gap-2 items-start italic leading-relaxed">
            <Quote size={12} className="shrink-0 text-blue-400 rotate-180" />
            <span>"El coach de IA está observando tus sparrings. Si detecta que fallas la misma técnica repetidamente, adaptará el material para darte explicaciones alternativas."</span>
          </div>
        </GlassCard>

        {/* Technique List */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-semibold text-gray-450 uppercase tracking-wider pl-1">Mis Técnicas Practicadas</h3>

          {progressList.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-gray-200/50 text-gray-450 p-6">
              <Zap size={24} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">Aún no hay técnicas registradas</p>
              <p className="text-xs text-gray-450 mt-1 max-w-xs mx-auto">Sube un sparring grabado en la pestaña 'Sparring' y las técnicas analizadas aparecerán aquí automáticamente.</p>
            </div>
          ) : (
            progressList.map((progress) => {
              const isMastered = progress.status === 'mastered';
              const queryUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(progress.assignedVideoQuery)}`;

              return (
                <GlassCard key={progress.techniqueName} className="p-5 border-0 shadow-sm bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight pr-4">
                      {progress.techniqueName}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                      isMastered ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}>
                      {isMastered ? 'Dominada' : 'En Estudio'}
                    </span>
                  </div>

                  {/* Success Rate Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Tasa de éxito: {progress.successRate}%</span>
                      <span>Intentos: {progress.attemptsCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMastered ? 'bg-green-500' : 'bg-blue-500'
                        }`} 
                        style={{ width: `${progress.successRate}%` }} 
                      />
                    </div>
                  </div>

                  {/* YouTube Recommendation Link */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-650">
                      <Youtube size={14} className="text-red-500 shrink-0" />
                      <span className="font-bold text-gray-800">Recurso de estudio recomendado:</span>
                    </div>
                    
                    <a
                      href={queryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-xs flex items-center gap-1 font-semibold break-all pl-5"
                    >
                      Buscar: "{progress.assignedVideoQuery}"
                      <ExternalLink size={12} className="shrink-0" />
                    </a>

                    {progress.recommendationReasoning && (
                      <p className="text-[10px] text-gray-500 italic pl-5 leading-relaxed">
                        Coach: {progress.recommendationReasoning}
                      </p>
                    )}

                    {progress.adaptationVersion > 0 && (
                      <span className="inline-flex self-start text-[9px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded ml-5">
                        Recomendación Adaptada (v{progress.adaptationVersion})
                      </span>
                    )}
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        {/* Adaptation Logs Section */}
        {adaptationLogs.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-semibold text-gray-450 uppercase tracking-wider pl-1">Historial de Adaptaciones</h3>
            {adaptationLogs.map((log) => (
              <div key={log.id} className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex flex-col gap-1.5 text-xs text-gray-700">
                <div className="flex justify-between items-center font-bold text-orange-800">
                  <span className="flex items-center gap-1">
                    <Zap size={12} />
                    Cambio en: {log.techniqueName}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-500 leading-normal">
                  Cambiamos la búsqueda anterior <span className="font-mono bg-orange-100 px-1 rounded text-orange-700">"{log.previousQuery}"</span> por una enfocada a tu error: <span className="font-mono bg-green-100 px-1 rounded text-green-800 font-bold">"{log.newQuery}"</span>.
                </p>
                <p className="italic text-gray-650 mt-0.5 pl-2 border-l border-orange-200">
                  "{log.reason}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderHome = () => (
    <div className="flex flex-col h-full bg-[#f2f2f7] relative overflow-hidden">
      {/* Scrollable Content area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'sparring' && renderSparringTab()}
        {activeTab === 'library' && renderLibraryTab()}
        {activeTab === 'progress' && renderProgressTab()}
      </div>

      {/* Sleek iOS/PWA-style Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-t border-gray-200/60 py-3.5 px-8 flex justify-around items-center rounded-t-3xl shadow-lg">
        <button 
          onClick={() => setActiveTab('sparring')} 
          className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${activeTab === 'sparring' ? 'text-blue-600 scale-105 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Activity size={20} className={activeTab === 'sparring' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] uppercase tracking-wider">Sparring</span>
        </button>
        <button 
          onClick={() => setActiveTab('library')} 
          className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${activeTab === 'library' ? 'text-blue-600 scale-105 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <BookOpen size={20} className={activeTab === 'library' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] uppercase tracking-wider">Library</span>
        </button>
        <button 
          onClick={() => setActiveTab('progress')} 
          className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${activeTab === 'progress' ? 'text-blue-600 scale-105 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Award size={20} className={activeTab === 'progress' ? 'stroke-[2.5px]' : ''} />
          <span className="text-[10px] uppercase tracking-wider">My Coach</span>
        </button>
      </div>
    </div>
  );

  const renderHistory = () => {
    return (
      <div className="flex flex-col h-full bg-[#f2f2f7] animate-fade-in">
        <header className="flex items-center p-6 bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/50">
          <button onClick={() => setView('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors">
            <ChevronLeft className="text-gray-800" />
          </button>
          <h2 className="text-xl font-bold ml-2 text-gray-900">History</h2>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Simple List */}
          <div className="p-4 space-y-3">

            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400">Loading...</p>
              </div>
            ) : historyList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-6">
                <History size={32} className="text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium text-sm">No history yet</p>
                <p className="text-xs text-gray-400 mt-1">Your recent analyses will appear here.</p>
              </div>
            ) : (
              historyList.map((item, idx) => (
                <GlassCard
                  key={item.id || idx}
                  onClick={() => handleSelectHistoryItem(item)}
                  className="p-4 flex flex-col gap-3 group hover:bg-white transition-colors border-0 shadow-sm active:scale-[0.99]"
                >
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Calendar size={12} />
                      {item.timestamp ? new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  </div>

                  {/* Resumen de los 2 luchadores en formato compacto */}
                  <div className="space-y-2">
                    {item.fighters.map((fighter, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <div className={`
                                            w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0
                                            ${fighter.status === 'approved' ? 'bg-green-500' : 'bg-orange-400'}
                                        `}>
                          {fighter.status === 'approved' ? <Check size={12} strokeWidth={3} /> : <div className="w-1 h-3 bg-white rounded-full font-serif font-bold italic">!</div>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {fighter.role}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {fighter.techniques.slice(0, 2).join(", ") || "General analysis"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRecorder = () => (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video Preview — Full screen, no opacity, like native camera */}
      <video
        ref={videoPreviewRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Recording Progress Bar (thin line at top like iOS camera) */}
      {isRecording && (
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-black/20">
          <div
            className="h-full bg-red-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(recordingTime / MAX_DURATION_SEC) * 100}%` }}
          />
        </div>
      )}

      {/* Top HUD — safe area aware */}
      <div
        className="absolute top-0 left-0 right-0 z-10 px-4 pt-2 flex justify-between items-center"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={resetApp}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft size={22} />
        </button>
        <div className={`
          px-4 py-2 rounded-full backdrop-blur-md font-mono text-sm font-semibold 
          flex items-center gap-2 
          ${recordingTime > 35 ? 'bg-red-500/90 text-white' : 'bg-black/40 text-white/90'}
        `}>
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/70'}`} />
          00:{recordingTime.toString().padStart(2, '0')} / 00:{MAX_DURATION_SEC}
        </div>
      </div>

      {/* Bottom Controls — safe area aware */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex justify-center items-center pb-4"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-[72px] h-[72px] rounded-full border-[4px] border-white/90 flex items-center justify-center bg-transparent active:scale-90 transition-transform shadow-lg"
          >
            <div className="w-[60px] h-[60px] rounded-full bg-red-500" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-[72px] h-[72px] rounded-full border-[4px] border-white/90 flex items-center justify-center bg-transparent active:scale-90 transition-transform shadow-lg"
          >
            <div className="w-8 h-8 rounded-[6px] bg-red-500" />
          </button>
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="flex flex-col h-full bg-gray-50 p-6 animate-fade-in">
      <header className="flex items-center mb-6">
        <button onClick={resetApp} className="p-2 -ml-2 rounded-full hover:bg-gray-200 transition-colors">
          <ChevronLeft className="text-gray-800" />
        </button>
        <h2 className="text-xl font-bold ml-2 text-gray-900">Validate Upload</h2>
      </header>

      {isCompressing ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${compressionProgress}%` }}
            />
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Optimizing buffer (RAM)...</p>
        </div>
      ) : (
        <>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[9/16] mb-6">
            {videoState.url && (
              <video
                src={videoState.url}
                controls
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-white/80 flex items-center gap-1">
              <ShieldCheck size={12} />
              Ready to audit
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <GlassCard className="p-4 flex gap-4 items-center bg-blue-50/50 border-blue-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Validation Successful</h3>
                <p className="text-gray-500 text-xs">Valid duration. Compression ready.</p>
              </div>
              <CheckCircle2 size={20} className="text-green-500 ml-auto" />
            </GlassCard>

            <Button fullWidth onClick={handleAnalyze} icon={<CloudLightning size={18} />}>
              Run Technical Audit
            </Button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <Lock size={10} /> Your data is deleted after analysis
            </p>
          </div>
        </>
      )}
    </div>
  );

  const renderUploading = () => (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-white/80 backdrop-blur-xl">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-blue-600">
          <Upload size={32} className="animate-bounce" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Transmission</h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto mb-4">
        Uploading to encrypted temporal bucket...
      </p>
      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
        <Lock size={12} /> TLS 1.3 Channel
      </div>
    </div>
  );

  const renderResult = () => {
    if (!analysis || !analysis.fighters) return null;

    const activeData = analysis.fighters[activeFighterIndex];
    if (!activeData) return null;

    const isApproved = activeData.status === 'approved';

    // Configuración del Tema (Semáforo)
    const bgHeader = isApproved ? 'bg-green-500' : 'bg-orange-500';
    const textHeader = 'text-white';
    const StatusIcon = isApproved ? Check : AlertTriangle;
    const verdictText = isApproved ? 'TECHNIQUE APPROVED' : 'CORRECTION NEEDED';

    return (
      <div className="flex flex-col h-full bg-[#f2f2f7] overflow-y-auto no-scrollbar relative">

        {/* MODAL DE REFERENCIA */}
        {showReferenceModal && activeData.reference && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
              {/* Modal Header */}
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-800">
                  <Book size={18} />
                  <span className="font-bold text-sm">Bibliographic Reference</span>
                </div>
                <button
                  onClick={() => setShowReferenceModal(false)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Book</p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {activeData.reference.book}
                  </h3>
                </div>

                <div className="flex gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Belt Level</p>
                    {/* Fallback for legacy data */}
                    <p className="font-medium text-gray-700">{(activeData.reference as any).belt || (activeData.reference as any).chapter || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Technique / Section</p>
                    {/* Fallback for legacy data */}
                    <p className="font-medium text-gray-700">{(activeData.reference as any).technique || (activeData.reference as any).page || "-"}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex gap-2 mb-2">
                    <Bookmark size={16} className="text-blue-500 shrink-0" />
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Key Concept</p>
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "{activeData.reference.quote}"
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <Button fullWidth onClick={() => setShowReferenceModal(false)} variant="secondary">
                  Close Reference
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Navbar */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 flex items-center justify-between animate-fade-in-down">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <span className="font-bold text-gray-900">Diagnosis</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Resultado del Tiempo */}
            {!fromHistory && executionTime > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded-md">
                <Timer size={10} />
                {executionTime.toFixed(1)}s
              </div>
            )}

            {!fromHistory && (
              <button onClick={resetApp} className="text-blue-600 font-medium text-sm flex items-center gap-1">
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Fighter Switcher (Segmented Control) */}
        <div className="px-6 pt-6 animate-fade-in">
          <div className="flex p-1 bg-gray-200/80 backdrop-blur-sm rounded-xl">
            {analysis.fighters.map((fighter, idx) => {
              const isActive = activeFighterIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveFighterIndex(idx)}
                  className={`
                    flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                    ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  <User size={14} />
                  <span className="truncate max-w-[100px]">{fighter.role || `Fighter ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 space-y-6 animate-fade-in">

          {/* Tarjeta Semáforo (Renderizar Tarjeta) */}
          <GlassCard className="overflow-hidden border-0 shadow-xl">
            <div className={`${bgHeader} p-6 flex flex-col items-center justify-center text-center gap-3`}>
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white shadow-inner">
                <StatusIcon size={32} strokeWidth={3} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${textHeader}`}>
                {verdictText}
              </h2>
              <p className="text-white/90 text-sm font-medium px-4 leading-relaxed">
                {activeData.summary}
              </p>
            </div>

            {/* Detalles Técnicos */}
            <div className="p-5 bg-white space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current/Detected Techniques</h3>
                <div className="flex flex-wrap gap-2">
                  {activeData.techniques.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Feedback Detallado */}
          <div className="grid grid-cols-1 gap-4">
            {activeData.mistakes.length > 0 && (
              <GlassCard className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
                <h3 className="flex items-center gap-2 font-semibold text-red-700 text-sm mb-2">
                  <AlertCircle size={16} />
                  Critical Mistakes
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {activeData.mistakes.map((m, i) => (
                    <li key={i} className="text-sm text-gray-700">{m}</li>
                  ))}
                </ul>
              </GlassCard>
            )}

            <GlassCard className="p-4 border-l-4 border-l-green-500 bg-green-50/50">
              <h3 className="flex items-center gap-2 font-semibold text-green-700 text-sm mb-2">
                <Zap size={16} />
                Improvement Plan
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {activeData.tips.map((t, i) => (
                  <li key={i} className="text-sm text-gray-700">{t}</li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Secondary Actions (Enable Buttons) */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pl-1">Learning Resources</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="glass"
                className="h-auto py-3 flex-col gap-1"
                icon={<BookOpen size={20} />}
                onClick={() => activeData.reference && setShowReferenceModal(true)}
                disabled={!activeData.reference}
              >
                <span className="text-xs">Technical Manual</span>
              </Button>
              <Button
                variant="glass"
                className="h-auto py-3 flex-col gap-1"
                icon={<Youtube size={20} />}
                onClick={handleOpenVideoReference}
                disabled={!activeData.youtube_query}
              >
                <span className="text-xs">Reference Video</span>
              </Button>
            </div>
          </div>

          {/* Grounding Sources */}
          {analysis.groundingSources && analysis.groundingSources.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pl-1 flex items-center gap-1">
                <Globe size={12} />
                Verified Sources (Google)
              </h3>
              <div className="flex flex-col gap-2">
                {analysis.groundingSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <GlassCard className="p-3 flex items-center justify-between group hover:bg-white/90 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Globe size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate pr-4">
                            {source.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {new URL(source.url).hostname}
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-gray-400 shrink-0 group-hover:text-blue-500" />
                    </GlassCard>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>

        <div className="sticky bottom-6 px-6 z-20">
          <Button variant="secondary" fullWidth onClick={resetApp} icon={<RotateCcw size={16} />}>
            {fromHistory ? "Back to History" : "New Audit"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[100dvh] bg-white overflow-hidden relative">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-50 p-4 bg-red-500/90 backdrop-blur-md text-white rounded-2xl text-sm shadow-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto font-bold">✕</button>
        </div>
      )}

      {view === 'home' && (
        <div className="w-full h-full max-w-lg mx-auto">
          {renderHome()}
        </div>
      )}
      {view === 'history' && (
        <div className="w-full h-full max-w-lg mx-auto bg-[#f2f2f7]">
          {renderHistory()}
        </div>
      )}
      {view === 'record' && renderRecorder()}
      {view === 'preview' && (
        <div className="w-full h-full max-w-lg mx-auto">
          {renderPreview()}
        </div>
      )}
      {view === 'uploading' && renderUploading()}
      {view === 'analyzing' && <AnalyzingView executionTime={executionTime} onCancel={handleCancelAnalysis} />}
      {view === 'result' && (
        <div className="w-full h-full max-w-lg mx-auto bg-[#f2f2f7]">
          {renderResult()}
        </div>
      )}

      {/* Settings Modal (API Key Entry) */}
      {(showSettingsModal || apiKeyMissing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-800">
                <Lock size={18} />
                <span className="font-bold text-sm">Configuración de API Key</span>
              </div>
              {!apiKeyMissing && (
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-505 leading-relaxed">
                Para interactuar con los servicios de inteligencia artificial localmente en tu navegador, necesitas configurar tu clave API de Gemini. 
                Se guardará localmente de forma segura en tu navegador.
              </p>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <Button 
                fullWidth 
                onClick={() => handleSaveApiKey(apiKeyInput)} 
                disabled={!apiKeyInput.trim()}
              >
                Guardar Clave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;