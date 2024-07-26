import { SlotsType, computed, defineComponent, h, reactive, ref, unref } from "vue"
import { FormActionCallInfo } from "../actions/hooks"
import { isPlainObject } from "../shared/check"
import { callFuncWithError, createFormCFieldToJson, resolveScopeElement } from "../shared/helper"
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
        fieldAttrs: attrs,
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
