import { FormActionCallInfo, PlainFieldActions, useFormPlainField } from "@usaform/vue"
import { Ref, SlotsType, defineComponent, h, ref } from "vue"
import { CFormRuleItem } from "./Form"
import { CFormItemExpose } from "./FormItem"
import { callFuncWithError } from "./helper"

export interface CPlainFieldProps {
  name: string | number

  initValue?: any

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export interface CPlainFieldLayoutInfo {
  type: "plain"
  fieldValue: Ref<any>
  actions: PlainFieldActions
  Rules: Record<any, CFormRuleItem>
  children: (p: Record<any, any>) => any
}

export const PlainField = defineComponent({
  name: "PlainField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: { bind: { modelValue: any; "onUpdate:modelValue": (e: any) => any } } & Record<any, any>
  }>,
  setup(props: CPlainFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 PlainField 组件"
    }

    const fieldLayoutRef = ref<(CFormItemExpose & Record<any, any>) | null>(null)
    const fieldElementRef = ref<Record<any, any> | null>(null)

    let FieldLayout: any = null
    let FieldElement: any = null
    let gFieldRules: Record<any, CFormRuleItem>
    let gLayoutProps: any
    let FieldSlot = slots.default
    const { fieldValue, actions } = useFormPlainField(name, ({ initValue, formConfig }) => {
      const { Elements, Rules, layoutProps, defaultValue } = formConfig
      FieldLayout = Elements![layout as any]
      FieldElement = Elements![element as any]
      gFieldRules = Rules!
      gLayoutProps = layoutProps!

      return {
        initValue: initValue ?? props.initValue,
        reset: () => {
          fieldValue.value = defaultValue
          fieldLayoutRef.value?.setValidateState({ error: false, message: "" })
        },
        validate({ path }: FormActionCallInfo) {
          return fieldLayoutRef.value?.validate(path, fieldValue.value)
        },
        callLayout(_: any, { key, point, params }: FormActionCallInfo) {
          return callFuncWithError(() => {
            const f = fieldLayoutRef.value?.[key]
            if (typeof f === "function") f.apply(point, params)
          })
        },
        callElement(_: any, { key, point, params }: FormActionCallInfo) {
          return callFuncWithError(() => {
            const f = fieldElementRef.value?.[key]
            if (typeof f === "function") f.apply(point, params)
          })
        }
      }
    })
    const setFieldValue = (v: any) => {
      fieldValue.value = v
    }

    const resolveElement = (p: any = {}) => {
      const { bind, ..._p } = p
      if (FieldElement) {
        return [h(FieldElement, { ..._p, ...props.props, modelValue: fieldValue.value, "onUpdate:modelValue": setFieldValue, actions, ref: fieldElementRef })]
      } else {
        return FieldSlot?.({ ..._p, ...props.props, ref: fieldElementRef, bind: { ...bind, modelValue: fieldValue.value, "onUpdate:modelValue": setFieldValue, ref: fieldElementRef } })
      }
    }

    return () => {
      if (FieldLayout) {
        const info: CPlainFieldLayoutInfo = { type: "plain", fieldValue, actions, Rules: gFieldRules, children: resolveElement }
        return h(FieldLayout, {
          ...gLayoutProps,
          ...props.layoutProps,
          __fieldInfo: info,
          ref: fieldLayoutRef
        })
      }
      return resolveElement()
    }
  }
})
