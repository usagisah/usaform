import { Ref, ref, unref, watch } from "vue"

export type FieldGetter = () => any
export type FieldSetter = (value: any) => any

export type FieldSubscribeHandle = (newValue: any, oldValue: any) => any
export type FieldUnSubscribe = () => void
export type FieldSubscribe = (handle: FieldSubscribeHandle, skip?: boolean) => FieldUnSubscribe
export type FieldClearSubscribes = () => void

export type FieldValue = {
  fieldKey: Ref<number>
  fieldValue: Ref<any>
  getter: () => any
  setter: FieldSetter
  subscribe: FieldSubscribe
  clearSubscribers: FieldClearSubscribes
}

export function useFieldValue(value: any): FieldValue {
  const subscribers: [FieldSubscribeHandle, boolean][] = []
  let customSetter = false
  const fieldValue = ref(value)
  watch(fieldValue, (newValue, oldValue) => {
    for (const item of subscribers) {
      try {
        if (customSetter && item[1]) continue
        item[0](newValue, oldValue)
      } catch (e) {
        console.error(e)
      }
    }
    customSetter = false
  })

  const getter: FieldGetter = () => unref(fieldValue)
  const setter: FieldSetter = (_value: any) => {
    customSetter = true
    fieldValue.value = _value
  }
  const subscribe: FieldSubscribe = (handle, skip = false) => {
    const item: [FieldSubscribeHandle, boolean] = [handle, skip]
    subscribers.push(item)
    return () => {
      const i = subscribers.indexOf(item)
      if (i > -1) subscribers.splice(i, 1)
    }
  }
  const clearSubscribers: FieldClearSubscribes = () => {
    subscribers.length = 0
  }

  const fieldKey = ref(0)
  return { fieldValue, fieldKey, getter, setter, subscribe, clearSubscribers }
}
