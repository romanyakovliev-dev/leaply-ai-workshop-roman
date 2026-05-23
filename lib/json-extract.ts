export function parseJsonObject(raw: string): unknown {
  const trimmed = raw.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf("{")
    const end = trimmed.lastIndexOf("}")
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1))
    }
    throw new Error("Не вдалося розпарсити JSON з відповіді моделі")
  }
}
