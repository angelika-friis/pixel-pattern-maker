type DrawGridLinesOptions = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  cellSize: number;
  gridColor: string;
};

export function drawGridLines({ ctx, width, height, cellSize, gridColor }: DrawGridLinesOptions) {
  ctx.save();
  ctx.strokeStyle = gridColor;
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }

  ctx.restore();
}
