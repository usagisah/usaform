import { provide } from "vue"
import { Field, FormConfig } from "./form.helper"

export interface FormContext {
  root: Field
  field: Field

  defaultValue: any
  currentInitValue: any

  arrayUnwrapKey: string[]

  formConfig: FormConfig
}

export const formContext = Symbol()

export const formGlobalContext = Symbol()
export const createGlobalFormProvide = (config: FormConfig) => {
  provide(formGlobalContext, config)
}

export let GlobalInfo = {
  nullPlainField: "非法的 PlainField 嵌套"
}
