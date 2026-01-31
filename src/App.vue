<script setup>
import { ref, onMounted } from 'vue'
import CalendarMonth from './components/CalendarMonth.vue'
import DayDetails from './components/DayDetails.vue'

const isLoaded = ref(false)
const selectedDate = ref(new Date())

const handleDateSelect = (date) => {
  selectedDate.value = date
}

const dataVersion = ref(0)
const handleEntrySaved = () => {
  dataVersion.value++
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 50)
})
</script>

<template>
  <div class="app-layout" :class="{ 'fade-in': isLoaded }">
    <header class="app-header">
      <div class="brand">
        <div class="brand-icon-wrapper">
          <img src="/pwa-512x512.png" class="brand-icon" alt="Diabetes Diary Icon" />
        </div>
        <div class="brand-text">
          <h1 class="title"><span class="gradient-text">Diabetes</span> Diary</h1>
          <p class="subtitle">Precision Health Tracker</p>
        </div>
      </div>

    </header>

    <main>
      <CalendarMonth 
        :selectedDate="selectedDate" 
        :dataVersion="dataVersion"
        @select-date="handleDateSelect" 
      />
      <DayDetails :date="selectedDate" @entry-saved="handleEntrySaved" />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.app-layout.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}



@media (min-width: 640px) {
  .app-header {
    padding: 1rem 0 2rem;
  }
  .brand {
    gap: 1rem;
  }
  .brand-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

}
</style>
