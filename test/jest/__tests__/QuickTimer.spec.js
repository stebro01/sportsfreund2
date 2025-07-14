import { beforeEach, afterEach, describe, it, expect, jest } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
jest.mock('src/tools/sound.js', () => ({ __esModule: true, default: jest.fn() }))
import QuickTimer from 'pages/Timer/QuickTimer.vue'
import { useAppStore } from 'stores/appStore'

installQuasarPlugin()

describe('QuickTimer', () => {
  let wrapper
  let store

  beforeEach(() => {
    jest.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
    store = useAppStore()
    wrapper = shallowMount(QuickTimer, {
      global: {
        plugins: [pinia],
        mocks: { $router: { go: jest.fn() } },
        stubs: {
          'q-page': true,
          'q-btn': true,
          'q-knob': true,
          'q-popup-edit': true,
          'q-input': true
        }
      }
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('counts down and resets when finished', async () => {
    wrapper.vm.time = 1
    wrapper.vm.startTimer()
    expect(wrapper.vm.isActive).toBe(true)
    jest.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.timer_finished).toBe(true)
    expect(wrapper.vm.progress).toBe(0)
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('stopTimer resets state', () => {
    wrapper.vm.time = 5
    wrapper.vm.startTimer()
    jest.advanceTimersByTime(1000)
    wrapper.vm.stopTimer()
    expect(wrapper.vm.isActive).toBe(false)
    expect(wrapper.vm.timer_finished).toBe(false)
    expect(wrapper.vm.progress).toBe(0)
  })

  it('updates step size when timer exceeds 60 seconds', () => {
    wrapper.vm.time = 55
    expect(wrapper.vm.bigStep).toBe(5)
    wrapper.vm.time = 65
    expect(wrapper.vm.bigStep).toBe(10)
  })

  it('togglePin pins and unpins the current timer', () => {
    wrapper.vm.time = 5
    wrapper.vm.togglePin()
    expect(store.pinnedTimers).toContain(5)
    wrapper.vm.togglePin()
    expect(store.pinnedTimers).not.toContain(5)
  })

  it('filteredRecentTimers excludes pinned values', () => {
    store.addRecentTimer(5)
    store.addRecentTimer(10)
    store.pinTimer(10)
    expect(wrapper.vm.filteredRecentTimers).toEqual([5])
  })
})
