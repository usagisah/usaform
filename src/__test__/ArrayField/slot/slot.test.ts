import { flushPromises, mount } from "@vue/test-utils"
import ArrayFieldRender from "./ArrayField.render.vue"

describe("ArrayField render", () => {
  it("push() data", async () => {
    const wrapper = mount(ArrayFieldRender)

    expect(wrapper.find(".swap").exists()).toBeFalsy()
    expect(wrapper.findAll(".el-input").length).toBe(0)

    wrapper.find(".push").trigger("click")
    await flushPromises()
    expect(wrapper.find(".swap").exists()).toBeFalsy()
    expect(wrapper.findAll("input").length).toBe(1)
    expect(wrapper.findAll("input")[0].element.value).toBe("0")

    wrapper.find(".push").trigger("click")
    await flushPromises()
    expect(wrapper.find(".swap").exists()).toBeTruthy()
    expect(wrapper.findAll(".el-input").length).toBe(2)
    expect(wrapper.findAll("input")[0].element.value).toBe("0")
    expect(wrapper.findAll("input")[1].element.value).toBe("1")
  })

  it("pop() data", () => {
    const wrapper = mount(ArrayFieldRender)
    const btn = wrapper.find(".push")
    btn.trigger("click")
    btn.trigger("click")
    btn.trigger("click")
    
  })
})
