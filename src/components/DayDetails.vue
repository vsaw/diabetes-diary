<script setup>
import { ref, watch, onMounted } from 'vue'
import { getEntry, saveEntry } from '../utils/db'

const props = defineProps({
  date: Date
})

const emit = defineEmits(['entry-saved'])

import TooLowIcon from '../assets/icons/blood-sugar/too-low.svg'
import LowIcon from '../assets/icons/blood-sugar/low.svg'
import OnTargetIcon from '../assets/icons/blood-sugar/on-target.svg'
import HighIcon from '../assets/icons/blood-sugar/high.svg'
import TooHighIcon from '../assets/icons/blood-sugar/too-high.svg'

import FollicularIcon from '../assets/icons/ovulation/follicular.svg'
import OvulationIcon from '../assets/icons/ovulation/ovulation.svg'
import LutealIcon from '../assets/icons/ovulation/luteal.svg'
import MenstrualIcon from '../assets/icons/ovulation/menstrual.svg'

const bloodSugarOptions = [
  { label: 'Too low', value: 'too-low', color: '#ef4444', icon: TooLowIcon },
  { label: 'Low', value: 'low', color: '#f97316', icon: LowIcon },
  { label: 'On target', value: 'on-target', color: '#22c55e', icon: OnTargetIcon },
  { label: 'High', value: 'high', color: '#f97316', icon: HighIcon },
  { label: 'Too high', value: 'too-high', color: '#ef4444', icon: TooHighIcon }
]

const ovulationPhases = [
  { label: 'Follicular', icon: FollicularIcon, color: '#9333ea' },
  { label: 'Ovulation', icon: OvulationIcon, color: '#ec4899' },
  { label: 'Luteal', icon: LutealIcon, color: '#3b82f6' },
  { label: 'Menstrual', icon: MenstrualIcon, color: '#ef4444' }
]

const form = ref({
  bloodSugar: '',
  ovulation: '',
  comments: ''
})

const isSaving = ref(false)
const message = ref('')

const formattedDate = computed(() => {
  if (!props.date) return ''
  return props.date.toLocaleDateString('default', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
})

const loadData = async () => {
  if (!props.date) return
  const dateStr = props.date.toDateString()
  const entry = await getEntry(dateStr)
  if (entry) {
    form.value = { ...entry.data }
  } else {
    form.value = {
      bloodSugar: '',
      ovulation: '',
      comments: ''
    }
  }
}

const handleSave = async () => {
  if (!props.date) return
  isSaving.value = true
  message.value = ''
  
  try {
    const dateStr = props.date.toDateString()
    await saveEntry({
      date: dateStr,
      data: { ...form.value }
    })
    message.value = 'Saved successfully!'
    emit('entry-saved')
    setTimeout(() => { message.value = '' }, 2000)
  } catch (e) {
    message.value = 'Error saving data'
  } finally {
    isSaving.value = false
  }
}

watch(() => props.date, loadData)
onMounted(loadData)

import { computed } from 'vue'
</script>

<template>
  <div class="day-details glass" v-if="date">
    <div class="details-header">
      <h3 class="details-title">{{ formattedDate }}</h3>
    </div>

    <form @submit.prevent="handleSave" class="details-form">
      <div class="form-group">
        <label class="form-label">Blood Sugar Rating</label>
        <div class="rating-grid">
          <button 
            v-for="option in bloodSugarOptions" 
            :key="option.value"
            type="button"
            class="rating-btn"
            :class="{ 'active': form.bloodSugar === option.value }"
            @click="form.bloodSugar = option.value"
            :style="{ '--active-color': option.color }"
          >
            <img :src="option.icon" class="rating-icon" :alt="option.label" />
            <span class="rating-label">{{ option.label }}</span>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Ovulation Phase</label>
        <div class="ovulation-grid">
          <button 
            v-for="phase in ovulationPhases" 
            :key="phase.label"
            type="button"
            class="rating-btn phase-btn"
            :class="{ 'active': form.ovulation === phase.label }"
            @click="form.ovulation = phase.label"
            :style="{ '--active-color': phase.color }"
          >
            <img v-if="phase.icon" :src="phase.icon" class="rating-icon" :alt="phase.label" />
            <span class="rating-label">{{ phase.label }}</span>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Comments</label>
        <textarea 
          v-model="form.comments" 
          placeholder="Add any additional notes here..."
          class="form-textarea"
          rows="3"
        ></textarea>
      </div>

      <div class="form-footer">
        <button type="submit" class="btn-save" :disabled="isSaving">
          <span v-if="isSaving">Saving...</span>
          <span v-else>Save Details</span>
        </button>
        <transition name="fade">
          <span v-if="message" class="status-msg">{{ message }}</span>
        </transition>
      </div>
    </form>
  </div>
  <div v-else class="empty-state glass">
    <p>Select a day from the calendar to view or edit details.</p>
  </div>
</template>

<style scoped>
.day-details {
  margin-top: 1.5rem;
}

.details-title {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.rating-grid, .ovulation-grid {
  display: flex;
  gap: 0.25rem; /* Further reduced gap for tighter fit */
  margin-bottom: 0.5rem;
}

.rating-grid {
  flex-wrap: nowrap; /* Force single row for blood sugar */
}

.ovulation-grid {
  flex-wrap: wrap; /* Keep wrapping for ovulation if 4 items are too wide */
}

.rating-grid::-webkit-scrollbar, .ovulation-grid::-webkit-scrollbar {
  display: none;
}

.rating-btn {
  flex: 1 1 0; /* Force equal sizing and shrinking */
  min-width: 0; /* Allow shrinking below content size */
  background: white;
  border: 1px solid var(--border);
  padding: 0.4rem 0.15rem; /* Minimum padding */
  border-radius: 8px;
  font-size: 0.65rem; /* Slightly smaller for density */
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  overflow: hidden; /* Prevent text overflow issues */
}

.rating-btn .rating-icon {
  color: var(--active-color);
  width: 24px;
  height: 24px;
  transition: transform 0.2s, color 0.2s;
}

.rating-btn:hover .rating-icon {
  transform: translateY(-2px);
}

.rating-btn.active {
  background-color: var(--active-color, var(--primary));
  color: white;
  border-color: var(--active-color, var(--primary));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rating-btn.active .rating-icon {
  color: white;
}

.rating-label {
  font-weight: 500;
  font-size: 0.75rem;
}

@media (min-width: 640px) {
  .rating-grid, .ovulation-grid {
    display: grid;
    overflow-x: visible;
    padding-bottom: 0;
  }
  
  .rating-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .ovulation-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .rating-btn {
    flex: none;
    white-space: normal;
  }
}

.rating-btn.active {
  background-color: var(--active-color, var(--primary));
  color: white;
  border-color: var(--active-color, var(--primary));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.phase-btn.active {
  /* color handled via --active-color in :style */
}

.form-select, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  font-family: inherit;
  font-size: 1rem;
  background-color: white;
  color: var(--text-primary);
}

.form-textarea {
  resize: vertical;
}

.btn-save {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-save:hover {
  background-color: var(--primary-hover);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-msg {
  font-size: 0.875rem;
  color: #22c55e;
  font-weight: 500;
}

.empty-state {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  padding: 3rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
