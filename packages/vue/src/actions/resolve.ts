import { Field } from "../form.helper"
import { MatchPath, parsePath } from "./path"

export interface ResolveConfig {
  path: string
  field: Field
  rootField: Field
  first: boolean
}

export interface MatchedFields {
  path: string
  name: string
  field: Field
}

export function resolveFields({ path, field, rootField, first = false }: ResolveConfig) {
  const { matches, startRoot } = parsePath(path)
  if (matches.length === 0) return []

  const matchedFields: MatchedFields[] = []
  const startField = startRoot ? rootField : field
  resolve({ matches, path: [], name: startField.name.toString(), field: startField, first, matchedFields })

  return matchedFields
}

interface ResolveContext {
  matches: MatchPath[]
  path: string[]
  name: string
  field?: Field
  first: boolean
  matchedFields: MatchedFields[]
}

function resolve({ matches, path, name, field, first, matchedFields }: ResolveContext) {
  if (first && matchedFields.length === 1) return
  if (!field) return

  let [m, ...ms] = matches

  if (m === "..") {
    return resolve({ matches: ms, path, name: field.parent?.name.toString() as string, field: field.parent!, first, matchedFields })
  }

  path.push(name)

  if (m !== "all" && !m.test(name)) {
    return
  }

  if (ms.length === 0) {
    let _path = path.join("/")
    if (_path.startsWith("root")) {
      _path = _path.slice(4)
      if (_path.startsWith("/")) _path = _path.slice(1)
    }
    matchedFields.push({ name, field, path: _path })

    if (m !== "all") return
    ms = ["all"]
  }

  if (field.type === "root" || field.type === "object") {
    return field.struct.forEach(f => {
      resolve({ matches: ms, path, name: f.name.toString(), field: f, first, matchedFields })
    })
  }

  if (field.type === "ary") {
    return field.struct.forEach((f, i) => {
      if (!f.__uform_field) return
      resolve({ matches: ms, path, name: i.toString(), field: f, first, matchedFields })
    })
  }
}
