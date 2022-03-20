<template>
  <div>
    {{ form }}
    <div class="m-10 grid grid-cols-4 gap-6">
      <x-input class="" label="Simple Input" name="simple_input">
        <template #itemText="{ data }">
          {{ data.name }}
        </template>
      </x-input>
      <x-autocomplete
        class=""
        label="Simple Auto Complete"
        name="simple_auto_complete"
        :items="_data.simpleList"
      >
        <template #itemText="{ value, data }">
          {{ data.value }}
        </template>
      </x-autocomplete>
      <x-autocomplete
        class=""
        label="Auto(Item Text,Vaue)"
        name="select"
        item-text="name"
        item-value="value"
        :items="_data.compoundList"
      >
        <template #itemText="{ data }">
          {{ data.value }}
        </template>
      </x-autocomplete>
      <x-autocomplete
        class=""
        label="Multi Selection"
        name="users"
        item-text="name"
        :selection="2"
        item-value="value"
        :items="_data.compoundList"
      >
      </x-autocomplete>
    </div>
    <div class="m-10 grid grid-cols-4 gap-6">
      <x-search-input type="name" url="xyz" label="Name" dtf name="name">
        <template #itemText="{ data }">
          <div>{{ data.name }}</div>
          <div>{{ data.email }}</div>
        </template>
      </x-search-input>
      <x-autocomplete
        type="email"
        label="Email"
        dtf
        :items="_data.addressList"
        name="email"
      >
        <template #itemText="{ data }">
          <div>{{ data.name }}</div>
          <div>{{ data.email }}</div>
        </template></x-autocomplete
      >
      <x-input
        name="phone"
        type="phone"
        :prefix="form.prefix"
        add-on
        label="Phone"
      />
      <x-input name="country" type="country" label="Country" />
      <x-input name="state" type="state" label="State" />
      <x-input name="city" type="city" label="City" />
      <x-input name="payment" label="Payment" add-on suffix="$" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { provide, reactive } from "vue";

let form = reactive<any>({
  simple_input: "Hello World",
  select: 3,
  name: "",
  users: [1, 2],
  email: "",
  password: "",
  search_input: "",
  country: "",
  prefix: "",
  state: "",
  city: "",
  address: "",
});
let addressSelected = ({ data }, ctx) => {
  //   console.log(data);
  Object.entries(data)?.map(([k, v]) => (form[k] = v));
};
let _data = reactive({
  compoundList: [
    { name: "Ishaq", value: 1 },
    { name: "Yusuf", value: 2 },
    { name: "Sofiyat", value: 3 },
    { name: "Salamah", value: 4 },
    { name: "Nuriyah", value: 5 },
    { name: "Maryam", value: 6 },
    { name: "Balqees", value: 7 },
    { name: "Rahmat", value: 8 },
  ] as any[],
  simpleList: ["Ishaq", "Yusuf", "Sofiyat", "Robiat"],
  addressList: [] as any[],
});
provide("x-form", form);
setTimeout(() => {
  form.simple_input = "Hello";
  form.users = [1, 2, 3];
  //   _data.compoundList = ;
  _data.addressList = [address(), address(), address(), address()];
}, 2000);
let id = 1;
let address = () => {
  ++id;
  return {
    name: "User " + id,
    address: `No ${id} Adewole Estate`,
    email: `ishaqyusuf0${id}@gmail.com`,
    country: "Nigeria",
    prefix: "+234",
    state: "Kwara State",
    city: "Ilorin",
  };
};
let onItemSelect = (value, ctx) => {
  form.name = form.simple_input = value.name;
  form.id = value.id;
  ctx._model.text = value.name;
};
</script>
