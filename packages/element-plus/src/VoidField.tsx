import { ObjectFieldActions, useFormVoidField } from "@usaform/vue"
import { SlotsType, defineComponent, h } from "vue"
import { createFormCFieldToJson } from "./helper"

export interface CVoidFieldProps {
  name: string | number

  element: string | Record<any, any>
  props?: Record<any, any>
}

export const VoidField = defineComponent({
  name: "VoidField",
  props: ["name", "element", "props"],
  slots: Object as SlotsType<{
    default: { actions: ObjectFieldActions; fieldValue: any; [x: string]: any }
  }>,
  setup(props: CVoidFieldProps, { slots }) {
    let { name, element, props: elementProps } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    useFormVoidField(name, ({ formConfig }) => {
      if (typeof element === "string") {
        element = formConfig.Elements[element]
      }
      return {
        toJson: createFormCFieldToJson(props, null, element)
      }
    })

    return () => {
      return h(element, elementProps)
    }
  }
})
