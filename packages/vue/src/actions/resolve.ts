import { Field } from "../form.helper"

type MatchPath = ".." | RegExp

export function resolveFields(path: string, cur: Field, root: Field, first: boolean): Field[] {
  const { matches, startRoot } = parse(path)
  if (matches.length === 0) return []

  const result: Field[] = []
  function resolve(matches: (RegExp | "..")[], name: string, field?: Field | null): unknown {
    if (first && result.length === 1) return
    if (!field) return

    const [m, ...ms] = matches

    if (m === "..") {
      return resolve(ms, field.parent?.name + "", field.parent)
    }

    if (!m.test(name)) {
      return
    }

    if (ms.length === 0) {
      return result.push(field)
    }

    if (field.type === "root" || field.type === "object") {
      return field.struct.forEach(f => resolve(ms, f.name as string, f))
    }

    if (field.type === "ary") {
      return field.struct.forEach((f, i) => {
        if (!f.__uform_field) return
        resolve(ms, i + "", f)
      })
    }
  }

  const startField = startRoot ? root : cur
  return resolve(matches, startField.name + "", startField), result
}

function parse(path: string) {
  let startRoot = false
  let matches: MatchPath[] = []

  if (path.startsWith("~/")) {
    path = path.substring(2)
    startRoot = true
  } else if (!path.startsWith("../")) {
    matches.push(getReg(".*"))
  }
  if (path.length === 0) return { matches: [], startRoot }

  for (const p of path.split("/")) {
    matches.push(p === ".." ? p : getReg(p))
  }
  return { matches, startRoot }
}

const regCache = new Map<string, RegExp>([
  [".*", /.*/],
  ["", /\b/]
])
function getReg(p: string) {
  let r = regCache.get(p)
  if (!r) regCache.set(p, (r = new RegExp(p)))
  return r
}
