import type { PixelColor } from './drawPixelArt';

const PALETTE_EXPORT_MIN_WIDTH = 520;
const PALETTE_EXPORT_PADDING = 24;
const PALETTE_EXPORT_GAP = 10;
const PALETTE_EXPORT_ITEM_WIDTH = 150;
const PALETTE_EXPORT_ITEM_HEIGHT = 32;
const PALETTE_EXPORT_SWATCH_SIZE = 22;

function drawTransparencyPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  const tileSize = 6;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = '#d7dde3';

  for (let tileY = 0; tileY < size; tileY += tileSize) {
    for (let tileX = 0; tileX < size; tileX += tileSize) {
      if ((tileX / tileSize + tileY / tileSize) % 2 === 0) {
        ctx.fillRect(x + tileX, y + tileY, tileSize, tileSize);
      }
    }
  }
}

export function createDownloadCanvas(pixelCanvas: HTMLCanvasElement, pixelColors: PixelColor[]) {
  const canvas = document.createElement('canvas');
  const width = Math.max(pixelCanvas.width, PALETTE_EXPORT_MIN_WIDTH);
  const paletteContentWidth = width - PALETTE_EXPORT_PADDING * 2;
  const columns = Math.max(
    1,
    Math.floor((paletteContentWidth + PALETTE_EXPORT_GAP) / PALETTE_EXPORT_ITEM_WIDTH),
  );
  const itemWidth =
    (paletteContentWidth - PALETTE_EXPORT_GAP * Math.max(0, columns - 1)) / columns;
  const rows = Math.ceil(pixelColors.length / columns);
  const paletteHeight =
    PALETTE_EXPORT_PADDING * 2 +
    22 +
    PALETTE_EXPORT_GAP +
    rows * PALETTE_EXPORT_ITEM_HEIGHT +
    Math.max(0, rows - 1) * PALETTE_EXPORT_GAP;
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = pixelCanvas.height + paletteHeight;

  if (!ctx) {
    return pixelCanvas;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(pixelCanvas, Math.floor((width - pixelCanvas.width) / 2), 0);

  const paletteTop = pixelCanvas.height;
  ctx.fillStyle = '#f7f9fa';
  ctx.fillRect(0, paletteTop, width, paletteHeight);
  ctx.strokeStyle = '#d7dde3';
  ctx.beginPath();
  ctx.moveTo(0, paletteTop + 0.5);
  ctx.lineTo(width, paletteTop + 0.5);
  ctx.stroke();

  ctx.fillStyle = '#17202a';
  ctx.font = '800 15px Inter, Arial, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(
    `Palett (${pixelColors.length} ${pixelColors.length === 1 ? 'färg' : 'färger'})`,
    PALETTE_EXPORT_PADDING,
    paletteTop + PALETTE_EXPORT_PADDING,
  );

  ctx.font = '700 12px Inter, Arial, sans-serif';

  pixelColors.forEach((color, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = PALETTE_EXPORT_PADDING + column * (itemWidth + PALETTE_EXPORT_GAP);
    const y =
      paletteTop +
      PALETTE_EXPORT_PADDING +
      22 +
      PALETTE_EXPORT_GAP +
      row * (PALETTE_EXPORT_ITEM_HEIGHT + PALETTE_EXPORT_GAP);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#d7dde3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, itemWidth, PALETTE_EXPORT_ITEM_HEIGHT, 6);
    ctx.fill();
    ctx.stroke();

    const swatchX = x + 6;
    const swatchY = y + (PALETTE_EXPORT_ITEM_HEIGHT - PALETTE_EXPORT_SWATCH_SIZE) / 2;
    if (color.hex === 'transparent') {
      drawTransparencyPattern(ctx, swatchX, swatchY, PALETTE_EXPORT_SWATCH_SIZE);
    } else {
      ctx.fillStyle = color.hex;
      ctx.fillRect(swatchX, swatchY, PALETTE_EXPORT_SWATCH_SIZE, PALETTE_EXPORT_SWATCH_SIZE);
    }

    ctx.strokeStyle = 'rgba(17, 24, 39, 0.22)';
    ctx.strokeRect(
      swatchX + 0.5,
      swatchY + 0.5,
      PALETTE_EXPORT_SWATCH_SIZE - 1,
      PALETTE_EXPORT_SWATCH_SIZE - 1,
    );

    ctx.fillStyle = '#17202a';
    ctx.fillText(color.hex, swatchX + PALETTE_EXPORT_SWATCH_SIZE + 8, y + 9);
  });

  return canvas;
}
