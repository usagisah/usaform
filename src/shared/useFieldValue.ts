import { ShallowRef, shallowRef, toRaw, unref, watch } from "vue"
import { Field, FieldName } from "../form/field.type"
import { isPlainObject } from "./check"

export type FieldGetter = () => any
export type FieldSetter = (value: any, method?: string) => any

export type FieldSubscribeHandle = (newValue: any, oldValue: any, info: { name: FieldName }) => any
export type FieldSubscribeConfig = { immediate?: boolean }
export type FieldUnSubscribe = () => void
export type FieldSubscribe = (handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => FieldUnSubscribe
export type FieldClearSubscribes = () => void

export type CreateFieldValueOptions<T> = {
  value: T
  actions: Record<any, any>
  getField: () => Field
}

export type FieldValue = {
  fieldValue: ShallowRef<any>
  getter: () => any
  setter: FieldSetter
  subscribe: FieldSubscribe
  clearSubscribers: FieldClearSubscribes
}

export function useFieldValue<T>({ value, actions, getField }: CreateFieldValueOptions<T>): FieldValue {
  const fieldValue = shallowRef(value)
  const subscribers: FieldSubscribeHandle[] = []

  watch(fieldValue, (newValue, oldValue) => {
    const field = getField()
    for (const fn of subscribers) {
      try {
        fn(newValue, oldValue, { name: field.name })
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

    const field = getField()
    recursiveSetter(field, _value)
  }

  const subscribe: FieldSubscribe = (handle, config = {}) => {
    subscribers.push(handle)

    const { immediate } = config
    if (immediate) {
      try {
        const field = getField()
        handle(unref(fieldValue), undefined, { name: field.name })
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

  return { fieldValue, getter, setter, subscribe, clearSubscribers }
}

function recursiveSetter(field: Field, value: any) {
  value = toRaw(value)
  switch (field.type) {
    case "root":
    case "object": {
      if (isPlainObject(value)) {
        for (const key in value) {
          const subField = field.struct.get(key)
          if (subField) {
            recursiveSetter(subField, value[key])
          }
        }
      }
      break
    }
    case "plain":
    case "ary": {
      field.fieldValue.value = value
      break
    }
  }
}
