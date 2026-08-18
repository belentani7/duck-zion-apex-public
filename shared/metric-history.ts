export type MetricHistoryRecord = {
  deliveryId: number | null;
  id: number;
  lufs: string | null;
  truePeak: string | null;
  dynamicRange: string | null;
};

export function groupMetricHistory<T extends MetricHistoryRecord>(
  metrics: T[]
) {
  return metrics.reduce<Record<string, T[]>>((groups, metric) => {
    const key =
      metric.deliveryId === null ? "unlinked" : String(metric.deliveryId);
    (groups[key] ??= []).push(metric);
    return groups;
  }, {});
}
