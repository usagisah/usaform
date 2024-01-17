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