import { onBeforeUnmount, provide } from "vue"
import { useFormActions } from "../actions/hooks"
import { createFieldRender } from "../shared/field"
import { useFieldValue } from "../shared/useFieldValue"
import { formContext, FormContext } from "./context"
import { RootField } from "./field.type"
import { FormConfig } from "./form.type"

export function useForm(formConfig: FormConfig) {
  const { defaultFormData, arrayUnwrapKey, toJson } = formConfig
  const _arrayUnwrapKey = arrayUnwrapKey ? (Array.isArray(arrayUnwrapKey) ? arrayUnwrapKey : [arrayUnwrapKey]) : ["value", "children"]
  const field: RootField = {
    type: "root",
    name: "root",
    struct: new Map(),
    order: 0,
    parent: undefined,
    userConfig: {},
    toJson,
    __uform_field: true,
    ...useFieldValue({ ...defaultFormData }, {}, () => "root")
  }

  const context: FormContext = {
    field,
    root: field,
    currentInitValue: { ...defaultFormData },
    arrayUnwrapKey: _arrayUnwrapKey,
    formConfig
  }

  function formContextProvide() {
    provide(formContext, context)
    handleUpdate(field, context)
  }

  return {
    field,
    actions: { ...useFormActions(field, field, _arrayUnwrapKey), provide: formContextProvide },
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
