import { Component, computed, defineComponent, h, nextTick, shallowRef, unref } from "vue"
import { ArrayField } from "../arrayField/arrayField.component"
import { ObjectField } from "../objectField/ObjectField.component"
import { PlainField } from "../plainField/plainField.component"
import { buildScopeElement } from "../shared/helper"
import { VoidField } from "../voidField/voidField.component"
import { useComponentForm } from "./form.component"
import { CFormExpose, JsonFormConfig, JsonFormStructJson, OnForceRenderForm } from "./form.type"

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
const renderStrategy: Record<string, Component> = { plain: PlainField, object: ObjectField, ary: ArrayField, void: VoidField }
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

export function createJsonForm(jsonFormConfig: JsonFormConfig) {
  let prevFlushKey = 0
  const flushKey = shallowRef(prevFlushKey)

  const forceRender = () => {
    formActions.value = { onForceRenderForm } as any
    flushKey.value++
  }

  const forceRenderPost: ((expose: CFormExpose) => any)[] = []
  const onForceRenderForm: OnForceRenderForm = fn => {
    if (typeof fn === "function") forceRenderPost.push(fn)
    return function clean() {
      const index = forceRenderPost.indexOf(fn)
      if (index > -1) forceRenderPost.splice(index, 1)
    }
  }

  const formActions = shallowRef<CFormExpose>({ onForceRenderForm } as any)

  const createFormRender = () => {
    return defineComponent({
      name: "Form",
      setup(_, { attrs, slots, expose }) {
        const { arrayKeys = ["key", "id"], config: formConfig } = jsonFormConfig
        const { config, actions, createFormExpose, FieldRender } = useComponentForm(formConfig)

        const { defaultFormLayout } = config
        const gFormLayout = typeof defaultFormLayout === "string" ? unref(config.Elements!)[defaultFormLayout] : defaultFormLayout

        actions.provide()

        const formExpose = createFormExpose()
        expose((formActions.value = { ...formExpose, onForceRenderForm }))
        if (prevFlushKey !== flushKey.value) {
          // 内部会置空，在重新赋值
          nextTick(() => {
            setTimeout(() => {
              nextTick(() => {
                prevFlushKey = flushKey.value
                forceRenderPost.forEach(fn => fn(formActions.value))
              })
            }, 0)
          })
        }

        const ctx: RenderJsonStructContext = { memo: new Map(), Elements: config.Elements!.value, arrayKeys }
        Object.assign(config.Elements!.value, buildScopeElement(slots))

        return () => {
          const { struct, layout, layoutProps } = jsonFormConfig
          const childrenSlots = struct.map(item => renderFormItem(item, 0, ctx))
          const Layout = typeof layout === "string" ? unref(config.Elements!)[layout] : (layout ?? gFormLayout)
          return (
            <FieldRender>
              {Layout ? (
                h(Layout, { ...layoutProps, ...attrs }, { default: () => childrenSlots })
              ) : (
                <div class="u-form" {...attrs}>
                  {childrenSlots}
                </div>
              )}
            </FieldRender>
          )
        }
      }
    })
  }

  const ProxyForm = defineComponent({
    name: "ProxyForm",
    setup(_, { attrs, slots }) {
      const Form = computed<any>(() => {
        return flushKey.value > -1 && createFormRender()
      })
      return () => h(Form.value, attrs, slots)
    }
  })

  return [(jsonFormConfig.dynamic ?? true) ? ProxyForm : createFormRender(), formActions, forceRender] as const
}
