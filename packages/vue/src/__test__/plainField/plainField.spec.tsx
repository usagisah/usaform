import { flushPromises, mount } from "@vue/test-utils"
import { ref } from "vue"
import { FormActions, PlainFieldActions } from "../.."
import { BasicForm, BasicPlainField } from "../components/basic"

describe("basic", () => {
  it("basic html view", () => {
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input1" />
        <BasicPlainField name="input2" />
      </BasicForm>
    )
    expect(wrapper.html()).toBe(`<input type="text">\n<input type="text">`)
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["", ""])
  })

  it("exposed methods", () => {
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" />
      </BasicForm>
    )
    const actions = wrapper.find("input").getCurrentComponent()!.exposed
    expect(actions).toStrictEqual({
      getFormData: expect.any(Function),
      subscribe: expect.any(Function),
      get: expect.any(Function),
      set: expect.any(Function),
      call: expect.any(Function)
    })
  })

  it("custom init value", () => {
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input1" initValue="99" />
      </BasicForm>
    )
    expect(wrapper.find("input").element.value).toBe("99")
  })
})

describe("actions get/set", () => {
  it("get/set field value by html", () => {
    const vm = ref<PlainFieldActions>()
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" ref={vm} />
      </BasicForm>
    )
    expect(vm.value!.get("")).toEqual([undefined])

    wrapper.find("input").setValue("111")
    expect(vm.value!.get("")).toEqual(["111"])
  })

  it("get/set field value by field actions", async () => {
    const vm = ref<PlainFieldActions>()
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" ref={vm} />
      </BasicForm>
    )
    vm.value!.set("", "111")
    await flushPromises()
    expect(vm.value!.get("")).toEqual(["111"])
    expect(wrapper.find("input").element.value).toBe("111")
  })

  it("get other field's value by field actions", async () => {
    const vm = ref<PlainFieldActions>()
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm} />
        <BasicPlainField name="input2" initValue="89" />
        <BasicPlainField name="input3" initValue="99" />
      </BasicForm>
    )
    expect(vm.value!.get("../input[2,3]")).toEqual(["89", "99"])
    expect(wrapper.findAll("input").map(v => v.element.value)).toEqual(["", "89", "99"])
  })

  it("get config {first:true}", () => {
    const vm = ref<PlainFieldActions>()
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm} />
        <BasicPlainField name="input2" initValue="89" />
        <BasicPlainField name="input3" initValue="99" />
      </BasicForm>
    )
    expect(vm.value!.get("../input[2,3]", { first: true })).toEqual(["89"])
  })
})

describe("actions subscribe", () => {
  it("subscribe/unSubscribe self", async () => {
    const vm = ref<PlainFieldActions>()
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" ref={vm} />
      </BasicForm>
    )
    const fn = vi.fn()
    const unSubscribe = vm.value!.subscribe("", fn)

    wrapper.find("input").setValue("1")
    await flushPromises()
    wrapper.find("input").setValue("2")
    await flushPromises()
    wrapper.find("input").setValue("3")
    await flushPromises()
    unSubscribe()
    wrapper.find("input").setValue("4")
    await flushPromises()

    expect(fn).toHaveBeenCalledTimes(3)
    expect(fn).toHaveBeenCalledWith("1", undefined)
    expect(fn).toHaveBeenCalledWith("2", "1")
    expect(fn).toHaveBeenCalledWith("3", "2")
  })

  it("subscribe other field", async () => {
    const vm1 = ref<PlainFieldActions>()
    const vm2 = ref<PlainFieldActions>()
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm1} />
        <BasicPlainField name="input2" ref={vm2} />
      </BasicForm>
    )
    const sub1 = vi.fn()
    const sub2 = vi.fn()
    vm1.value!.subscribe("../input2", sub1)
    vm2.value!.subscribe("../input1", sub2)

    wrapper.findAll("input").map(e => e.setValue(".."))
    await flushPromises()

    expect(sub1).toHaveBeenCalledOnce()
    expect(sub2).toHaveBeenCalledOnce()
  })

  it("config {immediate:true}", async () => {
    const vm1 = ref<PlainFieldActions>()
    const vm2 = ref<PlainFieldActions>()
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm1} />
        <BasicPlainField name="input2" ref={vm2} />
      </BasicForm>
    )
    const sub1 = vi.fn()
    const sub2 = vi.fn()
    vm1.value!.subscribe("../input2", sub1, { immediate: true })
    vm2.value!.subscribe("../input1", sub2, { immediate: true })

    expect(sub1).toHaveBeenCalledOnce()
    expect(sub2).toHaveBeenCalledOnce()
  })
})

describe("actions call", () => {
  it("call self method", () => {
    const vm = ref<PlainFieldActions>()
    const fn1 = vi.fn()
    mount(
      <BasicForm>
        <BasicPlainField name="input" ref={vm} initFns={{ fn1 }} />
      </BasicForm>
    )
    expect(fn1).not.toBeCalled()
  })

  it("call other field method from the same level", () => {
    const vm1 = ref<PlainFieldActions>()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm1} />
        <BasicPlainField name="input2" initFns={{ fn: fn1 }} />
        <BasicPlainField name="input3" initFns={{ fn: fn2 }} />
      </BasicForm>
    )
    vm1.value!.call("../input[2,3]", "fn")
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
  })

  it("call params/return", () => {
    const vm1 = ref<PlainFieldActions>()
    const vm2 = ref<PlainFieldActions>()
    const obj = { m: 1 }
    const fn = vi.fn(function () {
      return obj
    })
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm1} />
        <BasicPlainField name="input2" ref={vm2} initFns={{ fn }} />
      </BasicForm>
    )
    const res = vm1.value!.call("../input2", "fn")
    expect(res).toStrictEqual({ "../root/input2": obj })
    expect(fn).toHaveBeenCalledWith({ name: "input2", path: "../root/input2" })
  })

  it("use call config custom params", () => {
    const vm1 = ref<PlainFieldActions>()
    const vm2 = ref<PlainFieldActions>()
    const obj = { m: 1 }
    const fn = vi.fn(function (this: typeof obj) {
      return this
    })
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm1} />
        <BasicPlainField name="input2" ref={vm2} initFns={{ fn }} />
      </BasicForm>
    )
    const res = vm1.value!.call("../input2", "fn", { point: obj, params: [1, 2] })
    expect(res).toStrictEqual({ "../root/input2": obj })
    expect(fn).toHaveBeenCalledWith({ name: "input2", path: "../root/input2" }, 1, 2)
  })

  it("use config {first:true}", () => {
    const vm1 = ref<PlainFieldActions>()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm1} />
        <BasicPlainField name="input2" initFns={{ fn: fn1 }} />
        <BasicPlainField name="input3" initFns={{ fn: fn2 }} />
      </BasicForm>
    )
    vm1.value!.call("../input[2,3]", "fn", { first: true })
    expect(fn2).not.toHaveBeenCalled()
  })

  it("use config {fieldTypes:xx}", () => {
    const vm1 = ref<PlainFieldActions>()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm1} />
        <BasicPlainField name="input2" initFns={{ fn: fn1 }} />
        <BasicPlainField name="input3" initFns={{ fn: fn2 }} />
      </BasicForm>
    )
    vm1.value!.call("../input[2,3]", "fn", { fieldTypes: ["array", "array-item", "object"] })
    expect(fn1).not.toHaveBeenCalled()
    expect(fn2).not.toHaveBeenCalled()

    vm1.value!.call("../input[2,3]", "fn", { fieldTypes: ["plain"] })
    expect(fn1).toHaveBeenCalled()
    expect(fn2).toHaveBeenCalled()
  })
})

describe("actions getFormData", () => {
  it("get FormData", () => {
    const vm = ref<PlainFieldActions>()
    mount(
      <BasicForm>
        <BasicPlainField name="input1" ref={vm} initValue="1" />
        <BasicPlainField name="input2" initValue="1" />
      </BasicForm>
    )
    expect(vm.value!.getFormData()).toEqual({ input1: "1", input2: "1" })
  })
})

describe("use from.actions to field", () => {
  it("getFormData", () => {
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input1" initValue="1" />
        <BasicPlainField name="input2" />
        <BasicPlainField name="input3" initValue="99" />
      </BasicForm>
    )
    const actions = wrapper.vm as any as FormActions
    expect(actions.getFormData()).toEqual({
      input1: "1",
      input2: undefined,
      input3: "99"
    })
  })

  it("get", () => {
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" />
      </BasicForm>
    )
    const actions = wrapper.vm as any as FormActions
    expect(actions.get("input")).toEqual([undefined])
  })

  it("set", async () => {
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" />
      </BasicForm>
    )
    const actions = wrapper.vm as any as FormActions

    wrapper.find("input").setValue("11")
    expect(actions.get("input")).toEqual(["11"])

    actions.set!("input", "22")
    await flushPromises()
    expect(actions.get("input")).toEqual(["22"])
  })

  it("subscribe", async () => {
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" />
      </BasicForm>
    )
    const actions = wrapper.vm as any as FormActions
    const sub = vi.fn()
    const unSub = actions.subscribe("input", sub)

    wrapper.find("input").setValue("11")
    actions.set!("input", "22")
    await flushPromises()
    unSub()
    wrapper.find("input").setValue("11")
    actions.set!("input", "22")
    await flushPromises()
    expect(sub).toHaveBeenCalledTimes(2)
  })

  it("call", () => {
    const fn = vi.fn()
    const wrapper = mount(
      <BasicForm>
        <BasicPlainField name="input" initFns={{ fn }} />
      </BasicForm>
    )
    const actions = wrapper.vm as any as FormActions
    actions.call("input", "fn")
    expect(fn).toHaveBeenCalledOnce()
  })
})
