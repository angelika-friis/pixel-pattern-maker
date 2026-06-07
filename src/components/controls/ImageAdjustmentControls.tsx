import { useState } from 'react';
import { ChevronDown, Contrast, Droplets } from 'lucide-react';
import {
  MAX_COLOR_SATURATION,
  MAX_IMAGE_CONTRAST,
  MIN_COLOR_SATURATION,
  MIN_IMAGE_CONTRAST,
} from '../../domain/pixelGrid';
import { RangeNumberControl } from './RangeNumberControl';

type ImageAdjustmentControlsProps = {
  colorSaturation: number;
  imageContrast: number;
  onColorSaturationChange: (value: number) => void;
  onImageContrastChange: (value: number) => void;
};

export function ImageAdjustmentControls({
  colorSaturation,
  imageContrast,
  onColorSaturationChange,
  onImageContrastChange,
}: ImageAdjustmentControlsProps) {
  const [isEditingImage, setIsEditingImage] = useState(false);

  return (
    <section className="image-adjustment-controls" aria-label="Bildredigering">
      <button
        className="image-adjustment-toggle"
        type="button"
        aria-expanded={isEditingImage}
        onClick={() => setIsEditingImage((currentValue) => !currentValue)}
      >
        <span>Redigera bild</span>
        <ChevronDown aria-hidden="true" />
      </button>

      {isEditingImage && (
        <div className="image-adjustment-stack">
          <RangeNumberControl
            Icon={Droplets}
            label="Färgmättnad"
            value={colorSaturation}
            displayValue={`${colorSaturation}%`}
            rangeMin={MIN_COLOR_SATURATION}
            rangeMax={MAX_COLOR_SATURATION}
            inputMin={MIN_COLOR_SATURATION}
            inputMax={MAX_COLOR_SATURATION}
            inputLabel="Färgsaturation i procent"
            onChange={onColorSaturationChange}
          />

          <RangeNumberControl
            Icon={Contrast}
            label="Kontrast"
            value={imageContrast}
            displayValue={`${imageContrast}%`}
            rangeMin={MIN_IMAGE_CONTRAST}
            rangeMax={MAX_IMAGE_CONTRAST}
            inputMin={MIN_IMAGE_CONTRAST}
            inputMax={MAX_IMAGE_CONTRAST}
            inputLabel="Bildkontrast i procent"
            onChange={onImageContrastChange}
          />
        </div>
      )}
    </section>
  );
}
