import { mount } from "@vue/test-utils"
import SlotRender from "./Slot.render.vue"

it.skip("string key slot")
it.skip("component slot")
it.skip("function slot")

describe("slot", () => {
  it("field inner slot", () => {
    const wrapper = mount(SlotRender)
    expect(wrapper.find(".slot-default").exists()).toBeTruthy()
    expect(wrapper.find(".slot-4").exists()).toBeTruthy()
  })

  it("string key slot", () => {
    const wrapper = mount(SlotRender)
    expect(wrapper.find(".slot-1").exists()).toBeTruthy()
  })

  it("function slot", () => {
    const wrapper = mount(SlotRender)
    expect(wrapper.find(".slot-2").exists()).toBeTruthy()
  })

  it("component slot", () => {
    const wrapper = mount(SlotRender)
    expect(wrapper.find(".slot-3").exists()).toBeTruthy()
  })
})
