import { FormActionCallInfo, PlainFieldActions, useFormPlainField } from "@usaform/vue"
import { Ref, SlotsType, computed, defineComponent, h, ref } from "vue"
import { CFormRuleItem } from "./Form"
import { CFormItemExpose } from "./controller/helper"
import { callFuncWithError, createFormCFieldToJson, isPlainObject } from "./helper"

export interface CPlainFieldProps {
  name: string | number

  initValue?: any

  layout?: string | Record<any, any>
  layoutProps?: Record<any, any>

  element?: string | Record<any, any>
  props?: Record<any, any>
}

export interface CPlainFieldLayoutInfo {
  type: "plain"
  fieldValue: Ref<any>
  actions: PlainFieldActions
  Rules: Record<any, CFormRuleItem>
  props: Record<any, any>
  layoutProps: Record<any, any>
  children: (p: { bind: Record<any, any>; props: Record<any, any> }) => any
}

export const PlainField = defineComponent({
  name: "PlainField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: (props: { bind?: { modelValue: any; "onUpdate:modelValue": (e: any) => any } } & Record<any, any>) => any
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
    let FieldSlot = slots.default

    let gLayoutProps: any = {}
    let gFieldRules: Record<any, CFormRuleItem>

    const { fieldValue, actions } = useFormPlainField(name, ({ initValue, formConfig }) => {
      const { Elements, Rules, layoutProps } = formConfig
      if (layout) FieldLayout = isPlainObject(layout) ? layout : Elements![layout]
      if (element) FieldElement = isPlainObject(element) ? element : Elements![element]

      gLayoutProps = layoutProps!
      gFieldRules = Rules!

      const _initValue = "initValue" in props ? props.initValue : initValue
      return {
        initValue: _initValue,
        toJson: createFormCFieldToJson(props, layout, element),
        reset: () => {
          fieldValue.value = _initValue
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

    const controllerProps = computed(() => {
      if (!FieldLayout) return null
      const p: CPlainFieldLayoutInfo = {
        type: "plain",
        fieldValue,
        actions,
        props: props.props ?? {},
        layoutProps: { ...gLayoutProps, ...props.layoutProps },
        Rules: gFieldRules,
        children: ({ bind, props }) => {
          const _props = { ...props, modelValue: fieldValue.value, "onUpdate:modelValue": setFieldValue, actions, ref: fieldElementRef }
          if (FieldElement) {
            return [h(FieldElement, _props)]
          } else {
            Object.assign(_props, { bind: { ...bind, modelValue: fieldValue.value, "onUpdate:modelValue": setFieldValue, ref: fieldElementRef } })
            return FieldSlot?.(_props)
          }
        }
      }
      return p
    })

    const resolveRenderElement = () => {
      const _props = { ...props.props, modelValue: fieldValue.value, "onUpdate:modelValue": setFieldValue, actions, ref: fieldElementRef }
      return FieldElement ? h(FieldElement, _props) : FieldSlot?.(_props)
    }

    return () => {
      return FieldLayout ? h(FieldLayout, { FormControllerProps: controllerProps.value, ref: fieldLayoutRef }) : resolveRenderElement()
    }
  }
})
