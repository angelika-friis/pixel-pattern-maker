import { ControlPanel } from '../components/ControlPanel';
import { PalettePanel } from '../components/PalettePanel';
import { PreviewPanel } from '../components/PreviewPanel';
import { useHomeWorkspace } from './home/useHomeWorkspace';

export function HomePage() {
  const { controlPanelProps, palettePanelProps, previewPanelProps } = useHomeWorkspace();

  return (
    <section className="workspace">
      <div className="control-stack">
        <ControlPanel {...controlPanelProps} />
      </div>
      <PreviewPanel {...previewPanelProps} />
      {palettePanelProps && <PalettePanel {...palettePanelProps} />}
    </section>
  );
}
