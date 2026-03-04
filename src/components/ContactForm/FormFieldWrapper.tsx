import { Show, Signal } from "kiru"

export const FormFieldWrapper: Kiru.FC<{
  for: string
  label: string
  error: Signal<string | null>
  children: JSX.Children
}> = ({ for: htmlFor, label, error, children }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between">
      <label className="font-bold" htmlFor={htmlFor}>
        {label}
      </label>
      <Show when={error}>
        <span className="text-red-400 text-sm">{error}</span>
      </Show>
    </div>
    {children}
  </div>
)
