<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import PropertySearch from './components/PropertySearch.vue'
import PropertyTable from './components/PropertyTable.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { searchProperties, ApiError } from './services/api'
import type { Property, SearchParams, PaginationState } from './types/property'

const properties = ref<Property[]>([])
const loading = ref(false)
const hasSearched = ref(false)
const currentSearchParams = ref<SearchParams>({})
const errorMessage = ref<string | null>(null)
const validationErrors = ref<Record<string, string[]> | null>(null)

const pagination = reactive<PaginationState>({
  currentPage: 1,
  totalPages: 1,
  total: 0,
  perPage: 5
})

// Computed property to check if there are any errors
const hasErrors = computed(() => errorMessage.value !== null || validationErrors.value !== null)

// Get all error messages as a flat array
const allErrorMessages = computed(() => {
  const messages: string[] = []

  if (validationErrors.value) {
    Object.values(validationErrors.value).forEach(errors => {
      errors.forEach(error => messages.push(error))
    })
  }

  return messages
})

const handleSearch = async (params: SearchParams) => {
  currentSearchParams.value = params
  hasSearched.value = true
  clearErrors()
  await fetchProperties(params)
}

const handleReset = () => {
  properties.value = []
  hasSearched.value = false
  currentSearchParams.value = {}
  pagination.currentPage = 1
  pagination.totalPages = 1
  pagination.total = 0
  clearErrors()
}

const handlePageChange = async (page: number) => {
  pagination.currentPage = page
  clearErrors()
  await fetchProperties({ ...currentSearchParams.value, page })
}

const clearErrors = () => {
  errorMessage.value = null
  validationErrors.value = null
}

const fetchProperties = async (params: SearchParams) => {
  loading.value = true
  clearErrors()

  try {
    const response = await searchProperties(params)

    properties.value = response.data
    pagination.currentPage = response.current_page
    pagination.totalPages = response.last_page
    pagination.total = response.total
    pagination.perPage = response.per_page
  } catch (error) {
    console.error('Failed to fetch properties:', error)

    if (error instanceof ApiError) {
      errorMessage.value = error.message
      validationErrors.value = error.errors || null
    } else if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }

    properties.value = []
    pagination.currentPage = 1
    pagination.totalPages = 1
    pagination.total = 0
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Property Search</h1>
      <p class="subtitle">Find your perfect property</p>
    </header>

    <main class="app-main">
      <section class="search-section">
        <PropertySearch @search="handleSearch" @reset="handleReset" />
      </section>

      <section class="results-section">
        <LoadingSpinner v-if="loading" text="Searching properties..." fullscreen />

        <!-- Error Display -->
        <div v-else-if="hasErrors" class="error-container">
          <div class="error-alert">
            <div class="error-header">
              <span class="error-icon">⚠️</span>
              <span class="error-title">{{ errorMessage || 'Validation Error' }}</span>
            </div>
            <ul v-if="allErrorMessages.length > 0" class="error-list">
              <li v-for="(msg, index) in allErrorMessages" :key="index">
                {{ msg }}
              </li>
            </ul>
            <el-button type="primary" size="small" @click="clearErrors" style="margin-top: 10px;">
              Dismiss
            </el-button>
          </div>
        </div>

        <PropertyTable v-else-if="hasSearched" :properties="properties" :pagination="pagination" :loading="false"
          @page-change="handlePageChange" />

        <div v-else class="initial-state">
          <p>Use the search form above to find properties</p>
        </div>
      </section>
    </main>

    <footer class="app-footer">
      <p>Property Search Application &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 30px;
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
}

.app-header .subtitle {
  margin: 10px 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.search-section {
  margin-bottom: 30px;
}

.results-section {
  min-height: 300px;
}

.initial-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: var(--color-background-soft, #f8f8f8);
  border-radius: 8px;
  border: 1px dashed var(--color-border, #ddd);
}

.initial-state p {
  color: var(--el-text-color-secondary, #909399);
  font-size: 1.1rem;
}

/* Error styles */
.error-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.error-alert {
  background-color: #fef0f0;
  border: 1px solid #fde2e2;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.error-icon {
  font-size: 1.5rem;
}

.error-title {
  font-weight: 600;
  color: #f56c6c;
  font-size: 1.1rem;
}

.error-list {
  margin: 0;
  padding-left: 20px;
  color: #f56c6c;
}

.error-list li {
  margin-bottom: 5px;
}

.app-footer {
  text-align: center;
  padding: 20px;
  background-color: var(--color-background-soft, #f8f8f8);
  border-top: 1px solid var(--color-border, #ddd);
}

.app-footer p {
  margin: 0;
  color: var(--el-text-color-secondary, #909399);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.8rem;
  }

  .app-header .subtitle {
    font-size: 1rem;
  }

  .app-main {
    padding: 0 15px 30px;
  }
}
</style>
