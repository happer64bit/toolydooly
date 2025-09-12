import { type Ref, shallowRef, watch } from 'vue'

export function useDebounce<T>(
  value: Ref<T>,
  delay: number = 300,
  fetchFn?: (val: T) => Promise<void>
): Ref<T> {
  const debouncedValue = shallowRef(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout>

  watch(
    value,
    (newVal) => {
      clearTimeout(timeout)
      timeout = setTimeout(async () => {
        debouncedValue.value = newVal
        if (fetchFn) await fetchFn(newVal)
      }, delay)
    }
  )

  return debouncedValue
}
