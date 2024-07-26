import { SlotsType, computed, defineComponent, h, reactive, shallowRef, unref } from "vue"
import { FormActionCallInfo } from "../actions/hooks"
import { FieldComponentConfig, resolveFieldComponentConfig } from "../shared/field"
import { callFuncWithError, createFormCFieldToJson } from "../shared/helper"
import { Obj } from "../shared/type"
import { useFormArrayField } from "./arrayField"
import { CArrayFieldActions, CArrayFieldLayoutInfo, CArrayFieldProps } from "./arrayField.type"

export const ArrayField = defineComponent<CArrayFieldProps>({
  name: "ArrayField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"] as any as undefined,
  slots: Object as SlotsType<{
    default: (props: { fieldValue: any[]; actions: CArrayFieldActions } & Obj) => any
  }>,
  setup(props, { slots, attrs }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 ArrayField 组件"
    }

    let fieldComponentConfig: FieldComponentConfig
    const fieldLayoutRef = shallowRef<Obj | null>(null)
    const fieldElementRef = shallowRef<Obj | null>(null)
    const { fieldValue, actions, FieldRender } = useFormArrayField(name, ({ initValue, formConfig }) => {
      fieldComponentConfig = resolveFieldComponentConfig("array", formConfig, props, slots)
      // const { Elements, layoutProps, Rules, arrayFieldController } = formConfig
      // if (layout) FieldLayout = isPlainObject(layout) ? layout : Elements.value[layout]
      // if (!FieldLayout && arrayFieldController) FieldLayout = isPlainObject(arrayFieldController) ? arrayFieldController : Elements.value[arrayFieldController]
      // if (element) FieldElement = isPlainObject(element) ? element : resolveScopeElement(element, Elements.value)

      // gLayoutProps = layoutProps!
      // gFieldRules = Rules!
      // formConfig_ = formConfig
      return {
        initValue: initValue === undefined ? props.initValue : initValue,
        toJson: createFormCFieldToJson(props, layout, element, fieldComponentConfig.fieldSlotsMap),
        reset() {
          actions.clear()
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

    const { fieldElement, fieldLayout, fieldSlots, gLayoutProps, gRules, formConfig } = fieldComponentConfig!
    const controllerProps = computed<CArrayFieldLayoutInfo>(() => {
      return {
        type: "array",
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

    const resolveRenderElement = ({ bind, props }: Obj = {}) => {
      if (fieldElement) {
        return h(fieldElement, { ...props, fieldValue: fieldValue.value, actions, ref: fieldElementRef })
      } else {
        return fieldSlots.default?.({ bind: { ...bind, ref: fieldElementRef }, value: fieldValue.value, actions })
      }
    }

    return () => {
      return <FieldRender>{fieldLayout ? h(fieldLayout, { FormControllerProps: controllerProps.value, ref: fieldLayoutRef }) : resolveRenderElement()}</FieldRender>
    }
  }
})
