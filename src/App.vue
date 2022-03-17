<template>
  <div class="">
    <!-- <x-navigation>
      
    </x-navigation> -->
    <div>
      <router-link to="tables">Tables</router-link>
    </div>
    <!-- <Table /> -->
    <Input />
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import Table from "./views/Table.vue";
import Input from "./views/Input.vue";
</script>
