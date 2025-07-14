import { beforeEach, afterEach, describe, it, expect, jest } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
jest.mock('src/tools/sound.js', () => ({ __esModule: true, default: jest.fn() }))
import ProgramTimer from 'pages/Timer/ProgrammTimer.vue'
import { useAppStore } from 'stores/appStore'

installQuasarPlugin()

describe('ProgramTimer', () => {
  let wrapper
  let store

  beforeEach(() => {
    jest.useFakeTimers()
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useAppStore()
    store.addProgramStep({ type: 'action', duration: 1, repetitions: 1 })
    wrapper = shallowMount(ProgramTimer, {
      global: {
        plugins: [pinia],
        mocks: { $router: { go: jest.fn() } },
        stubs: {
          'q-page': true,
          'q-btn': true,
          'q-chip': true,
          'q-list': true,
          'q-item': true,
          'q-item-section': true,
          'q-btn-dropdown': true,
          'q-popup-proxy': true,
          'q-card': true,
          'q-card-section': true,
          'duration-slider': true,
          'q-slider': true,
          'q-select': true,
          'q-input': true,
          'q-tooltip': true,
          'q-separator': true,
          'q-icon': true,
          'q-knob': true
        }
      }
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('runs program and resets progress when finished', () => {
    wrapper.vm.TIME_DATA = wrapper.vm._prepareTimer()
    wrapper.vm.nextTimer()
    jest.advanceTimersByTime(1000)
    expect(wrapper.vm.timer_finished).toBe(true)
    expect(wrapper.vm.progress).toBe(0)
  })

  it('stopTimer halts timer and resets progress', () => {
    wrapper.vm.startTimer()
    jest.advanceTimersByTime(1500)
    jest.advanceTimersByTime(500)
    wrapper.vm.stopTimer()
    expect(wrapper.vm.timer_halted).toBe(true)
    expect(wrapper.vm.progress).toBe(0)
  })

  it('generates program steps from settings', () => {
    wrapper.vm.localData.action.value = 2
    wrapper.vm.localData.break.value = 1
    wrapper.vm.localData.exercises.value = 2
    wrapper.vm.localData.rounds.value = 1
    wrapper.vm.localData.round_break.value = 0
    wrapper.vm.generateStepsFromSettings()
    expect(store.programSteps).toEqual([
      { type: 'action', duration: 2, repetitions: 1 },
      { type: 'break', duration: 1, repetitions: 1 },
      { type: 'action', duration: 2, repetitions: 1 }
    ])
  })

  it('uses last preset duration when no program steps exist on mount', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
    const localStore = useAppStore()
    const altWrapper = shallowMount(ProgramTimer, {
      global: {
        plugins: [pinia],
        mocks: { $router: { go: jest.fn() } },
        stubs: {
          'q-page': true,
          'q-btn': true,
          'q-chip': true,
          'q-list': true,
          'q-item': true,
          'q-item-section': true,
          'q-btn-dropdown': true,
          'q-popup-proxy': true,
          'q-card': true,
          'q-card-section': true,
          'duration-slider': true,
          'q-slider': true,
          'q-select': true,
          'q-input': true,
          'q-tooltip': true,
          'q-separator': true,
          'q-icon': true,
          'q-knob': true
        }
      }
    })
    const expected = altWrapper.vm.calcDuration(localStore.lastPreset)
    expect(altWrapper.vm.DURATION_CALC).toBe(expected)
  })
})
