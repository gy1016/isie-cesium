<template>
  <header class="isie-header">
    <div class="title" @click="backNav">
      <img src="@/assets/logo.png" alt="logo" />
      {{ title }}
    </div>
    <div class="user">
      <img v-if="user?.avatar" :src="user?.avatar" alt="avatar" />
      <img v-else src="@/assets/images/default-avatar.jpg" alt="avatar" />
      <div class="welcome">
        <p>{{ user?.username }}</p>
        <p>{{ user?.role }}</p>
      </div>
      <img src="@/assets/images/logout.svg" alt="logout" @click="logout" />
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { IUserInfo } from '#/user';
  import { removeToken } from '@/utils/auth';
  import { PropType } from 'vue';
  import router from '@/router';
  import { useRoute } from 'vue-router';

  const curRoute = useRoute();

  defineProps({
    title: {
      type: String,
      default: '',
    },
    user: {
      type: Object as PropType<IUserInfo>,
    },
  });

  const backNav = () => {
    const curPath = curRoute.path;
    if (curPath === '/navigation') {
      return;
    } else {
      router.push('/navigation');
    }
  };

  const logout = () => {
    ElMessageBox.confirm('确认退出登陆吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      removeToken();
      ElMessage({
        type: 'success',
        message: '退出成功',
      });
      router.push('/login');
    });
  };
</script>

<style lang="scss" scoped>
  .isie-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    background-image: linear-gradient(90deg, #4860e6 0%, #3388ff 100%);

    img {
      height: 40px;
      cursor: pointer;
      z-index: 1;
    }
    .title {
      padding-left: 10px;
      color: #fff;
      font-weight: 700;
      font-size: 25px;
      display: flex;
      align-items: center;
    }

    .user {
      display: flex;
      align-items: center;
      padding-right: 10px;
      gap: 10px;
      img {
        border-radius: 50%;
      }

      .welcome {
        color: #fff;
      }
    }
  }
</style>
