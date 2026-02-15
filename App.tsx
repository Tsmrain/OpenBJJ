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
  Calendar,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Award,
  Timer,
  BrainCircuit,
  Quote
} from 'lucide-react';
import Button from './components/Button';
import GlassCard from './components/GlassCard';
import { analyzeBJJVideo } from './services/geminiService';
import { saveAnalysisToHistory, getAnalysisHistory, deleteAnalysisFromHistory } from './services/historyService';
import { AnalysisResult, AppView, VideoState, FighterAnalysis } from './types';

// Constants
const MAX_DURATION_SEC = 45;

// --- Sub-component for Analyzing View (Simplified) ---
const AnalyzingView: React.FC<{ executionTime: number }> = ({ executionTime }) => {
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

        <h2 className="text-xl font-bold text-gray-900 mb-2">Analizando Video</h2>
        <p className="text-gray-500 text-sm mb-6">Consultando base de conocimiento...</p>

        {/* Live Timer */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full font-mono text-xs text-gray-500 border border-gray-200">
          <Timer size={12} className="text-gray-400" />
          {executionTime.toFixed(1)}s
        </div>
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
      setError("No se pudo eliminar el registro del historial.");
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
      setError("No se puede acceder a la cámara. Revisa los permisos.");
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

    try {
      const result = await analyzeBJJVideo(videoState.blob);

      // Stop Timer
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      setExecutionTime((Date.now() - startTime) / 1000); // Set final precise time

      setAnalysis(result);
      setActiveFighterIndex(0); // Reset to first fighter
      setFromHistory(false);
      setView('result');

      // 3. Guardado Local (LocalStorage)
      saveAnalysisToHistory(result);

    } catch (err) {
      if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
      setError("La auditoría técnica falló. Intenta nuevamente.");
      setView('preview');
    }
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

  const renderHome = () => (
    <div className="flex flex-col h-full p-6 animate-fade-in">
      <header className="mb-12 mt-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">OpenBJJ</h1>
        <p className="text-gray-500 mt-2 text-lg">Auditoría Técnica de Jiu-Jitsu</p>
      </header>

      <div className="flex-1 flex flex-col gap-6 justify-center">
        <GlassCard
          onClick={handleStartCamera}
          className="p-8 flex flex-col items-center justify-center gap-4 h-48 group hover:bg-white/80 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-active:scale-90 transition-transform">
            <Camera size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Grabar Entrenamiento</h2>
          <p className="text-gray-400 text-sm">Cámara Segura (Máx 45s)</p>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-40">
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileUpload}
            />
            <GlassCard className="p-4 flex flex-col items-center justify-center gap-3 h-full group hover:bg-white/80 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <h2 className="font-semibold text-gray-800 text-sm">Subir Video</h2>
              </div>
            </GlassCard>
          </div>

          <GlassCard
            onClick={loadHistory}
            className="p-4 flex flex-col items-center justify-center gap-3 h-40 group hover:bg-white/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <History size={24} />
            </div>
            <div className="text-center">
              <h2 className="font-semibold text-gray-800 text-sm">Historial</h2>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="mt-auto flex justify-center gap-2 text-gray-400 text-xs items-center">
        <Lock size={12} />
        <span>End-to-End Privacy (Local)</span>
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
          <h2 className="text-xl font-bold ml-2 text-gray-900">Historial</h2>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Simple List */}
          <div className="p-4 space-y-3">

            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400">Cargando...</p>
              </div>
            ) : historyList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center p-6">
                <History size={32} className="text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium text-sm">No hay historial aún</p>
                <p className="text-xs text-gray-400 mt-1">Tus análisis recientes aparecerán aquí.</p>
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
                        title="Eliminar del historial"
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
                            {fighter.techniques.slice(0, 2).join(", ") || "Análisis general"}
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
        <h2 className="text-xl font-bold ml-2 text-gray-900">Validar Carga</h2>
      </header>

      {isCompressing ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-200 ease-out"
              style={{ width: `${compressionProgress}%` }}
            />
          </div>
          <p className="text-gray-500 font-medium animate-pulse">Optimizando buffer (RAM)...</p>
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
              Listo para auditar
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <GlassCard className="p-4 flex gap-4 items-center bg-blue-50/50 border-blue-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Validación Exitosa</h3>
                <p className="text-gray-500 text-xs">Duración válida. Compresión lista.</p>
              </div>
              <CheckCircle2 size={20} className="text-green-500 ml-auto" />
            </GlassCard>

            <Button fullWidth onClick={handleAnalyze} icon={<CloudLightning size={18} />}>
              Ejecutar Auditoría Técnica
            </Button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <Lock size={10} /> Tus datos serán borrados tras el análisis
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Transmisión Segura</h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto mb-4">
        Subiendo a bucket temporal encriptado...
      </p>
      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
        <Lock size={12} /> Canal TLS 1.3
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
    const verdictText = isApproved ? 'TÉCNICA APROBADA' : 'REQUIERE CORRECCIÓN';

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
                  <span className="font-bold text-sm">Referencia Bibliográfica</span>
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Libro</p>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {activeData.reference.book}
                  </h3>
                </div>

                <div className="flex gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cinturón</p>
                    <p className="font-medium text-gray-700">{activeData.reference.chapter}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tabla de Contenidos</p>
                    <p className="font-medium text-gray-700">{activeData.reference.page}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex gap-2 mb-2">
                    <Bookmark size={16} className="text-blue-500 shrink-0" />
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Concepto Clave</p>
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    "{activeData.reference.quote}"
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <Button fullWidth onClick={() => setShowReferenceModal(false)} variant="secondary">
                  Cerrar Referencia
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
            <span className="font-bold text-gray-900">Diagnóstico</span>
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
                Borrar
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
                  <span className="truncate max-w-[100px]">{fighter.role || `Luchador ${idx + 1}`}</span>
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
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Técnicas Detectadas</h3>
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
                  Errores Críticos
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
                Plan de Mejora
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {activeData.tips.map((t, i) => (
                  <li key={i} className="text-sm text-gray-700">{t}</li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Acciones Secundarias (Habilitar Botones) */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pl-1">Recursos de Aprendizaje</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="glass"
                className="h-auto py-3 flex-col gap-1"
                icon={<BookOpen size={20} />}
                onClick={() => setShowReferenceModal(true)}
              >
                <span className="text-xs">Manual Técnico</span>
              </Button>
              <Button
                variant="glass"
                className="h-auto py-3 flex-col gap-1"
                icon={<Youtube size={20} />}
                onClick={handleOpenVideoReference}
              >
                <span className="text-xs">Video Referencia</span>
              </Button>
            </div>
          </div>

          {/* Grounding Sources */}
          {analysis.groundingSources && analysis.groundingSources.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pl-1 flex items-center gap-1">
                <Globe size={12} />
                Fuentes Verificadas (Google)
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

          <div className="h-8" />
        </div>

        <div className="sticky bottom-6 px-6 z-20">
          <Button variant="secondary" fullWidth onClick={resetApp} icon={<RotateCcw size={16} />}>
            {fromHistory ? "Volver al Historial" : "Nueva Auditoría"}
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
      {view === 'analyzing' && <AnalyzingView executionTime={executionTime} />}
      {view === 'result' && (
        <div className="w-full h-full max-w-lg mx-auto bg-[#f2f2f7]">
          {renderResult()}
        </div>
      )}
    </div>
  );
};

export default App;