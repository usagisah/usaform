import { getCurrentInstance, nextTick, onBeforeUnmount } from "vue"

export function onNextTick(fn: () => any) {
  const ins = getCurrentInstance()
  nextTick(() => {
    const f = fn()
    if (typeof f === "function") {
      onBeforeUnmount(f, ins)
    }
  })
}
