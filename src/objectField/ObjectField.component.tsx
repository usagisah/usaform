import { SlotsType, computed, defineComponent, h, reactive, shallowRef, unref } from "vue"
import { FormActionCallInfo } from "../actions/hooks"
import { FieldComponentConfig, resolveFieldComponentConfig } from "../shared/field"
import { callFuncWithError, createFormCFieldToJson } from "../shared/helper"
import { Obj } from "../shared/type"
import { useFormObjectField } from "./objectField"
import { CObjectFieldLayoutInfo, CObjectFieldProps, ObjectFieldActions } from "./objectField.type"

export const ObjectField = defineComponent<CObjectFieldProps>({
  name: "ObjectField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"] as any as undefined,
  slots: Object as SlotsType<{
    default: (props: { actions: ObjectFieldActions; fieldValue: any; [x: string]: any }) => any
  }>,
  setup(props, { slots, attrs }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 ObjectField 组件"
    }

    let fieldComponentConfig: FieldComponentConfig
    const fieldLayoutRef = shallowRef<Obj | null>(null)
    const fieldElementRef = shallowRef<Obj | null>(null)
    const { fieldValue, FieldRender, actions } = useFormObjectField(name, ({ initValue, formConfig }) => {
      fieldComponentConfig = resolveFieldComponentConfig("object", formConfig, props, slots)
      return {
        initValue: initValue === undefined ? props.initValue : initValue,
        toJson: createFormCFieldToJson(props, layout, element, fieldComponentConfig.fieldSlotsMap),
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

    const { fieldElement, fieldLayout, fieldSlots, gLayoutProps, gRules, formConfig } = fieldComponentConfig!
    const objectControllerProps = computed<CObjectFieldLayoutInfo>(() => {
      return {
        type: "object",
        fieldValue,
        actions,
        props: props.props ?? {},
        layoutProps: { ...unref(gLayoutProps), ...reactive(props.layoutProps ?? {}) },
        Rules: unref(gRules),
        formConfig: formConfig,
        fieldAttrs: attrs,
        children: resolveRenderElement
      }
    })
    const resolveRenderElement = ({ props, bind }: Obj = {}) => {
      if (fieldElement) {
        return h(fieldElement, { ...props, fieldValue: fieldValue.value, actions, ref: fieldElementRef })
      } else {
        return fieldSlots.default?.({ bind: { ...bind, ref: fieldElementRef }, value: fieldValue.value, actions })
      }
    }

    return () => {
      return <FieldRender>{fieldLayout ? h(fieldLayout, { FormControllerProps: objectControllerProps.value, ref: fieldLayoutRef }) : resolveRenderElement()}</FieldRender>
    }
  }
})
