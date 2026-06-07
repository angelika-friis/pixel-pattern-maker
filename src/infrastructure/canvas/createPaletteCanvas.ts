import type { PixelColor } from '../../domain/pixelGrid';
import type { PixelColorSymbol } from '../pattern/colorSymbols';

type PaletteCanvasOptions = {
  showSymbols?: boolean;
};

const PALETTE_EXPORT_PADDING = 32;
const PALETTE_EXPORT_GAP = 14;
const PALETTE_EXPORT_ITEM_WIDTH = 210;
const PALETTE_EXPORT_ITEM_HEIGHT = 48;
const PALETTE_EXPORT_SWATCH_SIZE = 34;
const PALETTE_EXPORT_HEADER_HEIGHT = 30;

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

export function createPaletteCanvas(
  pixelColors: Array<PixelColor | PixelColorSymbol>,
  { showSymbols = false }: PaletteCanvasOptions = {},
) {
  const canvas = document.createElement('canvas');
  const columns = pixelColors.length > 24 ? 2 : 1;
  const paletteContentWidth =
    columns * PALETTE_EXPORT_ITEM_WIDTH + Math.max(0, columns - 1) * PALETTE_EXPORT_GAP;
  const paletteWidth = paletteContentWidth + PALETTE_EXPORT_PADDING * 2;
  const rows = Math.ceil(pixelColors.length / columns);
  const paletteHeight =
    PALETTE_EXPORT_PADDING * 2 +
    PALETTE_EXPORT_HEADER_HEIGHT +
    PALETTE_EXPORT_GAP +
    rows * PALETTE_EXPORT_ITEM_HEIGHT +
    Math.max(0, rows - 1) * PALETTE_EXPORT_GAP;
  const ctx = canvas.getContext('2d');

  canvas.width = paletteWidth;
  canvas.height = paletteHeight;

  if (!ctx) {
    return canvas;
  }

  ctx.fillStyle = '#f7f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#17202a';
  ctx.font = '800 19px Inter, Arial, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText(
    `Palette (${pixelColors.length} ${pixelColors.length === 1 ? 'color' : 'colors'})`,
    PALETTE_EXPORT_PADDING,
    PALETTE_EXPORT_PADDING,
  );

  ctx.font = '700 16px Inter, Arial, sans-serif';

  pixelColors.forEach((color, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = PALETTE_EXPORT_PADDING + column * (PALETTE_EXPORT_ITEM_WIDTH + PALETTE_EXPORT_GAP);
    const y =
      PALETTE_EXPORT_PADDING +
      PALETTE_EXPORT_HEADER_HEIGHT +
      PALETTE_EXPORT_GAP +
      row * (PALETTE_EXPORT_ITEM_HEIGHT + PALETTE_EXPORT_GAP);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#d7dde3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, PALETTE_EXPORT_ITEM_WIDTH, PALETTE_EXPORT_ITEM_HEIGHT, 8);
    ctx.fill();
    ctx.stroke();

    const swatchX = x + 8;
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
    const label = showSymbols && 'symbol' in color ? `${color.symbol}  ${color.hex}` : color.hex;
    ctx.fillText(label, swatchX + PALETTE_EXPORT_SWATCH_SIZE + 12, y + 15);
  });

  return canvas;
}
