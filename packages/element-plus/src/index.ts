import { RuleItem } from "async-validator"

export { ArrayField } from "./ArrayField.jsx"
export type { CArrayFieldAttrs, CArrayFieldProps } from "./ArrayField.jsx"
export { Form } from "./Form.jsx"
export type { CFormExpose, CFormProps, CFormValidateError, useFormConfigProvide } from "./Form.jsx"
export { FormItem } from "./FormItem.jsx"
export type { FormItemAttrs, FormItemExpose, FormItemProps } from "./FormItem.jsx"
export { ObjectField } from "./ObjectField.jsx"
export type { CObjectFieldProps } from "./ObjectField.jsx"
export { PlainField } from "./PlainField.jsx"
export type { CPlainFieldProps } from "./PlainField.jsx"

export * from "@usaform/vue"

import type { FormConfig as _FormConfig } from "@usaform/vue"

declare module "@usaform/vue" {
  export interface FormConfig {
    Elements?: Record<any, any>
    Rules?: Record<any, RuleItem>
    layoutProps?: Record<any, RuleItem>
  }
}
