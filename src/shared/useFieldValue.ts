import { ShallowRef, nextTick, shallowRef, unref, watch } from "vue"
import { FieldName } from "../form/field.type"

export type FieldGetter = () => any
export type FieldSetter = (value: any, method?: string) => any

export type FieldSubscribeHandle = (newValue: any, oldValue: any, info: { name: FieldName }) => any
export type FieldSubscribeConfig = { immediate?: boolean }
export type FieldUnSubscribe = () => void
export type FieldSubscribe = (handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => FieldUnSubscribe
export type FieldClearSubscribes = () => void

export type FieldValue = {
  fieldKey: ShallowRef<number>
  fieldValue: ShallowRef<any>
  getter: () => any
  setter: FieldSetter
  subscribe: FieldSubscribe
  clearSubscribers: FieldClearSubscribes
}

export function useFieldValue<T>(value: T, actions: Record<any, any>, getFieldName: () => FieldName): FieldValue {
  const fieldValue = shallowRef(value)
  const fieldKey = shallowRef(0)
  const subscribers: FieldSubscribeHandle[] = []

  watch(fieldValue, (newValue, oldValue) => {
    for (const fn of subscribers) {
      try {
        fn(newValue, oldValue, { name: getFieldName() })
      } catch (e) {
        console.error(e)
      }
    }
  })

  const getter: FieldGetter = () => unref(fieldValue)

  const setter: FieldSetter = (_value, method) => {
    if (method) {
      return actions[method]?.(_value)
    }
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
        handle(unref(fieldValue), undefined, { name: getFieldName() })
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

  return { fieldValue, fieldKey, getter, setter, subscribe, clearSubscribers }
}
