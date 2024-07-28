import { getCurrentInstance, nextTick, onBeforeUnmount } from "vue"
import { Field, FieldName, RootField } from "./form/field.type"

export function onNextTick(fn: () => any) {
  const ins = getCurrentInstance()
  nextTick(() => {
    const f = fn()
    if (typeof f === "function") {
      onBeforeUnmount(f, ins)
    }
  })
}

export type FormStructJson = { type: "root" | "plain" | "object" | "ary" | "void"; name: FieldName; children?: FormStructJson[] } & Record<any, any>
function fieldToJson(field: Field, realName?: FieldName): FormStructJson {
  switch (field.type) {
    case "root":
    case "object": {
      const { type, name, struct, toJson } = field
      return {
        type,
        name: realName ?? name,
        children: Array.from(struct.entries())
          .sort((a, b) => a[1].order - b[1].order)
          .map(item => fieldToJson(item[1])),
        ...toJson?.()
      }
    }
    case "plain": {
      const { type, name, toJson } = field
      return { type, name: realName ?? name, ...toJson?.() }
    }
    case "ary": {
      const { type, name, struct, toJson } = field
      return {
        type,
        name: realName ?? name,
        children: struct.map((item, index) => fieldToJson(item, index)),
        ...toJson?.()
      }
    }
    case "void": {
      const { type, name, userConfig, toJson } = field
      return { type, name: realName ?? name, config: userConfig, ...toJson?.() }
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
