import { RuleItem } from "async-validator"

export { ArrayField } from "./ArrayField"
export type { ArrayFieldAttrs, ArrayFieldProps } from "./ArrayField"
export { Form } from "./Form"
export type { FormExpose, FormProps, FormValidateError } from "./Form"
export { FormItem } from "./FormItem"
export type { FormItemAttrs, FormItemExpose, FormItemProps } from "./FormItem"
export { ObjectField } from "./ObjectField"
export type { ObjectFieldProps } from "./ObjectField"
export { PlainField } from "./PlainField"
export type { PlainFieldProps } from "./PlainField"

export * from "@usaform/vue"

import type { FormConfig as _FormConfig } from "@usaform/vue"
export interface FormConfig extends _FormConfig {
  Elements?: Record<string, any>
  Rules?: Record<string, RuleItem>
}
