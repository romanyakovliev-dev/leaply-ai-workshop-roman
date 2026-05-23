// Robust JSON extractor for LLM output that may be:
// - wrapped in prose / markdown,
// - truncated mid-string (token cutoff),
// - have trailing commas,
// - have unescaped newlines inside string values.
//
// Strategy: try strict parse, then balanced-brace slice, then a best-effort
// "auto-close" that closes the open string and any open objects.

export function parseJsonObject(raw: string): unknown {
  const trimmed = raw.trim()

  // 1. Strict parse
  try {
    return JSON.parse(trimmed)
  } catch {
    /* fall through */
  }

  // 2. Slice between first { and last }
  const start = trimmed.indexOf("{")
  if (start < 0) throw new Error("У відповіді моделі немає JSON-обʼєкту")
  const end = trimmed.lastIndexOf("}")
  if (end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      /* fall through */
    }
  }

  // 3. Best-effort repair: close any open string, close any open objects/arrays
  const repaired = repairTruncated(trimmed.slice(start))
  try {
    return JSON.parse(repaired)
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown"
    throw new Error(
      `Не вдалося розпарсити JSON навіть після repair: ${reason}. Перші 200 символів: ${trimmed.slice(0, 200)}`
    )
  }
}

function repairTruncated(s: string): string {
  let out = s
  let inString = false
  let escape = false
  const stack: string[] = []

  for (const c of out) {
    if (escape) {
      escape = false
      continue
    }
    if (c === "\\") {
      escape = true
      continue
    }
    if (c === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (c === "{") stack.push("}")
    else if (c === "[") stack.push("]")
    else if (c === "}" || c === "]") stack.pop()
  }

  if (inString) out += '"'
  // strip trailing comma before closing
  out = out.replace(/,\s*$/, "")
  while (stack.length > 0) {
    out += stack.pop()
  }
  return out
}
