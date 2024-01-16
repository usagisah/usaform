import { FormActionCallInfo, ObjectFieldActions, useFormObjectField } from "@usaform/vue"
import { Ref, SlotsType, defineComponent, h, ref } from "vue"
import { CFormRuleItem } from "./Form"
import { callFuncWithError } from "./helper"

export interface CObjectFieldProps {
  name: string | number

  initValue?: any

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export interface CObjectFieldLayoutInfo {
  type: "object"
  fieldValue: Ref<any>
  actions: ObjectFieldActions
  Rules: Record<any, CFormRuleItem>
  children: (p: Record<any, any>) => any
}

export const ObjectField = defineComponent({
  name: "ObjectField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: { actions: ObjectFieldActions; fieldValue: any; [x: string]: any }
  }>,
  setup(props: CObjectFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    const fieldLayoutRef = ref<Record<any, any> | null>(null)
    const fieldElementRef = ref<Record<any, any> | null>(null)
    let FieldLayout: any
    let FieldElement: any
    let FieldSlot = slots.default
    let gLayoutProps: any
    let gFieldRules: any
    const { fieldValue, render, actions } = useFormObjectField(name, ({ initValue, formConfig }) => {
      const { Elements, layoutProps, Rules } = formConfig
      FieldLayout = Elements![layout as any]
      FieldElement = Elements![element as any]
      gLayoutProps = layoutProps
      gFieldRules = Rules
      return {
        initValue: initValue ?? props.initValue,
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

    return render(() => {
      if (FieldLayout) {
        const children = (p: any) => {
          const { bind, ..._p } = p
          const _props = { ..._p, ...props.props, fieldValue: fieldValue.value, actions, ref: fieldElementRef }
          return FieldElement ? [h(FieldElement, _props)] : FieldSlot?.(_props)
        }
        const info: CObjectFieldLayoutInfo = { type: "object", fieldValue, actions, Rules: gFieldRules, children }
        return h(FieldLayout, {
          ...gLayoutProps,
          ...props.layoutProps,
          __fieldInfo: info,
          ref: fieldLayoutRef
        })
      }
      const _props = { ...props.props, fieldValue: fieldValue.value, actions, ref: fieldElementRef }
      return FieldElement ? h(FieldElement, _props) : FieldSlot?.(_props)
    })
  }
})
