import { useMemo } from "kiru"
import { AnyFormFieldContext } from "kiru/form"
import { capitalizeFirstLetter } from "./utils"

export const FormFieldWrapper: Kiru.FC<{ field: AnyFormFieldContext }> = ({
  field,
  children,
}) => {
  const labelText = useMemo(() => {
    return capitalizeFirstLetter(field.name)
  }, [field.name])
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <label className="font-bold" htmlFor={field.name}>
          {labelText}
        </label>
        {field.state.errors.length > 0 && (
          <span className="text-red-400 text-sm">{field.state.errors[0]}</span>
        )}
      </div>
      {children}
    </div>
  )
}
