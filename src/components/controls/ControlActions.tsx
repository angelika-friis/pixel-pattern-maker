import { Download, RotateCcw } from 'lucide-react';
import buttonStyles from '../../styles/shared/button.module.css';
import styles from './ControlActions.module.css';

type ControlActionsProps = {
  canDownload: boolean;
  onDownload: () => void;
  onReset: () => void;
};

export function ControlActions({ canDownload, onDownload, onReset }: ControlActionsProps) {
  return (
    <div className={styles['action-row']}>
      <button
        className={buttonStyles.button}
        type="button"
        onClick={onDownload}
        disabled={!canDownload}
      >
        <Download aria-hidden="true" />
        PDF
      </button>
      <button
        type="button"
        className={`${buttonStyles.button} ${buttonStyles.secondary}`}
        onClick={onReset}
      >
        <RotateCcw aria-hidden="true" />
        Reset
      </button>
    </div>
  );
}
