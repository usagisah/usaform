import { Field, FieldName } from "../form.helper"

export interface FormActionCallInfo {
  name: FieldName
  path: string
  [x: string | number | symbol]: any
}

export function callFieldAction(field: Field, key: string, point: any, params: any[]) {
  const results: Record<string, any> = {}
  function call(name: string, field: Field, path: string): unknown {
    if (field.type === "root") {
      return field.struct.forEach(f => call(f.name as string, f, ""))
    }

    const selfPath = path.length === 0 ? name.toString() : `${path}/${name}`
    try {
      const action = field.userConfig[key]
      if (typeof action === "function") {
        const info: FormActionCallInfo = { name, path: selfPath }
        results[selfPath] = action.apply(point, [info, ...params])
      }

      if (field.type !== "plain") {
        field.struct.forEach((f, i) => {
          call(f.type === "ary" ? i.toString() : (f.name as string), f, selfPath)
        })
      }
    } catch (e) {
      results[selfPath] = e
      console.error(e)
    }
  }
  call(field.name as string, field, "")
  return results
}
