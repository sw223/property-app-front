<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

// Props
defineProps<{
  text?: string
  fullscreen?: boolean
}>()
</script>

<template>
  <div class="loading-spinner" :class="{ 'fullscreen': fullscreen }">
    <div class="spinner-content">
      <el-icon class="spinner-icon" :size="40">
        <Loading />
      </el-icon>
      <span v-if="text" class="spinner-text">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.loading-spinner.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.spinner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner-icon {
  animation: rotate 1.5s linear infinite;
  color: var(--el-color-primary, #409eff);
}

.spinner-text {
  color: var(--el-text-color-secondary, #909399);
  font-size: 14px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .loading-spinner.fullscreen {
    background-color: rgba(24, 24, 24, 0.9);
  }
}
</style>
