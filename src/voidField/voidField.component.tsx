import { SlotsType, defineComponent, h, unref } from "vue"
import { createFormCFieldToJson, resolveScopeElement } from "../shared/helper"
import { useFormVoidField } from "./voidField"
import { CVoidFieldProps } from "./voidField.type"

export const VoidField = defineComponent<CVoidFieldProps>({
  name: "VoidField",
  props: ["name", "element"] as any as undefined,
  slots: Object as SlotsType<{
    default: () => any
  }>,
  setup(props, { slots, attrs }) {
    let { name, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    useFormVoidField(name, ({ formConfig }) => {
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
