import { flushPromises, mount } from "@vue/test-utils"
import { reactive } from "vue"
import { FormObjectPlainField, FormObjectPlainFieldExpose } from "../components/compose"

describe("basic", () => {
  it("view html", () => {
    const wrapper = mount(FormObjectPlainField, { props: { names: ["o1", "o2"] } })
    expect(wrapper.html()).toBe(`<input type="text">\n<input type="text">`)
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["", ""])
  })

  it("exposed methods", () => {
    const wrapper = mount(<FormObjectPlainField names={["o"]} />)
    const { fields } = wrapper.vm as any as FormObjectPlainFieldExpose
    expect(fields[0].e).toStrictEqual({
      getFormData: expect.any(Function),
      subscribe: expect.any(Function),
      get: expect.any(Function),
      set: expect.any(Function),
      call: expect.any(Function)
    })
  })

  it("custom init value", () => {
    const wrapper = mount(<FormObjectPlainField names={["o"]} initValue={{ input: "99" }} />)
    expect(wrapper.find("input").element.value).toBe("99")
  })
})

describe("actions get/set", () => {
  it("get/set field value by field actions", async () => {
    const wrapper = mount(<FormObjectPlainField names={["o1", "o2"]} />)
    const { get, set } = (wrapper.vm as any as FormObjectPlainFieldExpose).fields[0].e
    set("../o2", { input: "99" })
    await flushPromises()
    expect(get("")).toEqual([undefined])
    expect(get("../o2")).toEqual([{ input: "99" }])
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["", "99"])
  })

  it("isolate plain data", async () => {
    const wrapper = mount(<FormObjectPlainField names={["o"]} initValue={reactive({ input: "99" })} />)
    const { get } = (wrapper.vm as any as FormObjectPlainFieldExpose).fields[0].e
    wrapper.find("input").setValue("0")
    await flushPromises()
    expect(get("")).toEqual([{ input: "99" }])
  })
})

describe("actions subscribe", () => {
  it("subfield value", async () => {
    const wrapper = mount(<FormObjectPlainField names={["o"]} />)
    const { subscribe, set } = (wrapper.vm as any as FormObjectPlainFieldExpose).fields[0].e
    const fn = vi.fn()
    const unSub = subscribe("input", fn)
    set("input", "99")
    await flushPromises()
    unSub()
    await flushPromises()
    expect(fn).toHaveBeenCalledOnce()
  })

  it("the same objectField's subfield value", async () => {
    const wrapper = mount(<FormObjectPlainField names={["o1", "o2"]} />)
    const { subscribe, set } = (wrapper.vm as any as FormObjectPlainFieldExpose).fields[0].e
    const fn = vi.fn()
    const unSub = subscribe("../o2/input", fn)
    set("../o2/input", "99")
    await flushPromises()
    unSub()
    await flushPromises()
    expect(fn).toHaveBeenCalledOnce()
  })
})

describe("actions call", () => {
  it("subfield method", () => {
    const fn = vi.fn()
    const wrapper = mount(<FormObjectPlainField names={["o1", "o2"]} plainInitFns={{ fn }} />)
    const { call } = (wrapper.vm as any as FormObjectPlainFieldExpose).fields[0].e
    call("input", "fn")
    call("../o2/input", "fn")
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe("actions getFormData", () => {
  it("getFormData", () => {
    const wrapper = mount(<FormObjectPlainField names={["o1", "o2"]} />)
    const { getFormData } = (wrapper.vm as any as FormObjectPlainFieldExpose).fields[0].e
    expect(getFormData()).toEqual({
      o1: { input: undefined },
      o2: { input: undefined }
    })
  })
})

describe("use from [actions|config] to field", () => {
  it("initFormData", () => {
    const wrapper = mount(<FormObjectPlainField config={{ defaultFormData: { o1: { input: 1 }, o2: { input: 2 } } }} names={["o1", "o2"]} />)
    const { getFormData } = (wrapper.vm as any as FormObjectPlainFieldExpose).form

    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["1", "2"])
    expect(getFormData()).toEqual({ o1: { input: 1 }, o2: { input: 2 } })
  })

  it("set formData", async () => {
    const wrapper = mount(<FormObjectPlainField names={["o1", "o2"]} />)
    const { set, getFormData } = (wrapper.vm as any as FormObjectPlainFieldExpose).form

    set("", { o1: { input: 11 }, o2: { input: 22 } })
    await flushPromises()

    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["11", "22"])
    expect(getFormData()).toEqual({ o1: { input: 11 }, o2: { input: 22 } })
  })
})
