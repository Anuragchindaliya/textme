// Function to calculate brightness
export const isColorTooDark = (color: string): boolean => {
  const rgb = hexToRgb(color)
  if (!rgb) return false
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness < 128 // threshold for dark color
}

// Convert HEX to RGB
export const hexToRgb = (hex: string) => {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  return match
    ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
      }
    : null
}

// Function to calculate contrast ratio
export const getContrastRatio = (color1: string, color2: string): number => {
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)
  const brightest = Math.max(luminance1, luminance2)
  const darkest = Math.min(luminance1, luminance2)
  return (brightest + 0.05) / (darkest + 0.05)
}

// Function to calculate relative luminance
const getLuminance = (color: string): number => {
  const rgb = hexToRgb(color)
  if (!rgb) return 0
  const { r, g, b } = rgb
  const [red, green, blue] = [r, g, b].map((c) => {
    const channel = c / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}
