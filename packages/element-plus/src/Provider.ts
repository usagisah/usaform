import { App, computed, defineComponent, hasInjectionContext, inject, provide, toRaw, unref } from "vue"
import { CFormConfig } from "./Form"
import { FormItem } from "./controller/FormItem"

export function normalizeFormConfig(currentConfig: CFormConfig): CFormConfig {
  const { Elements, Rules, layoutProps, ...c } = currentConfig
  const parentConfig = (hasInjectionContext() ? inject(FormContextConfigKey) : {}) as CFormConfig
  const config = { ...parentConfig, ...c }

  config.Elements = computed(() => ({ FormItem, ...unref(parentConfig.Elements), ...unref(Elements) }))
  config.Rules = computed(() => ({ ...unref(parentConfig.Rules), ...unref(Rules) }))
  config.layoutProps = computed(() => ({ ...unref(parentConfig.layoutProps), ...unref(layoutProps) }))
  if (!config.modelValue) config.modelValue = config.modelValue ?? "modelValue"

  return config
}

const FormContextConfigKey = "u" + Date.now().toString(16)
export function provideGlobalFormConfig(config: CFormConfig, app?: App) {
  const conf = normalizeFormConfig(toRaw(config))
  if (app) app.provide(FormContextConfigKey, conf)
  else if (hasInjectionContext()) provide(FormContextConfigKey, conf)
  return conf
}

export const CFormPlugin = (app: any, config: CFormConfig) => {
  provideGlobalFormConfig(config ?? {}, app)
}

export const CFormProvider = defineComponent<{ config: CFormConfig }>({
  name: "FormProvider",
  props: {
    config: {
      type: Object,
      required: true
    }
  } as any as undefined,
  setup(props, { slots }) {
    provideGlobalFormConfig(props.config)
    return () => slots.default?.()
  }
})
