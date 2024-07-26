import { App, computed, defineComponent, hasInjectionContext, inject, provide, toRaw, unref } from "vue"
import { FormItem } from "../controller/FormItem"
import { FormConfig } from "./form.type"

export function normalizeFormConfig(currentConfig: FormConfig): FormConfig {
  const { Elements, Rules, layoutProps, ...c } = currentConfig
  const parentConfig = (hasInjectionContext() ? inject(FormContextConfigKey) : {}) as FormConfig
  const config = { plainFieldController: "FormItem", ...parentConfig, ...c }

  config.Elements = computed(() => ({ FormItem, ...unref(parentConfig.Elements), ...unref(Elements) }))
  config.Rules = computed(() => ({ ...unref(parentConfig.Rules), ...unref(Rules) }))
  config.layoutProps = computed(() => ({ ...unref(parentConfig.layoutProps), ...unref(layoutProps) }))

  return config
}

const FormContextConfigKey = "u" + Date.now().toString(16)
export function provideGlobalFormConfig(config: FormConfig, app?: App) {
  const conf = normalizeFormConfig(toRaw(config))
  if (app) app.provide(FormContextConfigKey, conf)
  else if (hasInjectionContext()) provide(FormContextConfigKey, conf)
  return conf
}

export const CFormPlugin = (app: any, config: FormConfig) => {
  provideGlobalFormConfig(config ?? {}, app)
}

export const CFormProvider = defineComponent<{ config: FormConfig }>({
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