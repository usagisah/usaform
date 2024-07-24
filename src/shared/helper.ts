import { isPlainObject } from "./check"

export function callFuncWithError(fn: (...args: any[]) => any) {
  try {
    return fn()
  } catch (e) {
    console.error(e)
  }
}

export function createFormCFieldToJson(props: Record<any, any>, layout: any, element: any, slots?: Record<string, any>) {
  return function toJson() {
    const json: Record<any, any> = {}
    if (typeof layout === "string") json.layout = layout
    if (typeof element === "string") json.element = element

    const { initValue, props: elemProps, layoutProps } = props
    if (initValue !== undefined) json.initValue = initValue
    if (isPlainObject(elemProps)) json.props = elemProps
    if (isPlainObject(layoutProps)) json.layoutProps = layoutProps
    if (slots) json.slots = slots
    return json
  }
}

export function buildScopeElemKey(key: string) {
  return "_$u" + key
}
export function buildScopeElement(slots: Record<string, any>) {
  const elements: Record<string, any> = {}
  for (const key in slots) {
    if (key === "default") continue
    elements[buildScopeElemKey(key)] = slots[key]
  }
  return elements
}

export function resolveScopeElement(elem: any, Elements: Record<any, any>) {
  let el = Elements[elem]
  if (el) return el

  el = Elements[buildScopeElemKey(elem)]
  if (el) return el

  return elem
}
