export function callFuncWithError(fn: (...args: any[]) => any) {
  try {
    return fn()
  } catch (e) {
    console.error(e)
  }
}

export function isPlainObject(target: any): target is Record<string, any> {
  return Object.prototype.toString.call(target) === "[object Object]"
}

export function createFormCFieldToJson(props: Record<any, any>, layout: any, element: any) {
  return function toJson() {
    const json: Record<any, any> = {}
    if (typeof layout === "string") json.layout = layout
    if (typeof element === "string") json.element = element

    const { initValue, props: elemProps, layoutProps } = props
    if (initValue !== undefined) json.initValue = initValue
    if (isPlainObject(elemProps)) json.props = elemProps
    if (isPlainObject(layoutProps)) json.layoutProps = layoutProps

    return json
  }
}

