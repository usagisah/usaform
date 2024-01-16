export function callFuncWithError(fn: (...args: any[]) => any) {
  try {
    return fn()
  } catch (e) {
    console.error(e)
  }
}
