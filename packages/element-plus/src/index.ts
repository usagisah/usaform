import { RuleItem } from "async-validator"

export { ArrayField } from "./ArrayField.jsx"
export { Form } from "./Form.jsx"
export type { FormExpose, FormProps, FormValidateError } from "./Form.jsx"
export { FormItem } from "./FormItem.jsx"
export type { FormItemProps } from "./FormItem.jsx"
export { ObjectField } from "./ObjectField.jsx"
export type { VoidFieldProps } from "./ObjectField.jsx"
export { PlainField } from "./PlainField.jsx"
export type { PlainFieldProps } from "./PlainField.jsx"

export * from "@usaform/vue"

interface FormConfig {
  Elements?: Record<string, any>
  Rules?: Record<string, RuleItem>
}
