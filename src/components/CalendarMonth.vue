<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getAllEntries } from '../utils/db'
import { bloodSugarOptions } from '../utils/consts'

// Blood Sugar Icons
import TooLowIcon from '../assets/icons/blood-sugar/too-low.svg'
import LowIcon from '../assets/icons/blood-sugar/low.svg'
import OnTargetIcon from '../assets/icons/blood-sugar/on-target.svg'
import HighIcon from '../assets/icons/blood-sugar/high.svg'
import TooHighIcon from '../assets/icons/blood-sugar/too-high.svg'

// Ovulation Icons
import FollicularIcon from '../assets/icons/ovulation/follicular.svg'
import OvulationIcon from '../assets/icons/ovulation/ovulation.svg'
import LutealIcon from '../assets/icons/ovulation/luteal.svg'
import MenstrualIcon from '../assets/icons/ovulation/menstrual.svg'

const props = defineProps({
  selectedDate: Date,
  dataVersion: Number
})

const emit = defineEmits(['select-date'])

const currentDate = ref(new Date())
const monthlyEntries = ref({}) // Keyed by date string

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const bloodSugarIconMap = {
  'too-low': TooLowIcon,
  'low': LowIcon,
  'on-target': OnTargetIcon,
  'high': HighIcon,
  'too-high': TooHighIcon
}

const ovulationIconMap = {
  'Follicular': FollicularIcon,
  'Ovulation': OvulationIcon,
  'Luteal': LutealIcon,
  'Menstrual': MenstrualIcon
}

const bloodSugarLevels = {
  'too-high': 10,
  'high': 30,
  'on-target': 50,
  'low': 70,
  'too-low': 90
}

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const fetchMonthlyData = async () => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Fetch all entries to ensure continuity across months
  const allEntries = await getAllEntries()
  const map = {}
  allEntries.forEach(entry => {
    map[entry.date] = entry.data
  })
  monthlyEntries.value = map
}

onMounted(fetchMonthlyData)
watch(() => currentDate.value, fetchMonthlyData)
watch(() => props.dataVersion, fetchMonthlyData)

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  let startDay = firstDayOfMonth.getDay()
  const firstDayIndex = (startDay === 0) ? 6 : startDay - 1
  
  const today = new Date()
  let lastKnownLevel = 50 // Default to on-target if no data exists

  // Calculate start and end levels for all days in the current view
  const days = []
  
  // Function to find the last known level before a specific date
  const findLastKnownLevel = (date) => {
    // We sort the keys to find the one just before the current date
    const sortedDates = Object.keys(monthlyEntries.value).map(d => new Date(d)).sort((a, b) => a - b)
    const prevEntryDates = sortedDates.filter(d => d < date)
    if (prevEntryDates.length > 0) {
      const lastDate = prevEntryDates[prevEntryDates.length - 1]
      
      const msPerDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round((date.getTime() - lastDate.getTime()) / msPerDay);
      
      const data = monthlyEntries.value[lastDate.toDateString()]
      if (data && data.bloodSugar && diffDays <= 1) {
        return bloodSugarLevels[data.bloodSugar]
      }
    }
    return 50
  }

  // Pre-calculate segments
  const allGridDays = []
  
  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    allGridDays.push(new Date(year, month - 1, prevMonthLastDay - i))
  }
  
  // Current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    allGridDays.push(new Date(year, month, i))
  }
  
  // Next month padding
  const totalSlots = allGridDays.length > 35 ? 42 : 35
  const remainingSlots = totalSlots - allGridDays.length
  for (let i = 1; i <= remainingSlots; i++) {
    allGridDays.push(new Date(year, month + 1, i))
  }

  return allGridDays.map((date, index) => {
    const dateStr = date.toDateString()
    const entryData = monthlyEntries.value[dateStr]
    const isCurrentMonth = date.getMonth() === month
    
    const startLevel = findLastKnownLevel(date)
    if (entryData && entryData.bloodSugar) {
      lastKnownLevel = bloodSugarLevels[entryData.bloodSugar]
    }
    const endLevel = lastKnownLevel
    
    console.log(entryData)
    const color = bloodSugarOptions.find(option => option.value === entryData?.bloodSugar)?.color
    console.log(color)
    return {
      date,
      isCurrentMonth,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: props.selectedDate && date.toDateString() === props.selectedDate.toDateString(),
      number: date.getDate(),
      data: entryData,
      startLevel,
      endLevel,
      color
    }
  })
})

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const selectDay = (day) => {
  if (day.isCurrentMonth) {
    emit('select-date', day.date)
  }
}
</script>

<template>
  <div class="calendar-container glass">
    <div class="calendar-header">
      <h2 class="month-title">{{ currentMonthName }}</h2>
      <div class="calendar-nav">
        <button @click="prevMonth" class="btn-icon" aria-label="Previous Month">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button @click="nextMonth" class="btn-icon" aria-label="Next Month">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="(day, idx) in daysOfWeek" :key="idx" class="weekday-header">
        <span class="desktop-only" v-if="idx===0">Mon</span>
        <span class="desktop-only" v-else-if="idx===1">Tue</span>
        <span class="desktop-only" v-else-if="idx===2">Wed</span>
        <span class="desktop-only" v-else-if="idx===3">Thu</span>
        <span class="desktop-only" v-else-if="idx===4">Fri</span>
        <span class="desktop-only" v-else-if="idx===5">Sat</span>
        <span class="desktop-only" v-else-if="idx===6">Sun</span>
        <span class="mobile-only">{{ day }}</span>
      </div>
      
      <div 
        v-for="(day, index) in calendarDays" 
        :key="index" 
        class="calendar-day"
        :class="{ 
          'other-month': !day.isCurrentMonth, 
          'today': day.isToday,
          'selected': day.isSelected 
        }"
        @click="selectDay(day)"
      >
        <span class="day-number">{{ day.number }}</span>
        
        <!-- Blood Sugar Line Chart Segment -->
        <div class="bs-chart-container">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="bs-chart-svg">
            <path 
              :d="`M 0 ${day.startLevel} L 20 ${day.endLevel} L 100 ${day.endLevel}`" 
              class="bs-line"
              :class="{'continuous-line': !day.data || !day.data.bloodSugar}"
              :stroke="`${day.color}`"
            />
          </svg>
        </div>

        <div class="day-icons" v-if="day.data">
          <!-- Ovulation Icon -->
          <img 
            v-if="day.data.ovulation && ovulationIconMap[day.data.ovulation]" 
            :src="ovulationIconMap[day.data.ovulation]" 
            class="calendar-icon ov-icon"
            alt="Ovulation"
          />
          
          <!-- Comment Icon -->
          <svg 
            v-if="day.data.comments" 
            class="calendar-icon comment-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.calendar-day {
  cursor: pointer;
  position: relative;
  min-height: 4.5rem;
  display: flex;
  flex-direction: column;
  padding: 0.4rem;
  overflow: hidden; /* Prevent content from stretching the cell */
  min-width: 0; /* Allow grid to shrink cell */
}

@media (max-width: 640px) {
  .calendar-day {
    min-height: 3.5rem;
    padding: 0.25rem;
  }
}

.calendar-day.selected {
  background-color: #eff6ff;
  outline: 2px solid var(--primary);
  outline-offset: -2px;
  z-index: 1;
}

.day-number {
  font-weight: 500;
  font-size: 0.9rem;
}

.day-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: auto;
  justify-content: flex-end;
  max-width: 100%;
}

.calendar-icon {
  width: 12px; /* Slightly smaller for better fit */
  height: 12px;
  opacity: 0.8;
  flex-shrink: 0;
}

.comment-icon {
  color: var(--text-secondary);
}

.desktop-only {
  display: none;
}

@media (min-width: 640px) {
  .desktop-only {
    display: inline;
  }
  .mobile-only {
    display: none;
  }
  .calendar-icon {
    width: 16px;
    height: 16px;
  }
}

.bs-chart-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.bs-chart-svg {
  width: 100%;
  height: 100%;
}

.bs-line {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.6;
}

.bs-line.continuous-line {
  stroke: var(--border);
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
  opacity: 0.3;
}

.day-number, .day-icons {
  position: relative;
  z-index: 1;
}
</style>
