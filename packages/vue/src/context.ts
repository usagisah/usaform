import { provide } from "vue"
import { FormConfig, FormField, NestField } from "./form.helper"

export interface FormContext {
  root: FormField
  field: NestField

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
  invalidField: "非法嵌套",
  nullVoidFieldIndex: "非法嵌套数组字段"
}
