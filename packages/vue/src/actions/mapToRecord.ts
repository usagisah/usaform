import { Field, getProperty } from "../form.helper"

export function mapFieldToRecord(field: Field, arrayUnwrapKey: string[]): Record<string, any> {
  if (field.type === "plain") return field.getter()
  if (field.type === "ary") {
    return field.struct.map(item => {
      if (getProperty(item, "__uform_aryItem_field", false)) {
        return mapFieldToRecord(item, arrayUnwrapKey)
      }
      for (const k of arrayUnwrapKey) {
        const v = (item as any)[k]
        if (v) return v
      }
      return item
    })
  }
  const record: Record<string, any> = {}
  field.struct.forEach((field, name) => (record[name] = mapFieldToRecord(field, arrayUnwrapKey)))
  return record
}
