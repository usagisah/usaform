import { FormField } from "../form/field.type"
import { resolveArrayItem, safeGetProperty } from "../shared/resolve"

export function mapFieldToRecord(field: FormField, arrayUnwrapKey: string[]): Record<string, any> {
  if (field.type === "plain") return field.getter()
  if (field.type === "ary") {
    const res: any[] = []
    field.struct.forEach(item => {
      if (item.type === "void") return
      if (safeGetProperty(item, "__uform_aryItem_field")) {
        return res.push(mapFieldToRecord(item, arrayUnwrapKey))
      }
      return res.push(resolveArrayItem(item, arrayUnwrapKey))
    })
    return res
  }
  const record: Record<string, any> = {}
  field.struct.forEach((field, name) => {
    if (field.type === "void") return
    record[name] = mapFieldToRecord(field, arrayUnwrapKey)
  })
  return record
}
