

export interface IonicSelectOption<T extends string | number> {
  label: string;
  value: T;
}

export function mapToIonicSelectOptions<
  TItem,
  TValue extends string | number
>(
  items: ReadonlyArray<TItem>,
  labelSelector: (item: TItem) => string,
  valueSelector: (item: TItem) => TValue
): IonicSelectOption<TValue>[] {
  return items.map(item => ({
    label: labelSelector(item),
    value: valueSelector(item),
  }));
}
