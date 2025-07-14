import { beforeEach, describe, it, expect } from '@jest/globals'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from 'stores/appStore'

describe('appStore pinning', () => {
  let store
  beforeEach(() => {
    localStorage.clear()
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useAppStore()
  })

  it('pinTimer keeps only three entries', () => {
    store.pinTimer(10)
    store.pinTimer(20)
    store.pinTimer(30)
    expect(store.pinnedTimers).toEqual([30, 20, 10])
    store.pinTimer(40)
    expect(store.pinnedTimers).toEqual([40, 30, 20])
  })

  it('unpinTimer removes an entry', () => {
    store.pinTimer(10)
    store.pinTimer(20)
    store.unpinTimer(10)
    expect(store.pinnedTimers).toEqual([20])
  })
})
