import { flushPromises, mount } from "@vue/test-utils"
import { reactive } from "vue"
import DynamicPlainFieldRender from "./PlainField.dynamic.vue"
import PlainFieldRender from "./PlainField.render.vue"

describe("slot render", () => {
  it("count", () => {
    const wrapper = mount(PlainFieldRender)
    const items = wrapper.find(".u-form").element.children
    expect(items.length).toBe(6)
  })

  it("native html tag initValue", () => {
    const initValue = "Abc"
    const wrapper = mount(PlainFieldRender, { props: { inputInitValue: initValue } })
    const renderValue = (wrapper.get(".input input").element as HTMLInputElement).value
    expect(renderValue).toBe(initValue)
  })

  // it("custom component initValue", () => {
  // })
})

describe("slot actions", () => {
  it("get()", async () => {
    const wrapper = mount(PlainFieldRender)

    const inputValue1 = "abc"
    await wrapper.get(".input input").setValue(inputValue1)

    const { get } = wrapper.vm.actions
    const res = get("input$")
    expect(Array.isArray(res)).toBeTruthy()
    expect(res).toEqual([["input", inputValue1, "input"]])
    expect(Object.fromEntries(res as any)).toEqual({ input: inputValue1 })
  })

  it("set()", async () => {
    const wrapper = mount(PlainFieldRender)
    const { get, set } = wrapper.vm.actions

    const inputValue1 = "abc"
    set("input$", inputValue1)

    const res = get("input$")
    expect(Array.isArray(res)).toBeTruthy()
    expect(res).toEqual([["input", inputValue1, "input"]])
    expect(Object.fromEntries(res as any)).toEqual({ input: inputValue1 })
  })

  it("getFormData()", () => {
    const wrapper = mount(PlainFieldRender)
    const data = wrapper.vm.actions.getFormData()
    expect(data).toHaveProperty("input")
    expect(data).toHaveProperty("select")
    expect(data).toHaveProperty("inputNumber")
    expect(data).toHaveProperty("radio")
    expect(data).toHaveProperty("checkbox")
    expect(data).toHaveProperty("datePicker")
  })

  it("subscribe()", async () => {
    const wrapper = mount(PlainFieldRender)
    const { subscribe, set } = wrapper.vm.actions

    const fn = vi.fn()
    subscribe("input$", fn)

    set("input$", "a")
    await flushPromises()
    expect(fn).toHaveBeenCalledWith("a", undefined, { name: "input" })

    wrapper.get(".input input").setValue("b")
    await flushPromises()
    expect(fn).toHaveBeenCalledWith("b", "a", { name: "input" })
  })

  it("subscribe() unsubscribe()", async () => {
    const wrapper = mount(PlainFieldRender)
    const { subscribe, set } = wrapper.vm.actions

    const fn = vi.fn()
    const stop = subscribe("input$", fn)

    stop()

    set("input$", "a")
    wrapper.get(".input input").setValue("b")
    await flushPromises()

    expect(fn).not.toHaveBeenCalledOnce()
  })

  it("validate()", async () => {
    const errMsg = "empty input value"
    const wrapper = mount(PlainFieldRender, { props: { inputErrorMessage: errMsg } })
    const errs = await wrapper.vm.actions.validate()

    expect(errs.length >= 1).toBeTruthy()
    expect(errs.filter(v => v.field === "input")).toEqual([{ field: "input", message: errMsg, path: "input" }])
    expect(wrapper.find(".ufi-status-error").exists()).toBeTruthy()

    const ele = wrapper.get(".ufi-content-error").element
    expect(ele.textContent).toBe(errMsg)
  })

  it("reset", async () => {
    const inputInitValue = "mmm"
    const wrapper = mount(PlainFieldRender, { props: { inputInitValue } })
    const { validate, set, get, reset } = wrapper.vm.actions

    // 有默认值，还原到默认值
    set("input$", "zzzzzzzzzz")
    reset()
    await flushPromises()
    expect(get("input$")[0][1]).toBe(inputInitValue)
    expect((wrapper.get(".input input").element as HTMLInputElement).value).toBe(inputInitValue)

    // 没默认值，还原到 undefined
    set("inputNumber", 9999)
    reset()
    await flushPromises()
    expect(get("inputNumber")[0][1]).toBe(undefined)

    // 清空校验状态
    set("input$", "")
    let errs = await validate()
    expect(errs.length).toBe(1)
    reset()
    errs = await validate()
    expect(errs.length).toBe(0)
  })

  it("setProps", async () => {
    const wrapper = mount(PlainFieldRender)
    const { setProps } = wrapper.vm.actions

    const placeholder = "lll"
    setProps("input$", () => {
      return { props: { placeholder } }
    })
    await flushPromises()
    expect(wrapper.get(".input input").attributes()).toHaveProperty("placeholder", placeholder)

    const placeholder1 = "mmmm"
    setProps("input$", extra => {
      expect(extra.props).toHaveProperty("placeholder", placeholder)
      return { props: { placeholder: placeholder1 } }
    })
    await flushPromises()
    expect(wrapper.get(".input input").attributes()).toHaveProperty("placeholder", placeholder1)
  })

  // it("call")
  // it("callElement")
  // it("callLayout")
  // it("onForceRenderForm")
})

describe("dynamic render", () => {
  it("if render and dynamic change formData", async () => {
    const props = reactive({ conditionKeys: ["f1", "f3"] as string[] })
    const wrapper = mount(DynamicPlainFieldRender, { props })
    const { setConditionKeys } = wrapper.vm
    expect(await setConditionKeys(["f2"])).toStrictEqual({ f2: undefined })
    expect(await setConditionKeys(["f1", "f3"])).toStrictEqual({ f1: undefined, f3: undefined })
    expect(await setConditionKeys(["f3"])).toStrictEqual({ f3: undefined })
    expect(await setConditionKeys(["f1"])).toStrictEqual({ f1: undefined })
  })
})
