import { FormConfig as _FormConfig } from "./form.common.js"
export type FormConfig = Partial<_FormConfig>
export type { Field, FieldName } from "./form.common.js"

export { useForm } from "./form.js"
export type { FormActions } from "./form.js"

export { useFormPlainField } from "./plainField.js"
export type { PlainField, PlainFieldActions, PlainFieldConfig, PlainFieldInitInfo } from "./plainField.js"

export { useFormObjectFiled } from "./objectField.js"
export type { ObjectField, ObjectFieldActions, ObjectFieldConfig, ObjectFieldInitInfo } from "./objectField.js"

export { useFormArrayField } from "./arrayField.js"
export type { ArrayField, ArrayFieldActions, ArrayFieldConfig, ArrayFieldInitInfo } from "./arrayField.js"

export type { ArrayItemParams } from "./arrayItem.js"

export { createGlobalFormProvide } from "./context.js"
