<template>
  <Header :title="title" :user="user" />
  <Main />
</template>

<script lang="ts" setup>
  import Header from './components/Header.vue';
  import Main from './components/Main.vue';
  import { useUserInfoStore } from '@/store/user';

  const userInfoStore = useUserInfoStore();

  let title = '';
  let user = userInfoStore.userInfo;
</script>

<style lang="scss" src="./index.scss"></style>
