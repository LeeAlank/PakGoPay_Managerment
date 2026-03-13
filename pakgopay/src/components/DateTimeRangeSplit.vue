<template>
  <div class="split-range">
    <el-date-picker
      v-model="startValue"
      :type="pickerType"
      :clearable="clearable"
      :placeholder="startPlaceholder || t('common.startDate')"
      :format="format"
      :value-format="valueFormat"
      :style="{ width: pickerWidth }"
      @change="onStartChange"
    />
    <span class="split-separator">to</span>
    <el-date-picker
      v-model="endValue"
      :type="pickerType"
      :clearable="clearable"
      :placeholder="endPlaceholder || t('common.endDate')"
      :format="format"
      :value-format="valueFormat"
      :style="{ width: pickerWidth }"
      @change="onEndChange"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { getTimeZoneOffsetMinutes } from '@/util/timezoneOptions.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  pickerType: {
    type: String,
    default: 'datetime'
  },
  valueFormat: {
    type: String,
    default: 'x'
  },
  format: {
    type: String,
    default: 'YYYY/MM/DD HH:mm:ss'
  },
  clearable: {
    type: Boolean,
    default: false
  },
  pickerWidth: {
    type: String,
    default: '200px'
  },
  startPlaceholder: {
    type: String,
    default: ''
  },
  endPlaceholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])
const { t } = useI18n()

const startValue = ref(null)
const endValue = ref(null)
const activeTimeZone = ref(localStorage.getItem('timeZone') || '')
const pendingTimezoneShift = ref(null)

watch(
  () => props.modelValue,
  (val) => {
    if (Array.isArray(val)) {
      startValue.value = val[0] ?? null
      endValue.value = val[1] ?? null
    } else {
      startValue.value = null
      endValue.value = null
    }
  },
  { immediate: true, deep: true }
)

const toNumber = (v) => {
  if (v === null || v === undefined || v === '') return null
  const num = Number(v)
  return Number.isNaN(num) ? null : num
}

const emitRange = () => {
  if (!startValue.value && !endValue.value) {
    emit('update:modelValue', [])
    emit('change', [])
    return
  }
  if (!startValue.value || !endValue.value) {
    emit('update:modelValue', [startValue.value, endValue.value])
    return
  }
  const start = toNumber(startValue.value)
  const end = toNumber(endValue.value)
  if (start !== null && end !== null && start > end) {
    ElMessage.warning(t('common.timeRangeInvalid'))
    return false
  }
  const range = [startValue.value, endValue.value]
  emit('update:modelValue', range)
  emit('change', range)
  return true
}

const toMsNumber = (v) => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const applyTimezoneShift = (prevTimeZone, nextTimeZone) => {
  const prevZone = String(prevTimeZone || '')
  const nextZone = String(nextTimeZone || '')
  if (!prevZone || !nextZone || prevZone === nextZone) {
    activeTimeZone.value = nextZone || prevZone || activeTimeZone.value
    return
  }

  const adjustOne = (rawMs) => {
    const ms = toMsNumber(rawMs)
    if (ms === null) return rawMs
    const prevOffset = getTimeZoneOffsetMinutes(prevZone, ms)
    const nextOffset = getTimeZoneOffsetMinutes(nextZone, ms)
    if (prevOffset === null || nextOffset === null) return rawMs
    return ms + (nextOffset - prevOffset) * 60000
  }

  const startMs = toMsNumber(startValue.value)
  const endMs = toMsNumber(endValue.value)
  if (startMs === null || endMs === null) {
    activeTimeZone.value = nextZone
    return
  }

  const nextStart = adjustOne(startValue.value)
  const nextEnd = adjustOne(endValue.value)
  startValue.value = nextStart
  endValue.value = nextEnd

  const nextRange = [nextStart, nextEnd]
  emit('update:modelValue', nextRange)
  emit('change', nextRange)
  activeTimeZone.value = nextZone
}

const adjustForTimezoneChange = (nextTimeZone) => {
  const prevTimeZone = activeTimeZone.value || ''
  const nextZone = String(nextTimeZone || '')
  if (!nextZone || prevTimeZone === nextZone) {
    activeTimeZone.value = nextZone || prevTimeZone
    return
  }
  applyTimezoneShift(prevTimeZone, nextZone)
}

const onStartChange = () => {
  if (emitRange() === false) {
    startValue.value = null
    emit('update:modelValue', [startValue.value, endValue.value])
  }
}

const onEndChange = () => {
  if (emitRange() === false) {
    endValue.value = null
    emit('update:modelValue', [startValue.value, endValue.value])
  }
}

const onTimezoneChange = (event) => {
  adjustForTimezoneChange(event?.detail || localStorage.getItem('timeZone') || '')
}

onMounted(() => {
  const nextZone = localStorage.getItem('timeZone') || ''
  const last = window.__lastTimezoneChange
  if (last && typeof last === 'object') {
    const prev = String(last.prev || '')
    const next = String(last.next || '')
    const at = Number(last.at || 0)
    if (prev && next && prev !== next && nextZone === next && Date.now() - at <= 3000) {
      pendingTimezoneShift.value = { prev, next }
      applyTimezoneShift(prev, next)
    } else {
      activeTimeZone.value = nextZone || activeTimeZone.value
    }
  } else {
    activeTimeZone.value = nextZone || activeTimeZone.value
  }
  window.addEventListener('timezone-change', onTimezoneChange)
})

watch(
  () => [startValue.value, endValue.value],
  () => {
    if (!pendingTimezoneShift.value) return
    const { prev, next } = pendingTimezoneShift.value
    const startMs = toMsNumber(startValue.value)
    const endMs = toMsNumber(endValue.value)
    if (startMs === null || endMs === null) return
    applyTimezoneShift(prev, next)
    pendingTimezoneShift.value = null
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('timezone-change', onTimezoneChange)
})
</script>

<style scoped>
.split-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.split-separator {
  color: #606266;
  font-size: 12px;
}
</style>
