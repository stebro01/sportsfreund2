import { ref, computed, onUnmounted } from 'vue'

export default function useTimer () {
  const interval = ref(null)
  const progress = ref(0)
  const isActive = computed(() => interval.value !== null)

  function start (callback, delay = 1000) {
    stop()
    interval.value = setInterval(() => {
      progress.value += 1
      if (typeof callback === 'function') {
        callback(progress.value)
      }
    }, delay)
  }

  function stop (reset = true) {
    if (interval.value) {
      clearInterval(interval.value)
      interval.value = null
    }
    if (reset) {
      progress.value = 0
    }
  }

  onUnmounted(stop)

  return {
    start,
    stop,
    progress,
    isActive
  }
}
