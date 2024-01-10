import { Field } from "../form.helper"

export function mapFieldToRecord(field: Field): Record<string, any> {
  if (field.type === "plain") return field.getter()
  if (field.type === "ary") return field.struct.map(mapFieldToRecord)
  const record: Record<string, any> = {}
  field.struct.forEach((field, name) => (record[name] = mapFieldToRecord(field)))
  return record
}
