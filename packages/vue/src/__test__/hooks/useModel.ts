import { Ref } from "vue"

export function useModel(ref: Ref<any>) {
  const onInput = (e: any) => (ref.value = e.target.value)
  return () => ({ value: ref.value, onInput })
}
