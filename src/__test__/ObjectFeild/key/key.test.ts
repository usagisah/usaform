import { mount } from "@vue/test-utils"
import { reactive } from "vue"
import ObjectFieldDynamic from "./ObjectField.dynamic.vue"
import ObjectFieldRender from "./ObjectField.render.vue"

describe("key render", () => {
  it("all children plain-field count", () => {
    const wrapper = mount(ObjectFieldRender)
    const items = wrapper.findAll(".ufi")
    expect(items.length).toBe(6)
  })

  it("count", () => {
    const wrapper = mount(ObjectFieldRender)
    const items = wrapper.findAll(".ObjectFieldComponent")
    expect(items.length).toBe(3)
  })
})

describe("key actions", () => {
  it("getFormData() self keys count", () => {
    const wrapper = mount(ObjectFieldRender)
    const data = wrapper.vm.actions.getFormData()
    expect(Object.keys(data)).toStrictEqual(expect.arrayContaining(["o1", "o2", "o3"]))
  })

  it("getFormData() nest data", () => {
    const f1InitValue = "aaaa"
    const f2InitValue = "vvvv"

    const wrapper = mount(ObjectFieldRender, { props: { f1InitValue } })
    wrapper.findAll(".f2 input").forEach(item => item.setValue(f2InitValue))

    const { getFormData } = wrapper.vm.actions
    expect(getFormData()).toStrictEqual({
      o1: { f1: f1InitValue, f2: f2InitValue },
      o2: { f1: f1InitValue, f2: f2InitValue },
      o3: { f1: f1InitValue, f2: f2InitValue }
    })
  })

  it("get()", async () => {
    const f1InitValue = "aaaa"
    const f2InitValue = "vvvv"

    const wrapper = mount(ObjectFieldRender, { props: { f1InitValue } })
    wrapper.findAll(".f2 input").forEach(item => item.setValue(f2InitValue))

    const { get } = wrapper.vm.actions

    const res1 = get("o1|o2|o3")
    expect(res1.length).toBe(3)
    expect(res1).toStrictEqual(
      expect.arrayContaining([
        ["o1", undefined, "o1"],
        ["o2", undefined, "o2"],
        ["o3", undefined, "o3"]
      ])
    )
    expect(Object.fromEntries(res1 as any)).toStrictEqual({ o1: undefined, o2: undefined, o3: undefined })

    const res2 = get("o1/.*")
    expect(res2.length).toBe(2)
    expect(res2).toStrictEqual([
      ["f1", f1InitValue, "o1/f1"],
      ["f2", f2InitValue, "o1/f2"]
    ])
    expect(Object.fromEntries(res2 as any)).toStrictEqual({ f1: f1InitValue, f2: f2InitValue })

    const res3 = get("o2/.*")
    expect(res3.length).toBe(2)
    expect(res3).toStrictEqual([
      ["f1", f1InitValue, "o2/f1"],
      ["f2", f2InitValue, "o2/f2"]
    ])
    expect(Object.fromEntries(res3 as any)).toStrictEqual({ f1: f1InitValue, f2: f2InitValue })

    const res4 = get("o3/.*")
    expect(res4.length).toBe(2)
    expect(res4).toStrictEqual([
      ["f1", f1InitValue, "o3/f1"],
      ["f2", f2InitValue, "o3/f2"]
    ])
    expect(Object.fromEntries(res4 as any)).toStrictEqual({ f1: f1InitValue, f2: f2InitValue })
  })

  it("set()", () => {
    const f1InitValue = "lll"
    const f2InitValue = "ppp"
    const wrapper = mount(ObjectFieldRender, { props: { f1InitValue, f2InitValue } })
    const { get, set } = wrapper.vm.actions

    expect(Object.fromEntries(get("o1/.*") as any)).toStrictEqual({ f1: f1InitValue, f2: f2InitValue })

    const f1InitValue1 = "lll111"
    const f2InitValue1 = "ppp111"
    set("o1", { f1: f1InitValue1, f2: f2InitValue1 })
    expect(Object.fromEntries(get("o1/.*") as any)).toStrictEqual({ f1: f1InitValue1, f2: f2InitValue1 })
  })
})

describe("dynamic render", () => {
  it("if render and dynamic change formData", async () => {
    const props = reactive({ conditionKeys: [] as string[] })
    const wrapper = mount(ObjectFieldDynamic, { props })
    const { setConditionKeys } = wrapper.vm
    expect(await setConditionKeys(["o2"])).toStrictEqual({ o2: { f2: undefined } })
    expect(await setConditionKeys(["o1", "o3"])).toStrictEqual({ o1: { f1: undefined }, o3: { f3: undefined } })
    expect(await setConditionKeys(["o3"])).toStrictEqual({ o3: { f3: undefined } })
    expect(await setConditionKeys(["o1"])).toStrictEqual({ o1: { f1: undefined } })
  })
})
