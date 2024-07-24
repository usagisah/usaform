import { provide } from "vue"
import { FormField, NestField } from "./field.type"
import { FormConfig } from "./form.type"

export interface FormContext {
  root: FormField
  field: NestField
  currentInitValue: unknown
  arrayUnwrapKey: string[]
  formConfig: FormConfig
}

export const formContext = Symbol()