import { FormStructJson } from "@usaform/vue"
import { DefineComponent, defineComponent, h } from "vue"
import { ArrayField } from "./ArrayField"
import { CFormExpose, CFormProps, useForm } from "./Form"
import { ObjectField } from "./ObjectField"
import { PlainField } from "./PlainField"
import { VoidField } from "./VoidField"
import { buildScopeElement } from "./helper"

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
  arrayKeys?: string[]
}

function createArrayItem(children: JsonFormStructJson[], deep: number, ctx: RenderJsonStructContext) {
  return defineComponent({
    name: "JsonArrayItem",
    inheritAttrs: false,
    props: ["fieldValue"],
    setup(props) {
      return () => {
        const { fieldValue } = props
        return fieldValue.map((item: any, index: number) => {
          const { arrayKeys } = ctx
          const key = arrayKeys.find(k => item[k] !== undefined)
          return (
            <div key={key ? item[key] : Math.random()}>
              {children.map(item => {
                item.name = index
                return renderFormItem(item, deep + 1, ctx)
              })}
            </div>
          )
        })
      }
    }
  })
}

type RenderJsonStructContext = { memo: Map<string, any>; Elements: Record<string, any>; arrayKeys: string[] }
const renderStrategy = { plain: PlainField, object: ObjectField, ary: ArrayField, void: VoidField }
function renderFormItem(struct: JsonFormStructJson, deep = 0, ctx: RenderJsonStructContext): any {
  const { type, children, ...attrs } = struct
  const FormFieldComponent = renderStrategy[type as keyof typeof renderStrategy]
  if (!FormFieldComponent) {
    throw new Error("未知的表单渲染类型")
  }

  let _children: any = undefined
  if (children) {
    if (type === "ary") {
      const { memo, Elements } = ctx
      const key = `_json_${deep}_${type}`
      let memoChildren = memo.get(key)
      if (!memoChildren) memo.set(key, (memoChildren = createArrayItem(children, deep, ctx)))
      Elements[key] = memoChildren
      attrs.element = key
    } else {
      _children = { default: () => children.map(item => renderFormItem(item, deep + 1, ctx)) }
    }
  }

  return h(FormFieldComponent, attrs, _children)
}

export function useJsonForm({ struct, arrayKeys = ["key", "id"], layout, config: formConfig }: JsonFormConfig): CFormExpose & { Form: DefineComponent<{}, {}, any> } {
  const { config, actions, createFormExpose, FieldRender } = useForm(formConfig)
  if (struct.type !== "root") {
    throw "非法的表单根节点"
  }

  actions.provide()
  return {
    ...createFormExpose(),
    Form: defineComponent({
      name: "Form",
      setup(_, { attrs, slots }) {
        const ctx: RenderJsonStructContext = { memo: new Map(), Elements: config.Elements!, arrayKeys }
        Object.assign(config.Elements!, buildScopeElement(slots))
        return () => {
          const childrenSlots = struct.children ? struct.children.map(item => renderFormItem(item, 0, ctx)) : []
          return <FieldRender>{layout ? h(layout, attrs, { default: childrenSlots }) : <div class="u-form">{childrenSlots}</div>}</FieldRender>
        }
      }
    })
  }
}
