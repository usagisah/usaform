import { getCurrentInstance, nextTick, onBeforeUnmount } from "vue"
import { RootField } from "./form"
import { Field, FieldName } from "./form.helper"
export function onNextTick(fn: () => any) {
  const ins = getCurrentInstance()
  nextTick(() => {
    const f = fn()
    if (typeof f === "function") {
      onBeforeUnmount(f, ins)
    }
  })
}

export type FormStructJson = {
  type: string
  name: FieldName
  config: Record<any, any>
  children?: FormStructJson[]
}
function fieldToJson(field: Field, realName?: FieldName): FormStructJson {
  switch (field.type) {
    case "root":
    case "object": {
      const { type, name, userConfig, struct } = field
      return {
        type,
        name: realName ?? name,
        config: userConfig,
        children: Array.from(struct.entries())
          .sort((a, b) => a[1].order - b[1].order)
          .map(item => fieldToJson(item[1]))
      }
    }
    case "plain": {
      const { type, name, userConfig } = field
      return { type, name: realName ?? name, config: userConfig }
    }
    case "ary": {
      const { type, name, userConfig, struct } = field
      return {
        type,
        name: realName ?? name,
        config: userConfig,
        children: struct
          .filter(f => {
            try {
              return f["__uform_field"]
            } catch {
              return false
            }
          })
          .sort((a, b) => a.order - b.order)
          .map((field, index) => fieldToJson(field, index))
      }
    }
    case "void": {
      const { type, name, userConfig } = field
      return { type, name: realName ?? name, config: userConfig }
    }
    default: {
      throw "非法的表单节点"
    }
  }
}
export function exportFormStructJson(field: RootField) {
  if (field.type !== "root") {
    throw "非法的表单根节点"
  }

  return fieldToJson(field)
}
