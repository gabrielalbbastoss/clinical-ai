import { useState, useRef, useCallback, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BookOpen,
  Settings,
  Activity,
  Upload,
  FileAudio,
  X,
  Play,
  Pause,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  FileText,
  Brain,
  Tag,
  Zap,
  BookMarked,
  GitBranch,
  Lightbulb,
  BarChart2,
  Microscope,
  Link2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

// ─── Nav ───────────────────────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Pacientes" },
  { icon: CalendarDays, label: "Sessões", active: true },
  { icon: BookOpen, label: "Biblioteca Científica" },
  { icon: Settings, label: "Configurações" },
];

// ─── Patient ───────────────────────────────────────────────────────────────────
const patient = {
  name: "Mariana Fonseca",
  code: "PAC-0041",
  lastSession: "31 jul 2026",
  initials: "MF",
  goals: ["Redução da ansiedade", "Regulação emocional", "Assertividade", "Flexibilidade cognitiva"],
};

// ─── Engine steps ──────────────────────────────────────────────────────────────
const ENGINE_STEPS = [
  { id: 0, icon: FileText,   label: "Transcrição",                       detail: "Convertendo áudio em texto clínico" },
  { id: 1, icon: Users,      label: "Atualização do histórico",           detail: "Integrando dados ao prontuário" },
  { id: 2, icon: Tag,        label: "Identificação de temas principais",  detail: "Mapeando conteúdos temáticos" },
  { id: 3, icon: Brain,      label: "Comportamentos relevantes",          detail: "Detectando padrões comportamentais" },
  { id: 4, icon: GitBranch,  label: "Análise funcional",                  detail: "Construindo relações A-B-C" },
  { id: 5, icon: Zap,        label: "Identificação de CRB1 e CRB2",       detail: "Classificando comportamentos clinicamente relevantes" },
  { id: 6, icon: Lightbulb,  label: "Sugestão de intervenções",           detail: "Gerando hipóteses de intervenção" },
  { id: 7, icon: BookMarked, label: "Consulta à biblioteca científica",   detail: "Buscando evidências e referências" },
  { id: 8, icon: Link2,      label: "Correlação teórica",                 detail: "Construindo fundamentação teórica" },
  { id: 9, icon: BarChart2,  label: "Geração do relatório",               detail: "Compilando documento clínico final" },
];

type StepStatus = "waiting" | "processing" | "done";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── Step card ─────────────────────────────────────────────────────────────────
function StepCard({
  step,
  status,
  progress,
  isLast,
}: {
  step: (typeof ENGINE_STEPS)[0];
  status: StepStatus;
  progress: number;
  isLast: boolean;
}) {
  const Icon = step.icon;
  const isDone = status === "done";
  const isProc = status === "processing";

  return (
    <div
      className={`relative bg-white rounded-xl border transition-all duration-300 p-4
        ${isProc ? "border-[#2563EB] shadow-sm shadow-blue-100" : "border-[rgba(15,17,23,0.08)]"}
        ${isDone ? "opacity-80" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon badge */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300
            ${isDone ? "bg-[#ECFDF5]" : isProc ? "bg-[#EEF3FD]" : "bg-[#F7F8FA]"}`}
        >
          {isDone ? (
            <CheckCircle2 size={15} color="#059669" strokeWidth={2.5} />
          ) : isProc ? (
            <Loader2 size={15} color="#2563EB" strokeWidth={2.5} className="animate-spin" />
          ) : (
            <Icon size={15} color="#CBD5E1" strokeWidth={2} />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span
              className={`text-[13px] font-semibold transition-colors duration-300
                ${isDone ? "text-[#0F1117]" : isProc ? "text-[#2563EB]" : "text-[#9CA3AF]"}`}
            >
              {step.label}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 transition-all duration-300
                ${isDone ? "bg-[#ECFDF5] text-[#059669]" : isProc ? "bg-[#EEF3FD] text-[#2563EB]" : "bg-[#F0F2F5] text-[#CBD5E1]"}`}
            >
              {isDone ? "Concluído" : isProc ? "Em processamento" : "Aguardando"}
            </span>
          </div>

          {(isProc || isDone) && (
            <p className="text-[11.5px] text-[#6B7280] mb-2.5">{step.detail}</p>
          )}

          {/* Progress bar */}
          {(isProc || isDone) && (
            <div className="w-full h-1 bg-[#F0F2F5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${isDone ? 100 : progress}%`,
                  background: isDone ? "#059669" : "#2563EB",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeNav, setActiveNav] = useState("Sessões");

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Engine state
  const [processing, setProcessing] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    ENGINE_STEPS.map(() => "waiting")
  );
  const [stepProgress, setStepProgress] = useState<number[]>(ENGINE_STEPS.map(() => 0));
  const [done, setDone] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  // Simulated audio duration
  const duration = file ? 2940 : 0; // 49:00

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) acceptFile(f);
  }, []);

  const acceptFile = (f: File) => {
    setFile(f);
    setUploaded(false);
    setUploadProgress(0);
    setProcessing(false);
    setDone(false);
    setCurrentStep(-1);
    setStepStatuses(ENGINE_STEPS.map(() => "waiting"));
    setStepProgress(ENGINE_STEPS.map(() => 0));
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploading(true);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setUploading(false);
        setUploaded(true);
      }
      setUploadProgress(Math.min(p, 100));
    }, 120);
  };

  // ── Engine simulation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!processing) return;

    let stepIdx = 0;

    const runStep = () => {
      if (stepIdx >= ENGINE_STEPS.length) {
        setDone(true);
        setProcessing(false);
        return;
      }

      setCurrentStep(stepIdx);
      setStepStatuses((prev) => {
        const n = [...prev];
        n[stepIdx] = "processing";
        return n;
      });

      // Animate bar 0→100 over ~1.8s
      let prog = 0;
      const barIv = setInterval(() => {
        prog += Math.random() * 14 + 8;
        if (prog >= 100) prog = 100;
        setStepProgress((prev) => {
          const n = [...prev];
          n[stepIdx] = prog;
          return n;
        });
        if (prog >= 100) {
          clearInterval(barIv);
          setStepStatuses((prev) => {
            const n = [...prev];
            n[stepIdx] = "done";
            return n;
          });
          stepIdx++;
          setTimeout(runStep, 260);
        }
      }, 90);
    };

    runStep();
  }, [processing]);

  const handleProcess = () => {
    if (!uploaded || processing || done) return;
    setProcessing(true);
  };

  return (
    <div
      className="flex h-screen w-full overflow-hidden bg-[#F7F8FA]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside className="flex flex-col w-60 shrink-0 bg-white border-r border-[rgba(15,17,23,0.08)] py-6 px-3">
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <Activity size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#0F1117]">ClinicalAI</span>
        </div>

        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(({ icon: Icon, label }) => {
            const isActive = activeNav === label;
            return (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 text-left w-full
                  ${isActive ? "bg-[#EEF3FD] text-[#2563EB]" : "text-[#6B7280] hover:bg-[#F7F8FA] hover:text-[#0F1117]"}`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#2563EB" : "currentColor"} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pt-4 border-t border-[rgba(15,17,23,0.08)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[11px] font-semibold text-[#1D4ED8]">DS</div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium text-[#0F1117]">Dra. Sofia Andrade</span>
              <span className="text-[11px] text-[#6B7280]">Psicóloga CRP</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ── Header ── */}
        <header className="bg-white border-b border-[rgba(15,17,23,0.08)] px-8 py-5 shrink-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <button className="flex items-center gap-1.5 text-[12.5px] text-[#6B7280] hover:text-[#2563EB] transition-colors font-medium">
              <ArrowLeft size={13} />
              Sessões
            </button>
            <ChevronRight size={12} color="#CBD5E1" />
            <span className="text-[12.5px] text-[#0F1117] font-medium">Nova Sessão</span>
          </div>

          {/* Patient strip */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#DBEAFE] flex items-center justify-center text-[14px] font-bold text-[#1D4ED8] shrink-0">
                {patient.initials}
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <h1 className="text-[17px] font-semibold text-[#0F1117] leading-none">{patient.name}</h1>
                  <span className="text-[11.5px] font-medium text-[#9CA3AF]" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {patient.code}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
                  <span className="text-[12px] text-[#6B7280]">
                    Última sessão: <span className="text-[#0F1117] font-medium">{patient.lastSession}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                  {patient.goals.map((g) => (
                    <span key={g} className="text-[11px] font-medium bg-[#EEF3FD] text-[#2563EB] px-2.5 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[12px] text-[#9CA3AF]">Sessão nº 19</span>
              <span className="text-[11px] font-medium bg-[#F0F2F5] text-[#6B7280] px-2.5 py-1 rounded-full">Agendada — 4 ago 2026</span>
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto px-8 py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-[1fr_1fr] gap-6 max-[1100px]:grid-cols-1 max-w-5xl">

            {/* ═══════════════ LEFT — Upload ═══════════════ */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <FileAudio size={15} color="#2563EB" />
                <h2 className="text-[14px] font-semibold text-[#0F1117]">Upload da Sessão</h2>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !file && inputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
                  ${dragging ? "border-[#2563EB] bg-[#EEF3FD]" : file ? "border-[rgba(15,17,23,0.10)] bg-white cursor-default" : "border-[rgba(15,17,23,0.13)] bg-white hover:border-[#2563EB] hover:bg-[#FAFBFF]"}
                `}
                style={{ minHeight: 200 }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) acceptFile(f); }}
                />

                {!file ? (
                  <div className="flex flex-col items-center gap-3 px-8 py-10 text-center select-none">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF3FD] flex items-center justify-center">
                      <Upload size={22} color="#2563EB" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0F1117]">Arraste o arquivo de áudio aqui</p>
                      <p className="text-[12.5px] text-[#9CA3AF] mt-1">MP3, M4A, WAV, OGG — até 500 MB</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                      className="mt-1 flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12.5px] font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Selecionar Arquivo
                    </button>
                  </div>
                ) : (
                  <div className="w-full px-6 py-6">
                    {/* File info row */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-lg bg-[#EEF3FD] flex items-center justify-center shrink-0">
                        <FileAudio size={18} color="#2563EB" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#0F1117] truncate">{file.name}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-[11.5px] text-[#6B7280]">
                          <span>{formatBytes(file.size)}</span>
                          {uploaded && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                              <span className="flex items-center gap-1">
                                <CalendarDays size={10} />
                                {fmtDuration(duration)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFile(null);
                          setUploadProgress(0);
                          setUploaded(false);
                          setUploading(false);
                          setProcessing(false);
                          setDone(false);
                          setCurrentStep(-1);
                          setStepStatuses(ENGINE_STEPS.map(() => "waiting"));
                          setStepProgress(ENGINE_STEPS.map(() => 0));
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0F2F5] text-[#9CA3AF] hover:text-[#6B7280] transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Upload progress */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11.5px] font-medium text-[#6B7280]">
                          {uploading ? "Enviando..." : "Upload concluído"}
                        </span>
                        <span className="text-[11.5px] font-semibold text-[#0F1117]">
                          {Math.round(uploadProgress)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-200"
                          style={{
                            width: `${uploadProgress}%`,
                            background: uploaded ? "#059669" : "#2563EB",
                          }}
                        />
                      </div>
                    </div>

                    {uploaded && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <CheckCircle2 size={13} color="#059669" strokeWidth={2.5} />
                        <span className="text-[12px] font-medium text-[#059669]">Pronto para processar</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Process button */}
              <button
                onClick={handleProcess}
                disabled={!uploaded || processing || done}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-200
                  ${uploaded && !processing && !done
                    ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-200 cursor-pointer"
                    : "bg-[#F0F2F5] text-[#CBD5E1] cursor-not-allowed"}`}
              >
                {processing ? (
                  <>
                    <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                    Processando sessão...
                  </>
                ) : done ? (
                  <>
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                    Sessão processada
                  </>
                ) : (
                  <>
                    <Microscope size={16} strokeWidth={2} />
                    Processar Sessão
                  </>
                )}
              </button>

              {/* Notes */}
              {!file && (
                <div className="bg-white rounded-xl border border-[rgba(15,17,23,0.08)] p-4">
                  <p className="text-[12px] font-semibold text-[#0F1117] mb-2">Antes de processar</p>
                  <ul className="flex flex-col gap-1.5">
                    {[
                      "Garanta que o áudio seja da sessão completa",
                      "Evite ruídos externos no arquivo",
                      "Formatos suportados: MP3, M4A, WAV, OGG",
                      "Tamanho máximo: 500 MB por sessão",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-[12px] text-[#6B7280]">
                        <span className="w-1 h-1 rounded-full bg-[#CBD5E1] mt-1.5 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Open report button */}
              {done && (
                <button className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-semibold bg-[#059669] hover:bg-[#047857] text-white shadow-sm shadow-green-200 transition-all duration-200">
                  <ExternalLink size={16} strokeWidth={2.5} />
                  Abrir Relatório
                </button>
              )}
            </div>

            {/* ═══════════════ RIGHT — Clinical Engine ═══════════════ */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Brain size={15} color="#7C3AED" />
                <h2 className="text-[14px] font-semibold text-[#0F1117]">Clinical Engine</h2>
                {processing && (
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-0.5 rounded-full ml-auto">
                    <Loader2 size={10} className="animate-spin" />
                    Analisando...
                  </span>
                )}
                {done && (
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full ml-auto">
                    <CheckCircle2 size={10} strokeWidth={2.5} />
                    Concluído
                  </span>
                )}
              </div>

              {/* Overall progress bar */}
              {(processing || done) && (
                <div className="bg-white rounded-xl border border-[rgba(15,17,23,0.08)] px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-[#6B7280]">Progresso total</span>
                    <span className="text-[12px] font-semibold text-[#0F1117]">
                      {stepStatuses.filter((s) => s === "done").length} / {ENGINE_STEPS.length}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(stepStatuses.filter((s) => s === "done").length / ENGINE_STEPS.length) * 100}%`,
                        background: done ? "#059669" : "linear-gradient(90deg, #7C3AED, #2563EB)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Step cards */}
              <div className="flex flex-col gap-2">
                {ENGINE_STEPS.map((step, i) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    status={stepStatuses[i]}
                    progress={stepProgress[i]}
                    isLast={i === ENGINE_STEPS.length - 1}
                  />
                ))}
              </div>

              {/* Report button below engine on right column too */}
              {done && (
                <button className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-semibold bg-[#059669] hover:bg-[#047857] text-white shadow-sm shadow-green-200 transition-all duration-200">
                  <ExternalLink size={16} strokeWidth={2.5} />
                  Abrir Relatório
                </button>
              )}
            </div>
          </div>

          <div className="h-8" />
        </main>
      </div>
    </div>
  );
}
