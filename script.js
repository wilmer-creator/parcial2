/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Wilmer Salamanca
 * 
 * PARTE 3:
 * Se agrega el algoritmo de Bresenham para líneas
 */

// Obtener canvas y contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Centro del canvas
const centerX = Math.floor(canvas.width / 2);
const centerY = Math.floor(canvas.height / 2);

// ================= FUNCIÓN BASE =================
function plotPixel(ctx, x, y, color = "#000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// ================= PARTE 1 (PRUEBA PIXELES) =================
plotPixel(ctx, 300, 300, "red");
plotPixel(ctx, 301, 300, "red");
plotPixel(ctx, 302, 300, "red");

plotPixel(ctx, 300, 301, "blue");
plotPixel(ctx, 300, 302, "blue");

// ================= PARTE 2 (CIRCUNFERENCIA) =================
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

// Dibujar circunferencia
midpointCircle(centerX, centerY, 150, "#555");

// ================= PARTE 3 (BRESENHAM) =================
/**
 * Algoritmo de Bresenham para líneas
 * 
 * Parámetro de decisión:
 * err = dx - dy
 * 
 * Se ajusta dependiendo de la dirección de la línea.
 * Funciona para todos los octantes.
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

// ================= PRUEBA DE LÍNEAS =================
// Líneas en distintas direcciones (valida todos los octantes)

bresenhamLine(100, 100, 500, 100, "red");     // horizontal
bresenhamLine(100, 100, 100, 500, "blue");    // vertical
bresenhamLine(100, 100, 500, 500, "green");   // diagonal positiva
bresenhamLine(500, 100, 100, 500, "purple");  // diagonal negativa
