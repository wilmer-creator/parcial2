/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Wilmer Salamanca
 * 
 * PARTE 6:
 * Integración completa del sistema:
 * - Generación de polígonos
 * - Trazado de sus lados con Bresenham
 * - Composición orbital final
 */

// ======================================================
// CONFIGURACIÓN DEL CANVAS
// ======================================================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const centerX = Math.floor(canvas.width / 2);
const centerY = Math.floor(canvas.height / 2);

// ======================================================
// PARÁMETROS ALEATORIOS
// ======================================================
const R = Math.floor(Math.random() * 100) + 120;
const N = Math.floor(Math.random() * 7) + 4;
const k = Math.floor(Math.random() * 5) + 3;

// ======================================================
// FUNCIÓN BASE
// ======================================================
function plotPixel(ctx, x, y, color = "#000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// ======================================================
// CIRCUNFERENCIA (PUNTO MEDIO)
// ======================================================
function midpointCircle(cx, cy, r, color = "#aaa") {

    let x = 0;
    let y = r;
    let p = 1 - r;

    while (x <= y) {

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
// BRESENHAM (LÍNEAS)
// ======================================================
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
// POSICIONES ORBITALES
// ======================================================
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
// POLÍGONOS (VÉRTICES)
// ======================================================
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
// NUEVA FUNCIÓN: DIBUJAR POLÍGONO
// ======================================================

/**
 * drawPolygon:
 * Conecta los vértices de un polígono usando Bresenham.
 * 
 * Se recorre el arreglo y se conecta cada punto con el siguiente.
 * El último vértice se conecta con el primero para cerrar la figura.
 * 
 * @param {Array} vertices - arreglo de puntos {x, y}
 */
function drawPolygon(vertices, color = "#000") {

    for (let i = 0; i < vertices.length; i++) {

        let p1 = vertices[i];
        let p2 = vertices[(i + 1) % vertices.length];

        bresenhamLine(p1.x, p1.y, p2.x, p2.y, color);
    }
}

// ======================================================
// RENDER FINAL
// ======================================================
function drawScene() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar órbita (tenue)
    midpointCircle(centerX, centerY, R, "#888");

    // Centros de polígonos
    const centers = getOrbitalPositions(R, N);

    // Dibujar cada polígono
    centers.forEach(c => {

        const vertices = getPolygonVertices(c.x, c.y, 20, k);

        drawPolygon(vertices, "#000");
    });
}

// Ejecutar sistema
drawScene();
