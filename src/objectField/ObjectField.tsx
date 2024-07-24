import { FormActionCallInfo, ObjectFieldActions, useFormObjectField } from "@usaform/vue"
import { Ref, SlotsType, computed, defineComponent, h, reactive, ref, unref } from "vue"
import { CFormConfig, CFormRuleItem } from "./Form"
import { CFormItemProps } from "./controller/FormItem"
import { callFuncWithError, createFormCFieldToJson, isPlainObject, resolveScopeElement } from "./helper"

export interface CObjectFieldProps {
  name: string | number

  initValue?: any

  layout?: string | Record<any, any>
  layoutProps?: CFormItemProps

  element?: string | Record<any, any>
  props?: Record<any, any>
}

export interface CObjectFieldLayoutInfo {
  type: "object"
  fieldValue: Ref<any>
  actions: ObjectFieldActions
  Rules: Record<any, (value: any) => CFormRuleItem>
  props: Record<any, any>
  layoutProps: CFormItemProps
  formConfig: CFormConfig
  fieldProps: Record<any, any>
  children: (p: { bind: Record<any, any>; props: Record<any, any> }) => any
}

export const ObjectField = defineComponent({
  name: "ObjectField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: (props: { actions: ObjectFieldActions; fieldValue: any; [x: string]: any }) => any
  }>,
  setup(props: CObjectFieldProps, { slots, attrs }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 ObjectField 组件"
    }

    const fieldLayoutRef = ref<Record<any, any> | null>(null)
    const fieldElementRef = ref<Record<any, any> | null>(null)

    let FieldLayout: any
    let FieldElement: any
    let FieldSlot = slots.default

    let gLayoutProps: any = {}
    let gFieldRules: any = {}

    let formConfig_ = {} as any

    const { fieldValue, FieldRender, actions } = useFormObjectField(name, ({ initValue, formConfig }) => {
      const { Elements, layoutProps, Rules, objectFieldController } = formConfig
      if (layout) FieldLayout = isPlainObject(layout) ? layout : Elements.value[layout]
      if (!FieldLayout && objectFieldController) FieldLayout = isPlainObject(objectFieldController) ? objectFieldController : Elements.value[objectFieldController]
      if (element) FieldElement = isPlainObject(element) ? element : resolveScopeElement(element, Elements.value)

      gLayoutProps = layoutProps
      gFieldRules = Rules
      formConfig_ = formConfig

      return {
        initValue: initValue === undefined ? props.initValue : initValue,
        toJson: createFormCFieldToJson(props, layout, element),
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

    const controllerProps = computed(() => {
      if (!FieldLayout) return null
      const p: CObjectFieldLayoutInfo = {
        type: "object",
        fieldValue,
        actions,
        props: props.props ?? {},
        layoutProps: { ...unref(gLayoutProps), ...reactive(props.layoutProps ?? {}) },
        Rules: unref(gFieldRules),
        formConfig: formConfig_,
        fieldProps: attrs,
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
      const _props = { ...props.props, fieldValue: fieldValue.value, actions, ref: fieldElementRef }
      return FieldElement ? h(FieldElement, _props) : FieldSlot?.(_props)
    }

    return () => {
      return <FieldRender>{FieldLayout ? h(FieldLayout, { FormControllerProps: controllerProps.value, ref: fieldLayoutRef }) : resolveRenderElement()}</FieldRender>
    }
  }
})
