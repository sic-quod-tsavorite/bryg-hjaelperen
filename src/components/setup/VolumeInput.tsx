import { NumberInput } from '../common/NumberInput';

interface VolumeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function VolumeInput({ value, onChange }: VolumeInputProps) {
  return (
    <NumberInput
      label="Batchstørrelse"
      value={value}
      onChange={(v) => onChange(v ?? 0)}
      unit="L"
      placeholder="f.eks. 20"
      min={1}
      max={1000}
    />
  );
}
