<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElButton, ElRow, ElCol } from 'element-plus'
import type { SearchParams, SearchFormData } from '@/types/property'

const emit = defineEmits<{
  search: [params: SearchParams]
  reset: []
}>()

const formData = reactive<SearchFormData>({
  name: '',
  bedrooms: null,
  bathrooms: null,
  storeys: null,
  garages: null,
  price_min: null,
  price_max: null
})

// Form reference for validation
const formRef = ref(null)

const handleSearch = () => {
  // Build search params, excluding empty values
  const params: SearchParams = {}

  if (formData.name.trim()) {
    params.name = formData.name.trim()
  }
  if (formData.bedrooms !== null && formData.bedrooms !== undefined) {
    params.bedrooms = formData.bedrooms
  }
  if (formData.bathrooms !== null && formData.bathrooms !== undefined) {
    params.bathrooms = formData.bathrooms
  }
  if (formData.storeys !== null && formData.storeys !== undefined) {
    params.storeys = formData.storeys
  }
  if (formData.garages !== null && formData.garages !== undefined) {
    params.garages = formData.garages
  }
  if (formData.price_min !== null && formData.price_min !== undefined) {
    params.price_min = formData.price_min
  }
  if (formData.price_max !== null && formData.price_max !== undefined) {
    params.price_max = formData.price_max
  }

  emit('search', params)
}

const handleReset = () => {
  formData.name = ''
  formData.bedrooms = null
  formData.bathrooms = null
  formData.storeys = null
  formData.garages = null
  formData.price_min = null
  formData.price_max = null

  emit('reset')
}
</script>

<template>
  <div class="property-search">
    <el-form ref="formRef" :model="formData" label-position="top" class="search-form">
      <el-row :gutter="20">

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Name">
            <el-input v-model="formData.name" placeholder="Enter property name" clearable />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Bedrooms">
            <el-input-number v-model="formData.bedrooms" :min="0" :max="20" placeholder="Any" controls-position="right"
              style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Bathrooms">
            <el-input-number v-model="formData.bathrooms" :min="0" :max="20" placeholder="Any" controls-position="right"
              style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Storeys">
            <el-input-number v-model="formData.storeys" :min="0" :max="10" placeholder="Any" controls-position="right"
              style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Garages">
            <el-input-number v-model="formData.garages" :min="0" :max="10" placeholder="Any" controls-position="right"
              style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Min Price ($)">
            <el-input-number v-model="formData.price_min" :min="0" :max="100000000" :step="10000" placeholder="No min"
              controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Max Price ($)">
            <el-input-number v-model="formData.price_max" :min="0" :max="100000000" :step="10000" placeholder="No max"
              controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" class="form-actions">
          <el-button type="primary" @click="handleSearch">
            Search
          </el-button>
          <el-button @click="handleReset">
            Reset
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.property-search {
  margin-bottom: 20px;
}

.search-form {
  padding: 20px;
  background-color: var(--color-background-soft, #f8f8f8);
  border-radius: 8px;
  border: 1px solid var(--color-border, #ddd);
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
