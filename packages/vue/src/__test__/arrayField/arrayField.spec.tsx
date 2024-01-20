import { flushPromises, mount } from "@vue/test-utils"
import { FormArrayPlanField, FormArrayPlanFieldExpose } from "../components/compose"

describe("basic", () => {
  it("view html", () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["0", "1"])
  })

  it("exposed methods", () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { ary } = wrapper.vm as any as FormArrayPlanFieldExpose
    expect(ary).toStrictEqual({
      getFormData: expect.any(Function),
      subscribe: expect.any(Function),
      get: expect.any(Function),
      set: expect.any(Function),
      call: expect.any(Function),
      setValue: expect.any(Function),
      delValue: expect.any(Function),
      swap: expect.any(Function)
    })
  })

  it("custom init value", () => {
    const wrapper = mount(
      <FormArrayPlanField
        name="array"
        count={2}
        initValue={[
          { id: 0, value: "98" },
          { id: 0, value: "99" }
        ]}
      />
    )
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["98", "99"])
  })
})

describe("actions get/set", () => {
  it("get/set field value by field actions", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { get } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    expect(get("")).toEqual([
      [
        { id: 0, value: "0" },
        { id: 1, value: "1" }
      ]
    ])
  })

  it("isolate plain data", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { get } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    wrapper.find("input").setValue("0")
    await flushPromises()
    expect(get("")).toEqual([
      [
        { id: 0, value: "0" },
        { id: 1, value: "1" }
      ]
    ])
  })
})

describe("actions getFormData", () => {
  it("getFormData", () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    expect(getFormData()).toEqual({ array: ["0", "1"] })
  })
})

describe("actions swap", () => {
  it("swap first and last", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={3} />)
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["0", "1", "2"])

    const { swap } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    swap(0, 2)
    await flushPromises()
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["2", "1", "0"])
  })
})

describe("actions setValue", () => {
  it("add first", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { setValue, getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    setValue(-1, { id: 99, value: "99" })
    await flushPromises()
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["99", "0", "1"])
    expect(getFormData()).toEqual({ array: ["99", "0", "1"] })
  })

  it("add last", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { setValue, getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    setValue(99, { id: 99, value: "99" })
    await flushPromises()
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["0", "1", "99"])
    expect(getFormData()).toEqual({ array: ["0", "1", "99"] })
  })

  it("set media", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={3} />)
    const { setValue, getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    setValue(1, { id: 99, value: "99" })
    await flushPromises()
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["0", "99", "2"])
    expect(getFormData()).toEqual({ array: ["0", "99", "2"] })
  })
})

describe("actions delValue", () => {
  it("delValue first", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={3} />)
    const { delValue, getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    delValue(-1)
    await flushPromises()
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["1", "2"])
    expect(getFormData()).toEqual({ array: ["1", "2"] })
  })

  it("delValue last", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={3} />)
    const { delValue, getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    delValue(99)
    await flushPromises()
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["0", "1"])
    expect(getFormData()).toEqual({ array: ["0", "1"] })
  })

  it("delValue media", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={3} />)
    const { delValue, getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).ary
    delValue(1)
    await flushPromises()
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["0", "2"])
    expect(getFormData()).toEqual({ array: ["0", "2"] })
  })
})

describe("use from [actions|config] to field", () => {
  it("initFormData", () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).form
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["0", "1"])
    expect(getFormData()).toEqual({ array: ["0", "1"] })
  })

  it("set formData", async () => {
    const wrapper = mount(<FormArrayPlanField name="array" count={2} />)
    const { set, getFormData } = (wrapper.vm as any as FormArrayPlanFieldExpose).form

    set("", {
      array: [
        { id: 0, value: "1" },
        { id: 1, value: "9" }
      ]
    })
    await flushPromises()

    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["1", "9"])
    expect(getFormData()).toEqual({ array: ["1", "9"] })
  })
})
