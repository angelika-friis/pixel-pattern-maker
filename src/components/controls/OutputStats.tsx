import type { OutputInfo } from '../../domain/pixelGrid';

type OutputStatsProps = {
  outputInfo: OutputInfo;
};

export function OutputStats({ outputInfo }: OutputStatsProps) {
  return (
    <dl className="stats">
      <div>
        <dt>Grid</dt>
        <dd>
          {outputInfo.cols} x {outputInfo.rows}
        </dd>
      </div>
      <div>
        <dt>Image</dt>
        <dd>
          {outputInfo.width} x {outputInfo.height}px
        </dd>
      </div>
    </dl>
  );
}
