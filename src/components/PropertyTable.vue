<script setup lang="ts">
import { computed } from 'vue'
import { ElTable, ElTableColumn, ElEmpty, ElPagination } from 'element-plus'
import type { Property, PaginationState } from '@/types/property'
import { formatPrice } from '@/services/api'


const props = defineProps<{
  properties: Property[]
  pagination: PaginationState
  loading: boolean
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const hasResults = computed(() => props.properties.length > 0)

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const formatPriceDisplay = (price: number): string => {
  return formatPrice(price)
}
</script>

<template>
  <div class="property-table">
    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <el-table v-if="hasResults" :data="properties" stripe style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
      <el-table-column prop="name" label="Name" min-width="180" />

      <el-table-column label="Price" min-width="120" align="right">
        <template #default="{ row }">
          {{ formatPriceDisplay(row.price) }}
        </template>
      </el-table-column>

      <el-table-column prop="bedrooms" label="Bedrooms" width="100" align="center" />
      <el-table-column prop="bathrooms" label="Bathrooms" width="100" align="center" />
      <el-table-column prop="storeys" label="Storeys" width="90" align="center" />
      <el-table-column prop="garages" label="Garages" width="90" align="center" />
    </el-table>

    <el-empty v-if="!hasResults && !loading" description="No properties found matching your criteria"
      :image-size="120" />

    <div v-if="hasResults && pagination.totalPages > 1" class="pagination-container">
      <el-pagination :current-page="pagination.currentPage" :page-size="pagination.perPage" :total="pagination.total"
        layout="prev, pager, next, total" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<style scoped>
.property-table {
  position: relative;
  min-height: 200px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 10px 0;
}
</style>
