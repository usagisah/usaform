import { FormConfig as _FormConfig } from "./form.common"
export type FormConfig = Partial<_FormConfig>
export type { Field, FieldName } from "./form.common"

export { useForm } from "./form"
export type { FormActions } from "./form"

export { useFormPlainField } from "./plainField"
export type { PlainField, PlainFieldActions, PlainFieldConfig, PlainFieldInitInfo } from "./plainField"

export { useFormObjectFiled } from "./objectField"
export type { ObjectField, ObjectFieldActions, ObjectFieldConfig, ObjectFieldInitInfo } from "./objectField"

export { useFormArrayField } from "./arrayField"
export type { ArrayField, ArrayFieldActions, ArrayFieldConfig, ArrayFieldInitInfo } from "./arrayField"

export type { ArrayItemParams } from "./arrayItem"

export { createGlobalFormProvide } from "./context"
