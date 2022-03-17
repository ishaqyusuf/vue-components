import { ref, customRef, watch } from "vue";

const debounce = (fn, delay = 0, immediate = false) => {
  let timeout;
  return (...args) => {
    if (immediate && !timeout) fn(...args);
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const useDebouncedRef = (initialValue, delay = 300, immediate = false) => {
  const state = ref(initialValue);
  const debouncedRef = customRef((track, trigger) => ({
    get() {
      track();
      return state.value;
    },
    set: debounce(
      (value) => {
        state.value = value;
        trigger();
      },
      delay,
      immediate
    ),
  }));
  return debouncedRef;
};
export let useDebouncedWithWatch = (
  initialValue,
  watcher,
  delay = 300,
  immediate = false
) => {
  let _ = useDebouncedRef(initialValue, delay, immediate);
  watch(_, (value) => watcher(value));
  return _;
};
export default useDebouncedRef;
