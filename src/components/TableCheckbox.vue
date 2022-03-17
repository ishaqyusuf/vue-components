<template>
  <input
    type="checkbox"
    :indeterminate="!itemId && api.list.partialCheck"
    class="p-1 cursor-pointer"
    v-model="mv"
  />
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useTableContext } from "./ts/table";
let props = defineProps({
  itemId: String,
});
let api = useTableContext("check-box");
let mv = computed({
  get() {
    return api.list.isChecked(props.itemId);
  },
  set(value) {
    // console.log(value);
    api.list.toggleCheck(props.itemId, value);
  },
});
</script>
