import { ObjectFieldActions, useFormObjectField } from "@usaform/vue"
import { SlotsType, defineComponent, h } from "vue"

export interface CObjectFieldProps {
  name: string | number

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export const ObjectField = defineComponent({
  name: "ObjectField",
  props: ["name", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default?: { actions: ObjectFieldActions } & Record<any, any>
  }>,
  setup(props: CObjectFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    let FieldLayout: any
    let FieldElement: any
    let FieldSlot = slots.default
    let gLayoutProps: any
    const { render, actions } = useFormObjectField(name, ({ formConfig }) => {
      const { Elements, layoutProps } = formConfig
      FieldLayout = Elements![layout as any]
      FieldElement = Elements![element as any]
      gLayoutProps = layoutProps
      return {}
    })

    return render(() => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...gLayoutProps,
          ...props.layoutProps,
          children(p: any) {
            const _props = { ...props.props, ...p, actions }
            return FieldElement ? [h(FieldElement, _props)] : FieldSlot?.(_props)
          }
        })
      }
      const _props = { ...props.props, actions }
      return FieldElement ? h(FieldElement, _props) : FieldSlot?.(_props)
    })
  }
})
