import { onBeforeUnmount, provide, toRaw } from "vue"
import { FormBaseActions, useFormActions } from "./actions/hooks"
import { FormContext, formContext } from "./context"
import { createFieldRender } from "./fieldRender"
import { BaseFiled, Field, FieldName, FormConfig } from "./form.helper"
import { useFieldValue } from "./useFieldValue"

export interface RootField extends BaseFiled {
  type: "root"
  struct: Map<FieldName, Field>
  userConfig: Record<any, any>
}

export interface FormActions extends FormBaseActions {
  provide: () => void
}

export function useForm(formConfig: FormConfig = {}) {
  const { defaultValue, defaultFormData, arrayUnwrapKey, arrayUnwrapArrayKey } = toRaw(formConfig)
  const _arrayUnwrapArrayKey = arrayUnwrapKey ? (Array.isArray(arrayUnwrapKey) ? arrayUnwrapKey : [arrayUnwrapArrayKey]) : ["value", "children"]
  const field: RootField = {
    type: "root",
    name: "root",
    struct: new Map(),
    parent: null,
    userConfig: {},
    __uform_field: true,
    ...useFieldValue({ ...defaultFormData })
  }
  const context: FormContext = {
    field,
    root: field,
    defaultValue,
    currentInitValue: { ...defaultFormData },
    arrayUnwrapKey: _arrayUnwrapArrayKey,
    formConfig
  }

  function formProvide() {
    provide(formContext, context)
    handleUpdate(field, context)
  }

  return {
    actions: { ...useFormActions(field, field, _arrayUnwrapArrayKey), provide: formProvide },
    FieldRender: createFieldRender(field.fieldKey, field.fieldValue)
  }
}

function handleUpdate(_field: RootField, ctx: FormContext) {
  _field.subscribe(() => {
    _field.struct.clear()
    ctx.currentInitValue = { ..._field.getter() }
  })
  onBeforeUnmount(() => {
    _field.struct.clear()
    _field.clearSubscribers()
  })
}
