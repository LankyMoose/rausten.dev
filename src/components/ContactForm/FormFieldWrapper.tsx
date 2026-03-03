import { Derive, Signal } from "kiru"

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
      <Derive from={error}>
        {(error) =>
          error && <span className="text-red-400 text-sm">{error}</span>
        }
      </Derive>
    </div>
    {children}
  </div>
)
