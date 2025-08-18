export const validateFieldValueLength = (
  name: string,
  value: string,
  minLength: number,
  maxLength: number
) => {
  if (value.length === 0) {
    return `${name} is required`
  }
  if (value.length < minLength || value.length > maxLength) {
    return `${name} must be between ${minLength} and ${maxLength} characters long`
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
