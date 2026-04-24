/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Wilmer Salamanca
 * 
 * PARTE 4 (DOCUMENTADA):
 * Mejora en la claridad, comentarios técnicos y organización del código.
 * 
 * En esta fase ya se cuenta con:
 * - Dibujo de píxeles (plotPixel)
 * - Circunferencia con algoritmo de Punto Medio
 * - Líneas con algoritmo de Bresenham
 * - Distribución orbital mediante trigonometría
 */

// ======================================================
// CONFIGURACIÓN DEL CANVAS
// ======================================================

/**
 * Se obtiene el elemento canvas del DOM y su contexto 2D.
 * Este contexto es el que permite dibujar en pantalla.
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/**
 * Se calculan las coordenadas del centro del canvas.
 * Estas coordenadas serán el origen de la órbita.
 */
const centerX = Math.floor(canvas.width / 2);
const centerY = Math.floor(canvas.height / 2);

// ======================================================
// PARÁMETROS DEL SISTEMA (GENERADOS ALEATORIAMENTE)
// ======================================================

/**
 * R: radio de la órbita principal
 * N: número de polígonos distribuidos sobre la órbita
 * k: número de lados de cada polígono
 * 
 * Estos valores cumplen con la restricción del enunciado:
 * deben ser generados aleatoriamente dentro de ciertos rangos.
 */
const R = Math.floor(Math.random() * 100) + 120; // radio entre 120 y 220
const N = Math.floor(Math.random() * 7) + 4;     // entre 4 y 10
const k = Math.floor(Math.random() * 5) + 3;     // entre 3 y 7 lados

// ======================================================
// FUNCIÓN BASE: DIBUJO DE PÍXEL
// ======================================================

/**
 * plotPixel:
 * Es la única función autorizada para interactuar con el canvas.
 * 
 * @param {CanvasRenderingContext2D} ctx - contexto del canvas
 * @param {number} x - coordenada horizontal
 * @param {number} y - coordenada vertical
 * @param {string} color - color del píxel
 * 
 * Se redondean las coordenadas para evitar errores de precisión.
 */
function plotPixel(ctx, x, y, color = "#000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// ======================================================
// ALGORITMO DE PUNTO MEDIO (CIRCUNFERENCIA)
// ======================================================

/**
 * midpointCircle:
 * Dibuja una circunferencia utilizando el algoritmo de punto medio.
 * 
 * Este algoritmo evita el uso de funciones trigonométricas
 * y se basa en un parámetro de decisión (p).
 * 
 * @param {number} cx - centro en x
 * @param {number} cy - centro en y
 * @param {number} r - radio
 * @param {string} color - color de la circunferencia
 */
function midpointCircle(cx, cy, r, color = "#aaa") {

    let x = 0;
    let y = r;

    /**
     * Parámetro de decisión inicial:
     * Determina si el siguiente punto está dentro o fuera del círculo.
     */
    let p = 1 - r;

    /**
     * Se recorre solo un octante y se replica en los otros 7
     * usando simetría.
     */
    while (x <= y) {

        // Simetría en los 8 octantes
        plotPixel(ctx, cx + x, cy + y, color);
        plotPixel(ctx, cx - x, cy + y, color);
        plotPixel(ctx, cx + x, cy - y, color);
        plotPixel(ctx, cx - x, cy - y, color);

        plotPixel(ctx, cx + y, cy + x, color);
        plotPixel(ctx, cx - y, cy + x, color);
        plotPixel(ctx, cx + y, cy - x, color);
        plotPixel(ctx, cx - y, cy - x, color);

        x++;

        /**
         * Actualización del parámetro de decisión:
         * - Si p < 0 → el punto está dentro → solo se incrementa x
         * - Si p >= 0 → se ajusta también y
         */
        if (p < 0) {
            p += 2 * x + 1;
        } else {
            y--;
            p += 2 * (x - y) + 1;
        }
    }
}

// ======================================================
// ALGORITMO DE BRESENHAM (LÍNEAS)
// ======================================================

/**
 * bresenhamLine:
 * Dibuja una línea entre dos puntos usando el algoritmo de Bresenham.
 * 
 * Este algoritmo es eficiente porque solo utiliza operaciones enteras.
 * Funciona para cualquier pendiente (todos los octantes).
 * 
 * @param {number} x0 - punto inicial en x
 * @param {number} y0 - punto inicial en y
 * @param {number} x1 - punto final en x
 * @param {number} y1 - punto final en y
 * @param {string} color - color de la línea
 */
function bresenhamLine(x0, y0, x1, y1, color = "#000") {

    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;

    /**
     * Parámetro de decisión:
     * Representa el error acumulado entre la línea ideal y la rasterizada.
     */
    let err = dx - dy;

    while (true) {

        plotPixel(ctx, x0, y0, color);

        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * err;

        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

// ======================================================
// POSICIONES ORBITALES (TRIGONOMETRÍA)
// ======================================================

/**
 * getOrbitalPositions:
 * Calcula las posiciones equidistantes sobre una circunferencia.
 * 
 * Se utiliza trigonometría para distribuir los puntos de manera uniforme:
 * 
 * x = cx + r * cos(θ)
 * y = cy + r * sin(θ)
 * 
 * @param {number} r - radio de la órbita
 * @param {number} n - número de puntos
 * @returns {Array} arreglo de objetos {x, y}
 */
function getOrbitalPositions(r, n) {

    let positions = [];

    for (let i = 0; i < n; i++) {

        let angle = (2 * Math.PI * i) / n;

        let x = centerX + r * Math.cos(angle);
        let y = centerY + r * Math.sin(angle);

        positions.push({
            x: Math.round(x),
            y: Math.round(y)
        });
    }

    return positions;
}

// ======================================================
// RENDER PRINCIPAL
// ======================================================

/**
 * drawScene:
 * Función principal que renderiza todos los elementos en el canvas.
 */
function drawScene() {

    // Limpieza del canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujo de la órbita
    midpointCircle(centerX, centerY, R, "#555");

    // Cálculo de posiciones
    const centers = getOrbitalPositions(R, N);

    // Visualización temporal de centros
    centers.forEach(c => {
        plotPixel(ctx, c.x, c.y, "red");
    });
}

// Ejecución inicial
drawScene();
