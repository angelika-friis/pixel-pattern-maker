import { ControlPanel } from '../components/ControlPanel';
import { PalettePanel } from '../components/PalettePanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { useHomeWorkspace } from './home/useHomeWorkspace';
import styles from './HomePage.module.css';

export function HomePage() {
  const { controlPanelProps, palettePanelProps, previewPanelProps } = useHomeWorkspace();

  return (
    <section className={styles.workspace}>
      <div className={styles['control-stack']}>
        <ControlPanel {...controlPanelProps} />
      </div>
      <div className={styles['preview-stack']}>
        <PreviewPanel {...previewPanelProps} />
        {palettePanelProps && <PalettePanel {...palettePanelProps} />}
      </div>
    </section>
  );
}
