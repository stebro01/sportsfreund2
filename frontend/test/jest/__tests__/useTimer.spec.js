import { describe, it, beforeEach, afterEach, expect, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import useTimer from 'src/composables/useTimer'

const TestComponent = {
  template: '<div />',
  setup () {
    return useTimer()
  }
}

describe('useTimer composable', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('increments progress and resets on stop', () => {
    const wrapper = mount(TestComponent)
    wrapper.vm.start()
    jest.advanceTimersByTime(3000)
    expect(wrapper.vm.progress).toBe(3)
    expect(wrapper.vm.isActive).toBe(true)
    wrapper.vm.stop()
    expect(wrapper.vm.progress).toBe(0)
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('stop(false) keeps progress', () => {
    const wrapper = mount(TestComponent)
    wrapper.vm.start()
    jest.advanceTimersByTime(1000)
    wrapper.vm.stop(false)
    expect(wrapper.vm.progress).toBe(1)
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('clears interval on unmount', () => {
    const wrapper = mount(TestComponent)
    wrapper.vm.start()
    jest.advanceTimersByTime(1000)
    wrapper.unmount()
    expect(wrapper.vm.progress).toBe(0)
    expect(wrapper.vm.isActive).toBe(false)
  })
})
