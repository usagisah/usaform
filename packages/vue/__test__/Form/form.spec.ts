import { flushPromises, mount } from "@vue/test-utils"
import { FormActions } from "../../dist/index"
import { BasicForm } from "./components"

describe("useForm actions", () => {
  it("getFormData", async () => {
    const c = mount(BasicForm)
    const actions = c.vm as any as FormActions
    expect(actions.getFormData()).toEqual({ array: [{}] })
    await flushPromises()
    expect(actions.getFormData()).toEqual({ array: [{ plain: 1 }] })
  })

  it("get", async () => {
    const c = mount(BasicForm)
    await flushPromises()
    const actions = c.vm as any as FormActions
    expect(actions.get("array/.*/plain")).toEqual([1])
  })

  it("set", async () => {
    const c = mount(BasicForm)
    await flushPromises()
    const actions = c.vm as any as FormActions
    actions.set("array/.*/plain", 10)
    await flushPromises()
    expect(actions.get("array/.*/plain")).toEqual([10])
  })

  it("subscribe", async () => {
    const c = mount(BasicForm)
    await flushPromises()

    const actions = c.vm as any as FormActions
    const handle = vi.fn()
    actions.subscribe("array/0/plain", handle)

    await c.find("button").trigger("click")
    await flushPromises()
    expect(handle).toHaveBeenCalledOnce()
  })

  it("call", async () => {
    const c = mount(BasicForm)
    await flushPromises()

    const actions = c.vm as any as FormActions
    expect(actions.call("message", null)).toEqual({
      array: "array",
      "array/0": "array",
      "array/0/plain": "plain"
    })
  })

  it("full reRender", async () => {
    const c = mount(BasicForm)
    const actions = c.vm as any as FormActions
    await flushPromises()

    actions.set("", { array: [{ value: { plain: 10 } }] })
    await flushPromises()

    expect(c.findAll("button").length).toBe(2)
    expect(c.html()).toBe(`<button>10</button>\n<button>90</button>`)
  })
})

/* 
call path 完整性
数组增删改查
*/