/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Wilmer Salamanca
 * 
 * PARTE 2:
 * Se agrega el algoritmo de Punto Medio para circunferencia
 */

// Obtener canvas y contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Centro del canvas
const centerX = Math.floor(canvas.width / 2);
const centerY = Math.floor(canvas.height / 2);

// ================= FUNCIÓN BASE =================
/**
 * Única función autorizada para dibujar
 */
function plotPixel(ctx, x, y, color = "#000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// ================= PARTE 1 (PRUEBA) =================
plotPixel(ctx, 300, 300, "red");
plotPixel(ctx, 301, 300, "red");
plotPixel(ctx, 302, 300, "red");

plotPixel(ctx, 300, 301, "blue");
plotPixel(ctx, 300, 302, "blue");

// ================= NUEVA FUNCIONALIDAD =================
/**
 * Algoritmo de Punto Medio para circunferencia
 * 
 * Parámetro de decisión:
 * p = 1 - r
 * 
 * Si p < 0 → el punto está dentro → solo aumenta x
 * Si p >= 0 → se ajusta y (y--) además de x
 */
function midpointCircle(cx, cy, r, color = "#aaa") {

    let x = 0;
    let y = r;
    let p = 1 - r;

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

        if (p < 0) {
            p += 2 * x + 1;
        } else {
            y--;
            p += 2 * (x - y) + 1;
        }
    }
}

// ================= PRUEBA CIRCUNFERENCIA =================
midpointCircle(centerX, centerY, 150, "#555");
