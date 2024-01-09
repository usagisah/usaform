import { useFormObjectFiled } from "@usaform/vue"
import { defineComponent, h } from "vue"

export interface VoidFieldProps {
  name: string | number

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}
export const ObjectField = defineComponent({
  name: "ObjectField",
  props: ["name", "layout", "layoutProps", "element", "props"],
  setup(props: VoidFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    let FieldLayout: any
    let FieldElement: any
    useFormObjectFiled(name, ({ formConfig }) => {
      const Elements = formConfig.Elements ?? []
      FieldLayout = Elements[layout!]
      FieldElement = Elements[element!]
      return {}
    })

    return () => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...props.layoutProps,
          children(p: any) {
            return FieldElement ? [h(FieldElement, { ...props.props, ...p })] : slots.default?.({ ...props.props, ...p })
          }
        })
      }
      return FieldElement ? h(FieldElement, props.props) : slots.default?.(props.props)
    }
  }
})
