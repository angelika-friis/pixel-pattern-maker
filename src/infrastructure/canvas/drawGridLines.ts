type DrawGridLinesOptions = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  cellSize: number;
  gridColor: string;
};

export function drawGridLines({ ctx, width, height, cellSize, gridColor }: DrawGridLinesOptions) {
  ctx.save();
  ctx.fillStyle = gridColor;
  ctx.globalAlpha = 0.42;

  for (let x = 0; x < width; x += cellSize) {
    ctx.fillRect(x, 0, 1, height);
  }

  for (let y = 0; y < height; y += cellSize) {
    ctx.fillRect(0, y, width, 1);
  }

  ctx.fillRect(width - 1, 0, 1, height);
  ctx.fillRect(0, height - 1, width, 1);

  ctx.restore();
}
