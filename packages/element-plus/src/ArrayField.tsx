import { ArrayFieldActions, FormActionCallInfo, useFormArrayField } from "@usaform/vue"
import { Ref, SlotsType, computed, defineComponent, h, ref } from "vue"
import { CFormConfig, CFormRuleItem } from "./Form"
import { callFuncWithError, createFormCFieldToJson, isPlainObject } from "./helper"

export interface CArrayFieldProps {
  name: string | number

  initValue?: any[]

  layout?: string | Record<any, any>
  layoutProps?: Record<any, any>

  element?: string | Record<any, any>
  props?: Record<any, any>
}

export interface CArrayFieldActions extends ArrayFieldActions {}

export interface CArrayFieldLayoutInfo {
  type: "array"
  fieldValue: Ref<any[]>
  actions: CArrayFieldActions
  Rules: Record<any, CFormRuleItem>
  props: Record<any, any>
  layoutProps: Record<any, any>
  formConfig: CFormConfig
  children: (p: { bind: Record<any, any>; props: Record<any, any> }) => any
}

export const ArrayField = defineComponent({
  name: "ArrayField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: (props: { fieldValue: any[]; actions: CArrayFieldActions } & Record<any, any>) => any
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

    let formConfig_ = {} as any

    const { fieldValue, actions, FieldRender } = useFormArrayField(name, ({ initValue, formConfig }) => {
      const { Elements, layoutProps, Rules, defaultController } = formConfig
      if (layout) FieldLayout = isPlainObject(layout) ? layout : Elements![layout]
      if (!FieldLayout && defaultController) FieldLayout = isPlainObject(defaultController) ? layout : Elements![defaultController]
      if (element) FieldElement = isPlainObject(element) ? element : Elements![element]

      gLayoutProps = layoutProps!
      gFieldRules = Rules!
      formConfig_ = formConfig

      return {
        initValue: props.initValue === undefined ? props.initValue : initValue,
        toJson: createFormCFieldToJson(props, layout, element),
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
    const cActions: CArrayFieldActions = actions

    const controllerProps = computed(() => {
      if (!FieldLayout) return null
      const p: CArrayFieldLayoutInfo = {
        type: "array",
        fieldValue,
        actions: cActions,
        props: props.props ?? {},
        layoutProps: { ...gLayoutProps, ...props.layoutProps },
        Rules: gFieldRules,
        formConfig: formConfig_,
        children: ({ bind, props }) => {
          const _props = { ...props, fieldValue: fieldValue.value, actions, ref: fieldElementRef }
          if (FieldElement) {
            return [h(FieldElement, _props)]
          } else {
            Object.assign(_props, { bind: { ...bind, ref: fieldElementRef } })
            return FieldSlot?.(_props)
          }
        }
      }
      return p
    })

    const resolveRenderElement = () => {
      const _props = { ...props.props, fieldValue: fieldValue.value, actions: cActions, ref: fieldElementRef }
      return FieldElement ? h(FieldElement, _props) : FieldSlot?.(_props)
    }

    return () => {
      return <FieldRender>{FieldLayout ? h(FieldLayout, { FormControllerProps: controllerProps.value, ref: fieldLayoutRef }) : resolveRenderElement()}</FieldRender>
    }
  }
})
