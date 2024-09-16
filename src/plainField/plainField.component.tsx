import { SlotsType, computed, defineComponent, h, reactive, shallowReactive, shallowRef, unref } from "vue"
import { FormActionCallInfo } from "../actions/hooks"
import { CFormItemExpose } from "../controller/FormItem.type"
import { isPlainObject } from "../shared/check"
import { FieldComponentConfig, resolveFieldComponentConfig } from "../shared/field"
import { callFuncWithError, createFormCFieldToJson } from "../shared/helper"
import { Obj } from "../shared/type"
import { useFormPlainField } from "./plainField"
import { CPlainFieldLayoutInfo, CPlainFieldProps } from "./plainField.type"

export const PlainField = defineComponent<CPlainFieldProps>({
  name: "PlainField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props", "modelValue", "slots"] as any as undefined,
  slots: Object as SlotsType<{
    default: (props: { bind?: Record<any, any> } & Record<any, any>) => any
  }>,
  setup(props, { slots, attrs }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 PlainField 组件"
    }

    let fieldComponentConfig: FieldComponentConfig
    const fieldLayoutRef = shallowRef<(CFormItemExpose & Obj) | null>(null)
    const fieldElementRef = shallowRef<Obj | null>(null)
    const outerProps = shallowReactive({ props: {} as Obj, layoutProps: {} as Obj })
    const { fieldValue, actions } = useFormPlainField(name, ({ initValue, formConfig }) => {
      fieldComponentConfig = resolveFieldComponentConfig("plain", formConfig, props, slots)
      return {
        initValue: initValue === undefined ? props.initValue : initValue,
        toJson: createFormCFieldToJson(props, layout, element, fieldComponentConfig.fieldSlotsMap),
        reset: () => {
          fieldValue.value = props.initValue
          fieldLayoutRef.value?.setValidateState({ status: "", message: "" })
        },
        validate({ path }: FormActionCallInfo) {
          return fieldLayoutRef.value?.validate(path, fieldValue.value)
        },
        setProps(_: FormActionCallInfo, setter: any) {
          let res = setter({ ...outerProps })
          if (!isPlainObject(res)) {
            res = {}
          }

          const { props, layoutProps } = res
          if (isPlainObject(props)) outerProps.props = props
          if (isPlainObject(layoutProps)) outerProps.layoutProps = layoutProps
        },
        callLayout(_: FormActionCallInfo, { key, point, params }: Obj) {
          return callFuncWithError(() => {
            const f = fieldLayoutRef.value?.[key]
            if (typeof f === "function") f.apply(point, params)
          })
        },
        callElement(_: FormActionCallInfo, { key, point, params }: Obj) {
          return callFuncWithError(() => {
            const f = fieldElementRef.value?.[key]
            if (typeof f === "function") f.apply(point, params)
          })
        }
      }
    })

    const { fieldElement, fieldLayout, fieldSlots, gLayoutProps, gRules, vModel, formConfig } = fieldComponentConfig!
    const setFieldValue = (v: any) => (fieldValue.value = v)
    const plainControllerProps = computed<CPlainFieldLayoutInfo>(() => {
      return {
        type: "plain",
        fieldValue,
        actions,
        props: { ...reactive(props.props ?? {}), ...outerProps.props },
        layoutProps: { ...unref(gLayoutProps), ...reactive(props.layoutProps ?? {}), ...outerProps.layoutProps },
        Rules: unref(gRules),
        formConfig: formConfig,
        fieldAttrs: attrs,
        children: resolveRenderElement
      }
    })
    const resolveRenderElement = ({ bind, props }: Obj = {}) => {
      if (fieldElement) {
        return h(fieldElement, { ...props, [vModel.v]: fieldValue.value, [vModel.e]: setFieldValue, actions, ref: fieldElementRef }, fieldSlots)
      } else {
        return fieldSlots.default?.({ bind: { ...bind, [vModel.v]: fieldValue.value, [vModel.e]: setFieldValue, ref: fieldElementRef }, value: fieldValue.value, actions })
      }
    }

    return () => {
      return fieldLayout ? h(fieldLayout, { FormControllerProps: plainControllerProps.value, ref: fieldLayoutRef }) : resolveRenderElement()
    }
  }
})
