export function objToCssClass(
  obj: Record<string, string | boolean>
) {
  const result = []
  for (const key in obj) {
    const val = obj[key]
    switch (val) {
      case true:
        result.push(key)
        break
      case false:
        break
      default:
        result.push(key + '-' + val)
        break
    }
  }
  return result.join(' ')
}
