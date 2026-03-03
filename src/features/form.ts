import { computed, signal, type Signal } from "kiru"

type Validator<T> = (value: T) => string | null | undefined

type ValidatorMap<T extends Record<string, any>> = {
  [K in keyof T]?: Validator<T[K]>
}

export type FieldRenderProps<
  T extends Record<string, any>,
  K extends keyof T
> = {
  name: K
  state: Signal<T[K]>
  error: Signal<string | null>
  setValue(value: T[K]): void
  validate(): void
}

export type FieldProps<
  T extends Record<string, any>,
  K extends keyof T = keyof T
> = {
  name: K
  children: (field: FieldRenderProps<T, K>) => JSX.Children
}

type FormOptions<T extends Record<string, any>> = {
  initialState: T
  validators: ValidatorMap<T>
  onSubmit?: (values: T) => boolean | void | Promise<boolean | void>
}

export type FormController<T extends Record<string, any>> = {
  values: { [K in keyof T]: Signal<T[K]> }
  errors: { [K in keyof T]: Signal<string | null> }
  isSubmitting: Signal<boolean>
  canSubmit: Signal<boolean>
  canNotSubmit: Signal<boolean>
  setValue<K extends keyof T>(key: K, value: T[K]): void
  validateField<K extends keyof T>(key: K): void
  validateAll(): boolean
  reset(): void
  handleSubmit(): Promise<boolean>
  Field: Kiru.FC<FieldProps<T>>
}

export function createFormController<T extends Record<string, any>>(
  options: FormOptions<T>
): FormController<T> {
  const { initialState, validators, onSubmit } = options
  const values = {} as { [K in keyof T]: Signal<T[K]> }
  const errors = {} as { [K in keyof T]: Signal<string | null> }

  tEntries(initialState).forEach(([key, value]) => {
    errors[key] = signal<string | null>(null)
    values[key] = signal(value)
  })

  const isSubmitting = signal(false)

  const canSubmit = computed(() => {
    if (isSubmitting.value) return false

    return Object.keys(values).every((key) => {
      const validator = validators[key]
      if (!validator) return true
      return !validator(values[key].value)
    })
  })
  const canNotSubmit = computed(() => !canSubmit.value)

  const setValue = <K extends keyof T>(key: K, value: T[K]) => {
    values[key].value = value
  }

  const validateField = <K extends keyof T>(key: K) => {
    const validator = validators[key]
    if (!validator) return
    errors[key].value = validator(values[key].value) ?? null
  }

  const validateAll = () => {
    let ok = true

    Object.keys(values).forEach((key) => {
      const validator = validators[key]
      if (!validator) return
      const error = validator(values[key].value)
      errors[key].value = error ?? null
      if (error) ok = false
    })

    return ok
  }

  const reset = () => {
    Object.keys(initialState).forEach((key) => {
      values[key].value = initialState[key]
      errors[key].value = null
    })
    isSubmitting.value = false
  }

  const handleSubmit = async (): Promise<boolean> => {
    const ok = validateAll()
    if (!ok) return false

    if (!onSubmit) return true

    const snapshot = tEntries(values).reduce((acc, [key, value]) => {
      acc[key] = value.value
      return acc
    }, {} as T)

    isSubmitting.value = true
    try {
      const result = await onSubmit(snapshot)
      if (result === true) {
        reset()
      }
      return result !== false
    } finally {
      isSubmitting.value = false
    }
  }

  const Field: Kiru.FC<FieldProps<T>> = (props) => {
    const key = props.name

    return props.children({
      name: key,
      state: values[key],
      error: errors[key],
      setValue: (next) => {
        setValue(key, next)
        validateField(key)
      },
      validate: () => validateField(key),
    })
  }

  return {
    values,
    errors,
    isSubmitting,
    canSubmit,
    canNotSubmit,
    setValue,
    validateField,
    validateAll,
    reset,
    handleSubmit,
    Field,
  }
}

function tEntries<T extends Record<string, any>>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}
