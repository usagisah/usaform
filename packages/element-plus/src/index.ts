import { RuleItem } from "async-validator"

export { ArrayField } from "./ArrayField"
export { Form } from "./Form"
export type { FormExpose, FormProps, FormValidateError } from "./Form"
export { FormItem } from "./FormItem"
export type { FormItemProps } from "./FormItem"
export { ObjectField } from "./ObjectField"
export type { VoidFieldProps } from "./ObjectField"
export { PlainField } from "./PlainField"
export type { PlainFieldProps } from "./PlainField"

export * from "@usaform/vue"

interface FormConfig {
  Elements?: Record<string, any>
  Rules?: Record<string, RuleItem>
}
