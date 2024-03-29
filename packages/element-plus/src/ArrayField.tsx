import { ArrayFieldActions, FormActionCallInfo, useFormArrayField } from "@usaform/vue"
import { Ref, SlotsType, defineComponent, h, ref } from "vue"
import { CFormRuleItem } from "./Form"
import { callFuncWithError, isPlainObject } from "./helper"

export interface CArrayFieldProps {
  name: string | number

  initValue?: any[]

  layout?: string | Record<any, any>
  layoutProps?: Record<any, any>

  element?: string | Record<any, any>
  props?: Record<any, any>
}

export interface CArrayFieldActions extends ArrayFieldActions {
  push: (e: Record<any, any>) => void
  unshift: (e: Record<any, any>) => void
  pop: () => void
  shift: () => void
}

export type CArrayFieldAttrs = {
  fieldValue: any[]
  actions: CArrayFieldActions
} & Record<any, any>

export interface CArrayFieldLayoutInfo {
  type: "array"
  fieldValue: Ref<any[]>
  actions: CArrayFieldActions
  Rules: Record<any, CFormRuleItem>
  children: (p: Record<any, any>) => any
}

export const ArrayField = defineComponent({
  name: "ArrayField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: CArrayFieldAttrs
  }>,
  setup(props: CArrayFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 ArrayField 组件"
    }

    const fieldLayoutRef = ref<Record<any, any> | null>(null)
    const fieldElementRef = ref<Record<any, any> | null>(null)

    let FieldLayout: any
    let FieldElement: any
    let FieldSlot = slots.default

    let gLayoutProps: any
    let gFieldRules: any

    const { fieldValue, actions, FieldRender } = useFormArrayField(name, ({ initValue, formConfig }) => {
      const { Elements, layoutProps, Rules } = formConfig
      if (layout) FieldLayout = isPlainObject(layout) ? layout : Elements![layout]
      if (element) FieldElement = isPlainObject(element) ? element : Elements![element]

      gLayoutProps = layoutProps!
      gFieldRules = Rules!

      return {
        initValue: initValue ?? props.initValue,
        reset() {
          actions.set("", [])
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
    const { delValue, setValue, swap } = actions
    const pop = () => delValue(fieldValue.value.length)
    const shift = () => delValue(-1)
    const push = (e: any) => setValue(fieldValue.value.length, e)
    const unshift = (e: any) => setValue(-1, e)
    const cActions: CArrayFieldActions = { ...actions, push, unshift, pop, shift, swap }

    const resolveElement = (p: any = {}) => {
      const { bind, ..._p } = p
      const _props = { ..._p, ...props.props, fieldValue: fieldValue.value, actions: cActions, ref: fieldElementRef }
      return FieldElement ? [h(FieldElement, _props)] : FieldSlot?.(_props)
    }
    return () => {
      const render = () => {
        if (FieldLayout) {
          const info: CArrayFieldLayoutInfo = { type: "array", fieldValue, actions: cActions, Rules: gFieldRules, children: resolveElement }
          return h(FieldLayout, {
            ...gLayoutProps,
            ...props.layoutProps,
            __fieldInfo: info,
            ref: fieldLayoutRef
          })
        }
        return resolveElement()
      }
      return <FieldRender render={render}></FieldRender>
    }
  }
})
