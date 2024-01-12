import { useFormObjectField } from "@usaform/vue"
import { defineComponent, h } from "vue"

export interface ObjectFieldProps {
  name: string | number

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export const ObjectField = defineComponent({
  name: "ObjectField",
  props: ["name", "layout", "layoutProps", "element", "props"],
  setup(props: ObjectFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    let FieldLayout: any
    let FieldElement: any
    const { render, actions } = useFormObjectField(name, ({ formConfig }) => {
      const Elements = formConfig.Elements ?? []
      FieldLayout = Elements[layout!]
      FieldElement = Elements[element!]
      return {}
    })

    return render(() => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...props.layoutProps,
          children(p: any) {
            const _props = { ...props.props, ...p, actions }
            return FieldElement ? [h(FieldElement, _props)] : slots.default?.(_props)
          }
        })
      }
      const _props = { ...props.props, actions }
      return FieldElement ? h(FieldElement, _props) : slots.default?.(_props)
    })
  }
})
