import type { OutputInfo } from '../../domain/pixelGrid';
import styles from './OutputStats.module.css';

type OutputStatsProps = {
  outputInfo: OutputInfo;
};

export function OutputStats({ outputInfo }: OutputStatsProps) {
  return (
    <dl className={styles.stats}>
      <div className={styles['stats-item']}>
        <dt className={styles['stats-term']}>Grid</dt>
        <dd className={styles['stats-description']}>
          {outputInfo.cols} x {outputInfo.rows}
        </dd>
      </div>
      <div className={styles['stats-item']}>
        <dt className={styles['stats-term']}>Image</dt>
        <dd className={styles['stats-description']}>
          {outputInfo.width} x {outputInfo.height}px
        </dd>
      </div>
    </dl>
  );
}
