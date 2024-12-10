import { SlotsType, defineComponent, getCurrentInstance, h, unref } from "vue"
import { FieldName } from "../form/field.type"
import { createFormCFieldToJson, resolveScopeElement } from "../shared/helper"
import { useFormVoidField } from "./voidField"
import { CVoidFieldProps } from "./voidField.type"

export const VoidField = defineComponent({
  name: "VoidField",
  props: ["name", "element"] as any as undefined,
  slots: Object as SlotsType<{
    default: () => any
  }>,
  setup(props: CVoidFieldProps, { slots, attrs }) {
    let { element } = props
    const { key } = getCurrentInstance()!.vnode
    if (!key && key !== 0) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    useFormVoidField(key as FieldName, ({ formConfig }) => {
      if (typeof element === "string") {
        element = resolveScopeElement(element, unref(formConfig.Elements!))
      }
      return {
        toJson: createFormCFieldToJson(props, null, element)
      }
    })

    return () => {
      return element ? h(element, attrs) : slots.default?.()
    }
  }
})
