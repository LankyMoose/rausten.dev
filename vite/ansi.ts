const colors = {
  black: "\x1B[30m",
  black_bright: "\x1B[90m",
  red: "\x1B[31m",
  red_bright: "\x1B[91m",
  green: "\x1B[32m",
  green_bright: "\x1B[92m",
  yellow: "\x1B[33m",
  yellow_bright: "\x1B[93m",
  blue: "\x1B[34m",
  blue_bright: "\x1B[94m",
  magenta: "\x1B[35m",
  magenta_bright: "\x1B[95m",
  cyan: "\x1B[36m",
  cyan_bright: "\x1B[96m",
  white: "\x1B[37m",
  white_bright: "\x1B[97m",
  reset: "\x1B[0m",
}
type AnsiColor = keyof typeof colors

export const ANSI = Object.entries(colors).reduce((acc, [key, value]) => {
  acc[key as AnsiColor] = (str: string) => `${value}${str}${colors.reset}`
  return acc
}, {} as Record<AnsiColor, (str: string) => string>)
