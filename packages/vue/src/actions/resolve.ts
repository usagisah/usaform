import { Field } from "../form.helper"

type MatchPath = ".." | RegExp

export function resolveFields(path: string, cur: Field, root: Field): Field[] {
  const { matches, startRoot } = parse(path)
  if (matches.length === 0) return []

  const result: Field[] = []
  function resolve(matches: (RegExp | "..")[], field?: Field) {
    if (!field) return
    if (matches.length === 0) {
      if (field !== cur) result.push(field)
      return
    }

    const [m, ...ms] = matches
    if (m === "..") {
      return resolve(ms, field.parent)
    }

    if (!m.test(field.name + "")) {
      return
    }

    if (field.type === "root" || field.type === "object") {
      const names = [...field.struct.keys()].filter(k => m.test(k + ""))
      for (const name of names) resolve(ms, field.struct.get(name))
      return
    }

    if (field.type === "ary") {
      field.struct.forEach((f, i) => {
        if (!m.test(i + "")) return
        if (!f.__uform_field) return
        resolve(ms, f)
      })
      return
    }
  }

  return resolve(matches, startRoot ? root : cur), result
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
