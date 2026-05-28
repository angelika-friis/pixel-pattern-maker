export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export function toHex(value: number) {
  return value.toString(16).padStart(2, '0');
}
