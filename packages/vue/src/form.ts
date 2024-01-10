import { provide, toRaw } from "vue"
import { FormBaseActions, useFormActions } from "./actions/hooks"
import { FormContext, formContext } from "./context"
import { BaseFiled, Field, FieldName, FormConfig } from "./form.helper"

export interface RootField extends BaseFiled {
  type: "root"
  struct: Map<FieldName, Field>
}

export interface FormActions extends FormBaseActions {
  provide: () => void
}

export function useForm(formConfig: FormConfig) {
  const field = { type: "root", struct: new Map(), __uform_field: true } as RootField
  const actions = useFormActions(field, field)

  function formProvide() {
    const { defaultValue, defaultFormData } = toRaw(formConfig)
    const context: FormContext = {
      field,
      root: field,
      defaultValue,
      currentInitValue: defaultFormData,
      formConfig
    }
    provide(formContext, context)
  }

  return { ...actions, provide: formProvide }
}
