import { CArrayFieldProps } from "src/arrayField/arrayField.type"
import { FormConfig } from "src/form/form.type"
import { CObjectFieldProps } from "src/objectField/objectField.type"
import { CPlainFieldProps } from "src/plainField/plainField.type"
import { PropType, ShallowRef, defineComponent, h, unref, useAttrs } from "vue"
import { isPlainObject } from "./check"
import { resolveScopeElement } from "./helper"
import { Obj } from "./type"

export function createFieldRender(fieldKey: ShallowRef<number>, fieldValue: ShallowRef<unknown>) {
  let key = fieldKey.value
  return defineComponent({
    name: "FieldRender",
    props: {
      render: {
        required: false,
        type: Function as PropType<() => any>
      }
    },
    setup(props, { slots }) {
      return () => {
        if (key !== fieldKey.value) {
          key = fieldKey.value
          return fieldValue.value, null
        }
        if (props.render) return props.render?.()
        return slots.default?.()
      }
    }
  })
}

export function resolveFieldComponentConfig(
  fieldType: "plain" | "object" | "array",
  formConfig: FormConfig,
  props: CPlainFieldProps | CObjectFieldProps | CArrayFieldProps,
  slots: Obj
) {
  let { Elements, Rules, layoutProps, modelValue } = formConfig
  Elements = unref(Elements!)

  let fieldElement = props.element
  if (fieldElement) {
    fieldElement = isPlainObject(fieldElement) ? fieldElement : resolveScopeElement(fieldElement, Elements)
  }

  let fieldLayout = props.layout
  if (fieldLayout) {
    fieldLayout = isPlainObject(fieldLayout) ? fieldLayout : Elements[fieldLayout]
  } else {
    const controller = formConfig[`${fieldType}FieldController`]
    fieldLayout = isPlainObject(controller) ? controller : Elements[controller!]
  }

  const fieldSlots = slots
  const fieldSlotsMap: Obj = {}
  const propsSlots: Obj = props.slots ?? {}
  for (const k in propsSlots) {
    const v = propsSlots[k]
    if (typeof v === "string") {
      fieldSlots[k] = resolveScopeElement(v, Elements)
      fieldSlotsMap[k] = v
    } else if (isPlainObject(v) && "setup" in v) {
      fieldSlots[k] = () => [h(v, useAttrs())]
    } else {
      fieldSlots[k] = v
    }
  }

  if (typeof props.modelValue === "string") modelValue = props.modelValue
  if (!modelValue) modelValue = "modelValue"
  const vModel = { v: modelValue, e: "onUpdate:" + modelValue }

  return {
    fieldElement,
    fieldLayout,
    fieldSlots,
    fieldSlotsMap,
    vModel,
    gLayoutProps: layoutProps!,
    gRules: Rules!,
    formConfig
  }
}
export type FieldComponentConfig = ReturnType<typeof resolveFieldComponentConfig>
