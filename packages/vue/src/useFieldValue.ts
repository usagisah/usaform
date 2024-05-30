import { Ref, ShallowRef, nextTick, shallowRef, unref, watch } from "vue"

export type FieldGetter = () => any
export type FieldSetter = (value: any) => any

export type FieldSubscribeHandle = (newValue: any, oldValue: any) => any
export type FieldSubscribeConfig = { immediate?: boolean }
export type FieldUnSubscribe = () => void
export type FieldSubscribe = (handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => FieldUnSubscribe
export type FieldClearSubscribes = () => void

export type FieldValue = {
  fieldKey: ShallowRef<number>
  fieldValue: Ref<any>
  getter: () => any
  setter: FieldSetter
  subscribe: FieldSubscribe
  clearSubscribers: FieldClearSubscribes
}

export function useFieldValue(value: any): FieldValue {
  const subscribers: FieldSubscribeHandle[] = []
  const fieldValue = shallowRef(value)
  watch(fieldValue, (newValue, oldValue) => {
    for (const fn of subscribers) {
      try {
        fn(newValue, oldValue)
      } catch (e) {
        console.error(e)
      }
    }
  })

  const getter: FieldGetter = () => unref(fieldValue)
  const setter: FieldSetter = (_value: any) => {
    const key = ++fieldKey.value
    nextTick(() => {
      if (key !== fieldKey.value) return
      fieldValue.value = _value
    })
  }
  const subscribe: FieldSubscribe = (handle, config = {}) => {
    subscribers.push(handle)

    const { immediate } = config
    if (immediate) {
      try {
        handle(unref(fieldValue), undefined)
      } catch (e) {
        console.error(e)
      }
    }

    return () => {
      const i = subscribers.indexOf(handle)
      if (i > -1) subscribers.splice(i, 1)
    }
  }
  const clearSubscribers: FieldClearSubscribes = () => {
    subscribers.length = 0
  }

  const fieldKey = shallowRef(0)
  return { fieldValue, fieldKey, getter, setter, subscribe, clearSubscribers }
}
