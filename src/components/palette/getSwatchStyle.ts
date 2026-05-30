import type { CSSProperties } from 'react';

export function getSwatchStyle(hex: string): CSSProperties {
  return {
    backgroundColor: hex === 'transparent' ? 'transparent' : hex,
    backgroundImage: hex === 'transparent' ? undefined : 'none',
  };
}
