<template>
  <div class="p-10">
    <!-- <x-list :items="[1, 2, 3, 4, 5, 6]">
      <template #li="{ data }"> {{ data }} </template>
    </x-list> -->
    <button @click="list.addItem()">Add</button>
    <!-- <x-input v-model="testInput" /> -->
    {{ list.checkedIds }}
    <x-table dense select checkable :list="list" class="w-full">
      <x-thead class="uppercase text-gray-500 text-sm">
        <x-th>Name</x-th>
        <x-th>Title</x-th>
        <x-th>Status</x-th>
        <x-th>Role</x-th>
        <x-th></x-th>
      </x-thead>
      <x-tr @click="list.remove(id)" class="" v-slot:tr="{ id, data, checked }">
        <x-td class="">
          <x-tcell primary strong>Sofiyat Yusuf</x-tcell>
          <x-tcell>ysofiyat@gmail.com</x-tcell>
        </x-td>
        <x-td>
          <x-tcell primary>Front-end Developer</x-tcell>
          <x-tcell>Optimization</x-tcell>
        </x-td>
        <x-td>
          <span
            class="inlne-flex bg-green-100 text-green-700 font-semibold px-2 rounded-lg"
          >
            Active
          </span>
        </x-td>
        <x-td>
          <x-tcell secondary>Member</x-tcell>
        </x-td>
        <x-td right action>
          <button class="text-purple-800 font-semibold">Edit</button>
        </x-td>
      </x-tr>
      <!-- <template #tr="{ item }">
        <x-td>
          {{ item.id }}
        </x-td>
        <x-td> Hello World </x-td>
      </template> -->
    </x-table>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";

let testInput = ref("Hello World");
let list = reactive({
  addItem() {
    let id = this.ids.length + 1;
    this.items.unshift({ id });
    this.itemsById[id] = { id };
    this.ids.unshift(id);
    console.log(this.ids);
  },
  partialCheck: computed(
    () => list.checkedIds.length > 0 && !list.allChecked.value
  ),
  allChecked: computed(() =>
    list.ids.every((i) => list.checkedIds.includes(i))
  ),
  toggleCheck(id, value) {
    if (id) {
      if (!value) {
        let index = this.checkedIds.indexOf(id);
        // console.log(index);
        if (index > -1) this.checkedIds.splice(index, 1);
      } else this.checkedIds.push(id);
    } else {
      if (!value) this.checkedIds = [];
      else this.checkedIds = [...this.ids];
    }
  },
  isChecked(id) {
    return id
      ? this.checkedIds.includes(id)
      : this.checkedIds.length == this.ids.length;
  },
  checkedIds: [] as any[],
  ids: [1, 2] as any[],
  itemsById: {
    1: { id: 1 },
    2: { id: 2 },
  } as any,
  items: [{ id: 1 }, { id: 2 }],
  remove(id) {
    console.log(id);
    let index = this.ids.indexOf(id);
    if (index) this.ids.splice(index, 1);
  },
});
</script>
