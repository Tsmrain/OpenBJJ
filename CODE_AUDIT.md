# Auditoría Técnica y de Arquitectura: OpenBJJ AI

Este documento detalla la implementación actual del proyecto para facilitar la continuación del desarrollo o la auditoría por parte de otros agentes de IA.

---

## 1. Lógica de Video (Core Business)

### Selección de Frames
- **Estrategia:** Muestreo Uniforme (Uniform Sampling).
- **Implementación:** `services/geminiService.ts`
- **Lógica:** No se toman los primeros 12 segundos. Se divide la duración total del video (`video.duration`) en 12 segmentos iguales y se extrae un frame de cada punto temporal (`currentTime = i * interval`).
- **Resultado:** Garantiza que el modelo "vea" el inicio, desarrollo y final de la técnica, sin importar si el video dura 10s o 50s.

### Optimización de Imagen
- **Redimensionamiento:** 512px (Max Width/Height).
- **Código:**
  ```typescript
  const scale = Math.min(512 / video.videoWidth, 1);
  canvas.width = video.videoWidth * scale; // Mantiene aspect ratio
  ```
- **Formato:** JPEG con calidad 0.5 (50%).
- **Impacto:** Reduce el payload de ~10MB (video HD) a <400KB (12 imágenes comprimidas), permitiendo funcionamiento en redes móviles 4G.

---

## 2. Inteligencia Artificial (Prompt Engineering)

### Contexto y Personalidad
- **Persona:** Saulo Ribeiro (Jiu-Jitsu University).
- **Fuente de Verdad:** Se ha inyectado la Tabla de Contenidos completa del libro (ISBN: 978-0-9815044-2-9) en el `systemInstruction` del modelo.
- **Terminología:** El prompt fuerza el uso de nomenclatura técnica específica (e.g., "X-Guard", "De La Riva", "Torreando Pass") basada en el libro.

### Estructura de Datos (JSON Schema)
- **Modelo:** Gemini 2.0 Flash (`gemini-2.0-flash`).
- **Schema:** Strict Object.
- **Campos Clave:**
  - `status`: Enum estricto `["approved", "correction_needed"]`.
  - `reference`: Objeto anidado que exige `book`, `chapter`, `page` y `quote`.
- **Prevención de Alucinaciones:** El schema rígido reduce la "creatividad" no deseada del modelo. Sin embargo, **Mejora Pendiente:** Actualmente no hay un `fallback` explícito si el video no contiene BJJ (ej. un video de un gato). El modelo intentará analizarlo como BJJ.

---

## 3. Seguridad y Costos

### API Key (Riesgo Actual)
- **Estado:** ⚠️ **Expuesta en Cliente**.
- **Detalle:** La variable `VITE_API_KEY` se compila en el bundle de JavaScript que se envía al navegador del usuario.
- **Mitigación para Prod:** Se requiere migrar la llamada a `analyzeBJJVideo` a una **Serverless Function (Vercel API Route)** para ocultar la key.
- **Estado Actual:** Aceptable para MVP/Testing controlado.

### Control de Flujo (Debounce)
- **Mecanismo:** "UI Unmount".
- **Lógica:** Al hacer click en "Analizar", la función `handleAnalyze` cambia inmediatamente el estado de la vista (`setView('uploading')`), desmontando el botón del DOM instantáneamente. Esto previene doble submit por clicks rápidos.

---

## 4. Calidad de Código y Escalabilidad

### Estructura
- **Patrón:** Service-based (Separación de UI lógica y servicios de datos).
- **Deuda Técnica:**
  - `console.log` de métricas de tokens activo en producción (útil para auditoría de costos, pero debe eliminarse después).
  - Estilos Tailwind repetitivos en componentes UI (deberían extraerse a componentes `Button` reutilizables en todos los casos).

### Integración Futura: Supabase
- **Compatibilidad:** Alta.
- **Estrategia:** El archivo `services/historyService.ts` actúa como una interfaz.
- **Pasos para Migrar:**
  1. No tocar la UI (`App.tsx`).
  2. Reescribir `services/historyService.ts`.
  3. Reemplazar `db.put('analyses', ...)` con `supabase.from('audits').insert(...)`.
  4. La aplicación es agnóstica a la base de datos subyacente.

---

## Anexo: Métricas de Costo Gemini 2.0 Flash
- **Input:** ~4,200 tokens/video (12 frames + contexto libro).
- **Output:** ~500 tokens/video (JSON).
- **Costo Est:** ~$0.00062 USD por análisis.
