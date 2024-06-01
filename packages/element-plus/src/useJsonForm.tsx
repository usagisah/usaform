import { FormStructJson } from "@usaform/vue"
import { DefineComponent, defineComponent, h } from "vue"
import { ArrayField } from "./ArrayField"
import { CFormExpose, CFormProps, useForm } from "./Form"
import { ObjectField } from "./ObjectField"
import { PlainField } from "./PlainField"
import { VoidField } from "./VoidField"

export type JsonFormStructJson = Omit<FormStructJson, "children"> & {
  type: "root" | "plain" | "object" | "ary" | "void"
  layout?: string
  layoutProps?: Record<any, any>
  element?: string
  props?: Record<any, any>
  children?: JsonFormStructJson[]
}
export type JsonFormConfig = CFormProps & {
  struct: JsonFormStructJson
}

const renderStrategy = { plain: PlainField, object: ObjectField, ary: ArrayField, void: VoidField }
function renderFormItem(struct: JsonFormStructJson): any {
  const { type, children, ...attrs } = struct
  const FormFieldComponent = renderStrategy[type as keyof typeof renderStrategy]
  if (!FormFieldComponent) {
    throw new Error("未知的表单渲染类型")
  }
  return h(FormFieldComponent, attrs, children ? children.map(renderFormItem) : undefined)
}

export function useJsonForm({ struct, layout, ...formConfig }: JsonFormConfig): CFormExpose & { Form: DefineComponent<{}, {}, any> } {
  const { provide, createFormRender, FieldRender, ...formExpose } = useForm(formConfig)
  if (struct.type !== "root") {
    throw "非法的表单根节点"
  }

  provide()
  return {
    ...(formExpose as CFormExpose),
    Form: defineComponent({
      name: "Form",
      setup() {
        return () => {
          const childrenSlots = struct.children ? struct.children.map(renderFormItem) : []
          return <FieldRender>{layout ? h(layout, {}, childrenSlots) : <div class="u-form">{childrenSlots}</div>}</FieldRender>
        }
      }
    })
  }
}
