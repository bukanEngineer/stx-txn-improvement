import type { ReactNode } from "react";
import { Field, MultiSelect } from "stxdesign-sandbox";

export interface MultiSelectFieldOption {
  value: string;
  label: ReactNode;
}

interface MultiSelectFieldProps {
  label: string;
  options: MultiSelectFieldOption[];
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

/** Labelled multi-select built from the design system's `Field` and `MultiSelect` parts. */
export function MultiSelectField({ label, options, placeholder, value, onChange }: MultiSelectFieldProps) {
  const labelFor = (item: string) => options.find((option) => option.value === item)?.label ?? item;

  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <MultiSelect.Root
        items={options.map((option) => option.value)}
        value={value}
        onValueChange={(next) => onChange(next)}
      >
        <MultiSelect.InputGroup>
          <MultiSelect.Value>
            {(selected: string[]) => (
              <MultiSelect.Chips>
                {selected.map((item) => (
                  <MultiSelect.Chip key={item}>
                    {labelFor(item)}
                    <MultiSelect.ChipRemove aria-label={`Remove ${item}`} />
                  </MultiSelect.Chip>
                ))}
                <MultiSelect.Input placeholder={selected.length ? "" : placeholder} />
              </MultiSelect.Chips>
            )}
          </MultiSelect.Value>
          <MultiSelect.Clear aria-label="Clear all" />
          <MultiSelect.Trigger />
        </MultiSelect.InputGroup>
        <MultiSelect.Popup>
          <MultiSelect.Empty>No matches</MultiSelect.Empty>
          <MultiSelect.List>
            {(item: string) => (
              <MultiSelect.Item key={item} value={item}>
                {labelFor(item)}
              </MultiSelect.Item>
            )}
          </MultiSelect.List>
        </MultiSelect.Popup>
      </MultiSelect.Root>
    </Field.Root>
  );
}
