/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Wilmer Salamanca
 * 
 * PARTE 8 - VERSIÓN FINAL
 * 
 * Sistema de Dispersión Geométrica Orbital:
 * - Órbita generada con algoritmo de Punto Medio
 * - Líneas generadas con algoritmo de Bresenham
 * - Distribución uniforme mediante trigonometría
 * - Polígonos generados a partir de vértices
 * 
 * Restricción cumplida:
 * Solo se utiliza plotPixel para dibujar en el canvas.
 */

// ======================================================
// CONFIGURACIÓN DEL CANVAS
// ======================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/**
 * Centro del sistema orbital
 */
const centerX = Math.floor(canvas.width / 2);
const centerY = Math.floor(canvas.height / 2);

// ======================================================
// PARÁMETROS DEL SISTEMA (ALEATORIOS)
// ======================================================

/**
 * R: radio de la órbita
 * N: número de polígonos (4 a 10)
 * k: número de lados de cada polígono
 */
const R = Math.floor(Math.random() * 100) + 120;
const N = Math.floor(Math.random() * 7) + 4;
const k = Math.floor(Math.random() * 5) + 3;

/**
 * Ajuste automático del tamaño del polígono
 * para evitar superposición entre ellos.
 */
const polygonRadius = Math.floor(R / (N + 2));

// ======================================================
// FUNCIÓN BASE: PLOT PIXEL
// ======================================================

/**
 * Dibuja un píxel en el canvas.
 * Es la única función permitida para renderizar.
 */
function plotPixel(ctx, x, y, color = "#000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// ======================================================
// ALGORITMO DE PUNTO MEDIO (CIRCUNFERENCIA)
// ======================================================

/**
 * Dibuja una circunferencia usando el algoritmo de punto medio.
 * 
 * Usa un parámetro de decisión (p) para determinar
 * si el siguiente punto debe moverse solo en x o en x e y.
 */
function midpointCircle(cx, cy, r, color = "#ccc") {

    let x = 0;
    let y = r;
    let p = 1 - r;

    while (x <= y) {

        // Simetría en 8 octantes
        plotPixel(ctx, cx + x, cy + y, color);
        plotPixel(ctx, cx - x, cy + y, color);
        plotPixel(ctx, cx + x, cy - y, color);
        plotPixel(ctx, cx - x, cy - y, color);

        plotPixel(ctx, cx + y, cy + x, color);
        plotPixel(ctx, cx - y, cy + x, color);
        plotPixel(ctx, cx + y, cy - x, color);
        plotPixel(ctx, cx - y, cy - x, color);

        x++;

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
 * Dibuja una línea entre dos puntos.
 * 
 * Utiliza un error acumulado (err) como parámetro de decisión.
 * Funciona en todos los octantes.
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
 * Calcula posiciones equidistantes sobre una circunferencia.
 * 
 * θ = 2πi / n
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
// GENERACIÓN DE POLÍGONOS
// ======================================================

/**
 * Genera los vértices de un polígono regular.
 */
function getPolygonVertices(cx, cy, radius, sides) {

    let vertices = [];

    for (let i = 0; i < sides; i++) {

        let angle = (2 * Math.PI * i) / sides;

        let x = cx + radius * Math.cos(angle);
        let y = cy + radius * Math.sin(angle);

        vertices.push({
            x: Math.round(x),
            y: Math.round(y)
        });
    }

    return vertices;
}

// ======================================================
// DIBUJO DE POLÍGONOS
// ======================================================

/**
 * Conecta los vértices usando Bresenham.
 */
function drawPolygon(vertices, color = "#000") {

    for (let i = 0; i < vertices.length; i++) {

        let p1 = vertices[i];
        let p2 = vertices[(i + 1) % vertices.length];

        bresenhamLine(p1.x, p1.y, p2.x, p2.y, color);
    }
}

// ======================================================
// RENDER PRINCIPAL
// ======================================================

/**
 * Función principal del sistema.
 * Dibuja la órbita y los polígonos distribuidos.
 */
function drawScene() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Órbita principal (tenue)
    midpointCircle(centerX, centerY, R, "#bbb");

    // Obtener centros
    const centers = getOrbitalPositions(R, N);

    // Dibujar polígonos
    centers.forEach(c => {

        const vertices = getPolygonVertices(
            c.x,
            c.y,
            polygonRadius,
            k
        );

        drawPolygon(vertices, "#111");
    });
}

// ======================================================
// EJECUCIÓN
// ======================================================

drawScene();
