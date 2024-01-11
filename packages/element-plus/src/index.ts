import { RuleItem } from "async-validator"

export { ArrayField } from "./ArrayField.jsx"
export type { ArrayFieldAttrs, ArrayFieldProps } from "./ArrayField.jsx"
export { Form } from "./Form.jsx"
export type { FormExpose, FormProps, FormValidateError } from "./Form.jsx"
export { FormItem } from "./FormItem.jsx"
export type { FormItemAttrs, FormItemExpose, FormItemProps } from "./FormItem.jsx"
export { ObjectField } from "./ObjectField.jsx"
export type { ObjectFieldProps } from "./ObjectField.jsx"
export { PlainField } from "./PlainField.jsx"
export type { PlainFieldProps } from "./PlainField.jsx"

export * from "@usaform/vue"

import type { FormConfig as _FormConfig } from "@usaform/vue"
export interface FormConfig extends _FormConfig {
  Elements?: Record<string, any>
  Rules?: Record<string, RuleItem>
}
