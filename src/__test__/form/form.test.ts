import { mount } from "@vue/test-utils"
import ToggleDisabledByConfig from "./components/ToggleDisabledByConfig.vue"
import ToggleDisabledByFieldProps from "./components/ToggleDisabledByFieldProps.vue"

describe("form actions", () => {
  it("toggle disabled by config", async () => {
    const wrapper = mount(ToggleDisabledByConfig)
    const { setDisabled } = wrapper.vm

    await setDisabled(true)
    expect(wrapper.findAll("[disabled]").length).toBe(3)
    await setDisabled(false)
    expect(wrapper.findAll("[disabled]").length).toBe(0)
  })

  it("toggle disabled by field props", async () => {
    const wrapper = mount(ToggleDisabledByFieldProps)
    const { setDisabled } = wrapper.vm

    await setDisabled(true)
    expect(wrapper.findAll("[disabled]").length).toBe(3)

    await setDisabled(false)
    expect(wrapper.findAll("[disabled]").length).toBe(0)
  })
})
