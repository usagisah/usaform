import { defineComponent, h, renderSlot } from "vue"
import { ArrayItemParams, useFormObjectFiled } from "@usaform/vue"

export interface VoidFieldProps {
  name: string | number
  layout: string
  layoutProps?: any
  arrayProps?: Partial<ArrayItemParams>
}
export const ObjectField = defineComponent({
  name: "ObjectField",
  props: ["name", "layout", "layoutProps", "arrayProps"],
  setup(props: VoidFieldProps, { slots }) {
    const { name, layout, arrayProps } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 VoidField 组件"
    }

    let FieldLayout: any
    useFormObjectFiled(
      name,
      ({ formConfig }) => {
        const Elements = formConfig.Elements ?? []
        FieldLayout = layout ? Elements[layout] : null
        return {}
      },
      arrayProps
    )

    return () => {
      if (FieldLayout) {
        return h(FieldLayout, { ...(props.layoutProps ?? {}), children: slots.default })
      }
      return renderSlot(slots, "default")
    }
  }
})
