/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Wilmer Salamanca
 * 
 * PARTE 1:
 * Configuración inicial del canvas y función básica de píxel
 */

// Obtener canvas y contexto
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ================= FUNCIÓN BASE =================
/**
 * Única función autorizada para dibujar
 * Dibuja un píxel en coordenadas (x, y)
 */
function plotPixel(ctx, x, y, color = "#000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// ================= PRUEBA =================
// Dibujar algunos píxeles manualmente para verificar que funciona
plotPixel(ctx, 300, 300, "red");
plotPixel(ctx, 301, 300, "red");
plotPixel(ctx, 302, 300, "red");

plotPixel(ctx, 300, 301, "blue");
plotPixel(ctx, 300, 302, "blue");