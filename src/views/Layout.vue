<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <el-icon :size="24"><Box /></el-icon>
        <span>大米加工管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/storage">
          <el-icon><Upload /></el-icon>
          <span>稻谷入仓</span>
        </el-menu-item>
        <el-menu-item index="/primary">
          <el-icon><Operation /></el-icon>
          <span>初加工</span>
        </el-menu-item>
        <el-menu-item index="/refined">
          <el-icon><Star /></el-icon>
          <span>精加工</span>
        </el-menu-item>
        <el-menu-item index="/bran">
          <el-icon><Setting /></el-icon>
          <span>糠加工</span>
        </el-menu-item>
        <el-divider style="margin: 8px 0; border-color: #434a50" />
        <el-menu-item index="/report">
          <el-icon><DataAnalysis /></el-icon>
          <span>投入产出报表</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-title">{{ currentPageTitle }}</div>
        <div class="header-user">
          <el-avatar :size="32" icon="UserFilled" />
          <span>管理员</span>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Box,
  Upload,
  Operation,
  Star,
  Setting,
  DataAnalysis
} from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)

const currentPageTitle = computed(() => {
  return (route.meta.title as string) || '大米加工管理系统'
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  gap: 8px;
  border-bottom: 1px solid #434a50;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>