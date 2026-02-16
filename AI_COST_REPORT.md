# Informe Técnico: Eficiencia y Costos de Análisis de Video con Gemini

**Fecha:** 15 de Febrero, 2026  
**Proyecto:** OpenBJJ (Análisis Técnico de Jiu-Jitsu)  
**Modelo Implementado:** `gemini-2.0-flash`

---

## 1. Arquitectura de Solución (Edge Processing)

En lugar de subir el archivo de video completo (lo cual consumiría ancho de banda y miles de tokens de video-procesamiento por segundo), se implementó una estrategia de **Extracción de Frames en Cliente**.

- **Entrada:** Video de ~45 segundos (grabado o subido).
- **Procesamiento Local:** El navegador extrae **12 imágenes (frames)** distribuidas uniformemente.
- **Optimización:**
  - Resolución: Escalada a **512px** (lado más largo).
  - Compresión: **JPEG (calidad 0.5)**.
  - Payload: Se envían solo estas 12 imágenes en Base64 + Prompt de Texto.

## 2. Análisis de Consumo de Tokens (Por Análisis)

### A. Tokens de Entrada (Input)
El costo principal proviene de las imágenes enviadas al modelo multimodal.

| Componente | Detalle | Tokens Aprox. |
| :--- | :--- | :--- |
| **Imágenes** | 12 frames x 258 tokens (standard image cost) | **3,096** |
| **Contexto** | Prompt del Sistema + Referencia Biblio. (Saulo Ribeiro) | ~800 |
| **Instrucciones** | Tarea específica + Schema JSON | ~300 |
| **TOTAL INPUT** | | **~4,200 Tokens** |

### B. Tokens de Salida (Output)
La respuesta es un objeto JSON estructurado estrictamente.

| Componente | Detalle | Tokens Aprox. |
| :--- | :--- | :--- |
| **Análisis** | JSON con fighters, techniques, mistakes, refs | **~400 - 600** |
| **TOTAL OUTPUT** | | **~500 Tokens** |

---

## 3. Estimación de Costos (USD)

*Nota: Precios estimados para Gemini 2.0 Flash (Tier Pay-as-you-go). Verificar precios vigentes en Google AI Studio.*

**Precios de Referencia (Flash Model):**
- **Input:** $0.10 / 1 millón de tokens
- **Output:** $0.40 / 1 millón de tokens

### Costo por 1 Análisis (Unitario)
- **Costo Input:** (4,200 / 1,000,000) * $0.10 = **$0.00042**
- **Costo Output:** (500 / 1,000,000) * $0.40 = **$0.00020**
- **TOTAL POR VIDEO:** **$0.00062 USD**

### Proyección de Escala
| Cantidad de Análisis | Costo Total Estimado |
| :--- | :--- |
| 1 Video | $0.00062 |
| 1,000 Videos | $0.62 |
| 10,000 Videos | $6.20 |

> **Conclusión:** El sistema es extremadamente rentable. Analizar 1,000 videos cuesta menos de 1 dólar.

---

## 4. Métricas de Rendimiento

- **Tiempo de Pre-procesado (Cliente):** ~500ms (Extracción de 12 frames).
- **Latencia de Inferencia (API Gemini 2.0 Flash):** ~1.5 - 3.5 segundos.
- **Tiempo Total (Usuario):** **~3 - 5 segundos**.

## 5. Optimizaciones Realizadas (Hacks de Ahorro)

1.  **Reducción de Resolución:** Dejamos de enviar imágenes 1080p. Al bajar a 512px, mantenemos la calidad suficiente para detectar llaves de brazo/pierna pero reducimos el payload base64 drásticamente.
2.  **Eliminación de Herramientas:** Se desactivó `googleSearch` (Grounding). Esto ahorra:
    -   Costos adicionales por búsqueda ($35 / 1k queries).
    -   Latencia extra de 1-2 segundos por "pensamiento" del modelo.
    -   Se confía en el "world knowledge" del modelo (que ya conoce el libro Jiu-Jitsu University).
3.  **JSON Schema Estricto:** Al forzar la estructura JSON, evitamos que el modelo "divague" o escriba párrafos largos innecesarios, ahorrando tokens de salida.
