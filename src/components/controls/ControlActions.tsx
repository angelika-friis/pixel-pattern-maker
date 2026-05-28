import { Download, RotateCcw } from 'lucide-react';

type ControlActionsProps = {
  canDownload: boolean;
  onDownload: () => void;
  onReset: () => void;
};

export function ControlActions({ canDownload, onDownload, onReset }: ControlActionsProps) {
  return (
    <div className="action-row">
      <button type="button" onClick={onDownload} disabled={!canDownload}>
        <Download aria-hidden="true" />
        PDF
      </button>
      <button type="button" className="secondary" onClick={onReset}>
        <RotateCcw aria-hidden="true" />
        Återställ
      </button>
    </div>
  );
}
