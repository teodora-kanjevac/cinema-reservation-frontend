<template>
  <div class="w-full max-w-7xl mx-auto px-8 py-12 pt-32 min-h-screen">
    <div class="flex items-center justify-between mb-10">
      <div>
        <h1 class="font-display text-[32px] tracking-widest text-primary">MANAGEMENT DASHBOARD</h1>
        <p class="text-xs text-muted mt-1 tracking-wider uppercase">Cinema & Screening Administration</p>
      </div>
      <div class="flex gap-2">
        <span class="px-3 py-1.5 rounded-lg bg-card border border-dark text-xs text-muted font-mono">
          {{ cinemas.length }} cinemas
        </span>
        <span class="px-3 py-1.5 rounded-lg bg-card border border-dark text-xs text-muted font-mono">
          {{ timetables.length }} screenings
        </span>
      </div>
    </div>

    <section class="mb-14">
      <div class="flex items-center gap-3 mb-6">
        <span class="w-1 h-6 rounded-full bg-gold shrink-0" />
        <h2 class="font-display text-[22px] tracking-widest text-gold">CINEMAS</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        <div class="bg-card border border-dark rounded-2xl p-6 top-28">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-sm font-bold text-primary uppercase tracking-wider">
              {{ editingCinema ? 'Edit Cinema' : 'Add New Cinema' }}
            </h3>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="submitCinemaForm">
            <div>
              <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Cinema Name</label>
              <input
                v-model="cinemaForm.name"
                type="text"
                placeholder="Enter Cinema Name"
                required
                class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors placeholder:text-dim"
              />
            </div>
            <div>
              <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Address</label>
              <input
                v-model="cinemaForm.address"
                type="text"
                placeholder="Enter Cinema Address"
                required
                class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors placeholder:text-dim"
              />
            </div>

            <div v-if="editingCinema" class="flex gap-2 pt-1">
              <button
                type="submit"
                :disabled="cinemaSubmitting"
                class="flex-1 py-2.5 bg-gold hover:bg-gold/90 text-dark font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {{ cinemaSubmitting ? 'Saving…' : 'Save Changes' }}
              </button>
              <button
                type="button"
                class="px-4 py-2.5 border border-dark text-muted hover:text-primary hover:border-bright rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                @click="cancelCinemaEdit"
              >
                Cancel
              </button>
            </div>
            <button
              v-else
              type="submit"
              :disabled="cinemaSubmitting"
              class="w-full py-2.5 bg-gold shadow-gold-sm hover:bg-[#f0c85a] text-dark font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {{ cinemaSubmitting ? 'Adding…' : 'Add Cinema' }}
            </button>
          </form>
        </div>

        <div class="bg-card border border-dark rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-dark flex items-center justify-between">
            <h3 class="text-sm font-bold text-primary uppercase tracking-wider">All Cinemas</h3>
            <span class="text-xs text-muted font-mono">{{ cinemas.length }} total</span>
          </div>

          <div v-if="cinemasLoading" class="flex items-center justify-center py-16 gap-3 text-muted">
            <Spinner class="size-5" />
            <span class="text-sm">Loading cinemas…</span>
          </div>

          <div v-else-if="!cinemas.length" class="text-center py-14 text-muted italic text-sm">
            No cinemas added yet.
          </div>

          <div v-else class="divide-y divide-dark">
            <div
              v-for="cinema in cinemas"
              :key="cinema.cinemaId"
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-3 transition-colors"
              :class="
                editingCinema?.cinemaId === cinema.cinemaId
                  ? 'bg-gold/5 border-l-2 border-l-gold'
                  : 'hover:bg-elevated/50'
              "
            >
              <div class="flex-1 min-w-0">
                <p class="text-[14px] font-semibold text-primary truncate">{{ cinema.name }}</p>
                <p class="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                  {{ cinema.address }}
                </p>
                <p class="text-[11px] text-dim mt-1 font-mono">
                  ID #{{ cinema.cinemaId }} ·
                  {{ timetables.filter((t) => t.cinemaId === cinema.cinemaId).length }} screenings
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                  :class="
                    editingCinema?.cinemaId === cinema.cinemaId
                      ? 'border-gold text-gold bg-gold/10'
                      : 'border-dark text-muted hover:border-bright hover:text-primary'
                  "
                  @click="startEditCinema(cinema)"
                >
                  {{ editingCinema?.cinemaId === cinema.cinemaId ? '✎ Editing…' : '✎ Edit' }}
                </button>
                <button
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-danger/30 text-danger hover:bg-danger hover:text-primary transition-all cursor-pointer"
                  :disabled="removingCinemaId === cinema.cinemaId"
                  @click="confirmRemoveCinema(cinema)"
                >
                  {{ removingCinemaId === cinema.cinemaId ? '…' : 'Remove' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="flex items-center gap-3 mb-6">
        <span class="w-1 h-6 rounded-full bg-bright shrink-0" />
        <h2 class="font-display text-[22px] tracking-widest text-primary">SCREENINGS</h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        <div class="bg-card border border-dark rounded-2xl p-6 top-28">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-sm font-bold text-primary uppercase tracking-wider">
              {{ editingTimetable ? 'Edit Screening' : 'Schedule Screening' }}
            </h3>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="submitTimetableForm">
            <div>
              <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Movie</label>
              <select
                v-model="timetableForm.movieId"
                required
                class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors"
              >
                <option value="" disabled>Select a movie…</option>
                <option v-for="m in movies" :key="m.id" :value="m.id">{{ m.title }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Cinema</label>
              <select
                v-model="timetableForm.cinemaId"
                required
                class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors"
              >
                <option value="" disabled>Select a cinema…</option>
                <option v-for="c in cinemas" :key="c.cinemaId" :value="c.cinemaId">
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Date</label>
                <input
                  v-model="timetableForm.screeningDate"
                  type="date"
                  required
                  :min="todayISO"
                  class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors"
                />
              </div>
              <div>
                <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Start Time</label>
                <input
                  v-model="timetableForm.startTime"
                  type="time"
                  required
                  class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Format</label>
                <select
                  v-model="timetableForm.screenType"
                  class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors"
                >
                  <option value="2D">Standard 2D</option>
                  <option value="3D">Digital 3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="Dolby">Dolby Atmos</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">Capacity</label>
                <input
                  v-model.number="timetableForm.totalCapacity"
                  type="number"
                  disabled
                  class="w-full bg-elevated border border-dark rounded-xl px-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs text-muted font-semibold mb-1.5 uppercase tracking-wider">
                Base Ticket Price (RSD)
              </label>
              <div class="relative">
                <span
                  class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm font-bold pointer-events-none"
                  >RSD</span
                >
                <input
                  v-model.number="timetableForm.price"
                  type="number"
                  step="1"
                  min="0"
                  required
                  class="w-full bg-elevated border border-dark rounded-xl pl-12 pr-3.5 py-2.5 text-sm text-primary focus:border-bright outline-none transition-colors"
                />
              </div>
            </div>

            <div v-if="editingTimetable" class="flex gap-2 pt-1">
              <button
                type="submit"
                :disabled="timetableSubmitting"
                class="flex-1 py-2.5 bg-bright/20 text-primary border border-bright hover:bg-bright/30 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {{ timetableSubmitting ? 'Saving…' : 'Save Changes' }}
              </button>
              <button
                type="button"
                class="px-4 py-2.5 border border-dark text-muted hover:text-primary hover:border-bright rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
                @click="cancelTimetableEdit"
              >
                Cancel
              </button>
            </div>
            <button
              v-else
              type="submit"
              :disabled="timetableSubmitting"
              class="w-full py-2.5 bg-bright/20 text-primary border border-bright hover:bg-bright/30 font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
            >
              {{ timetableSubmitting ? 'Scheduling…' : 'Add to Schedule' }}
            </button>
          </form>
        </div>

        <div class="bg-card border border-dark rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-dark flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <h3 class="text-sm font-bold text-primary uppercase tracking-wider shrink-0">Active Screening Schedule</h3>
            <div class="flex gap-2 items-center flex-wrap">
              <select
                v-model="timetableFilter.cinemaId"
                class="bg-elevated border border-dark rounded-lg px-3 py-1.5 text-xs text-muted focus:border-bright outline-none transition-colors"
              >
                <option value="">All Cinemas</option>
                <option v-for="c in cinemas" :key="c.cinemaId" :value="c.cinemaId">{{ c.name }}</option>
              </select>
              <select
                v-model="timetableFilter.screenType"
                class="bg-elevated border border-dark rounded-lg px-3 py-1.5 text-xs text-muted focus:border-bright outline-none transition-colors"
              >
                <option value="">All Formats</option>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="Dolby">Dolby</option>
                <option value="4DX">4DX</option>
              </select>
              <span class="text-xs text-muted font-mono ml-1">{{ filteredTimetables.length }} shown</span>
            </div>
          </div>

          <div v-if="timetablesLoading" class="flex items-center justify-center py-16 gap-3 text-muted">
            <Spinner class="size-5" />
            <span class="text-sm">Loading screenings…</span>
          </div>

          <div v-else-if="!filteredTimetables.length" class="text-center py-14 text-muted italic text-sm">
            {{ timetables.length ? 'No screenings match the current filters.' : 'No screenings scheduled yet.' }}
          </div>

          <div v-else class="divide-y divide-dark">
            <div
              v-for="t in filteredTimetables"
              :key="t.timeTableId"
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-3 transition-colors"
              :class="
                editingTimetable?.timeTableId === t.timeTableId
                  ? 'bg-bright/5 border-l-2 border-l-bright'
                  : 'hover:bg-elevated/50'
              "
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center flex-wrap gap-2 mb-1">
                  <p class="text-[14px] font-semibold text-primary truncate">
                    {{ t.movieTitle }}
                  </p>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                    :class="screenTypeBadge(t.screenType)"
                  >
                    {{ t.screenType }}
                  </span>
                </div>
                <p class="text-xs text-muted flex items-center gap-1.5 flex-wrap">
                  <span>{{ cinemaName(t.cinemaId) }}</span>
                  <span class="text-dim font-mono">·</span>
                  <span class="font-mono">{{ dayjs(t.screeningDate).format('DD.MM.YYYY.') }}</span>
                  <span class="text-dim">at</span>
                  <span class="font-mono text-gold">{{ t.startTime?.substring(0, 5) }}</span>
                </p>
                <p class="text-[11px] text-dim mt-1 font-mono">
                  ID #{{ t.timeTableId }} · Cap. {{ t.totalCapacity }} ·
                  <span class="text-gold">{{ t.price }} RSD</span>
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <button
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                  :class="
                    editingTimetable?.timeTableId === t.timeTableId
                      ? 'border-bright text-primary bg-bright/10'
                      : 'border-dark text-muted hover:border-bright hover:text-primary'
                  "
                  @click="startEditTimetable(t)"
                >
                  {{ editingTimetable?.timeTableId === t.timeTableId ? '✎ Editing…' : '✎ Edit' }}
                </button>
                <button
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-danger/30 text-danger hover:bg-danger hover:text-primary transition-all cursor-pointer"
                  :disabled="removingTimetableId === t.timeTableId"
                  @click="confirmRemoveTimetable(t)"
                >
                  {{ removingTimetableId === t.timeTableId ? '…' : 'Remove' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="confirmDialog.visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(4, 6, 12, 0.82); backdrop-filter: blur(6px)"
        @click.self="confirmDialog.visible = false"
      >
        <div class="bg-card border border-dark rounded-2xl p-7 max-w-sm w-full shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
          <h3 class="font-display text-xl tracking-widest text-primary mb-2">{{ confirmDialog.title }}</h3>
          <p class="text-sm text-muted leading-relaxed mb-6">{{ confirmDialog.message }}</p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-danger text-primary hover:bg-danger/80 transition-colors cursor-pointer"
              :disabled="confirmDialog.loading"
              @click="confirmDialog.onConfirm"
            >
              {{ confirmDialog.loading ? 'Removing…' : 'Yes, Remove' }}
            </button>
            <button
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-dark text-muted hover:text-primary hover:border-bright transition-all cursor-pointer"
              @click="confirmDialog.visible = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { cinemaService } from '@/services/cinemaService'
import { movieService } from '@/services/movieService'
import { timeTableService } from '@/services/timeTableService'
import Spinner from '@/components/ui/Spinner.vue'
import { useNotification } from '@/composables/usePopup'
import dayjs from 'dayjs'

const movies = ref<any[]>([])
const cinemas = ref<any[]>([])
const timetables = ref<any[]>([])

const cinemasLoading = ref(false)
const timetablesLoading = ref(false)

const cinemaForm = ref({ name: '', address: '' })
const timetableForm = ref({
  movieId: '' as number | '',
  cinemaId: '' as number | '',
  screeningDate: '',
  startTime: '',
  screenType: '2D',
  totalCapacity: 128,
  price: 1350,
})

const editingCinema = ref<any | null>(null)
const cinemaSubmitting = ref(false)
const removingCinemaId = ref<number | null>(null)

const editingTimetable = ref<any | null>(null)
const timetableSubmitting = ref(false)
const removingTimetableId = ref<number | null>(null)

const { showNotification } = useNotification()

const todayISO = new Date().toISOString().split('T')[0]

const timetableFilter = reactive({ cinemaId: '', screenType: '' })

const confirmDialog = reactive({
  visible: false,
  loading: false,
  title: '',
  message: '',
  onConfirm: () => {},
})

const filteredTimetables = computed(() => {
  return timetables.value.filter((t) => {
    const matchCinema = !timetableFilter.cinemaId || t.cinemaId === timetableFilter.cinemaId
    const matchType = !timetableFilter.screenType || t.screenType === timetableFilter.screenType
    return matchCinema && matchType
  })
})

function startEditCinema(cinema: any) {
  if (editingCinema.value?.cinemaId === cinema.cinemaId) {
    cancelCinemaEdit()
    return
  }
  editingCinema.value = cinema
  cinemaForm.value = { name: cinema.name, address: cinema.address }
  document.querySelector('#cinema-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function cancelCinemaEdit() {
  editingCinema.value = null
  cinemaForm.value = { name: '', address: '' }
}

async function submitCinemaForm() {
  try {
    cinemaSubmitting.value = true
    if (editingCinema.value) {
      await cinemaService.update(editingCinema.value.cinemaId, cinemaForm.value)
      showNotification('success', 'Cinema updated successfully', 'Cinema has been successfully updated.')
      cancelCinemaEdit()
    } else {
      await cinemaService.create(cinemaForm.value)
      showNotification('success', 'Cinema added successfully', 'Cinema has been successfully added.')
      cinemaForm.value = { name: '', address: '' }
    }
    await loadCinemas()
  } catch (err) {
    console.error(err)
    showNotification(
      'error',
      'An error has ocurred',
      'An error has ocurred while updating cinema. Please try again later.',
    )
  } finally {
    cinemaSubmitting.value = false
  }
}

function confirmRemoveCinema(cinema: any) {
  const screening_count = timetables.value.filter((t) => t.cinemaId === cinema.cinemaId).length
  confirmDialog.title = 'Remove Cinema'
  confirmDialog.message =
    screening_count > 0
      ? `"${cinema.name}" has ${screening_count} active screening(s). Removing it will also delete those screenings. This cannot be undone.`
      : `Are you sure you want to remove "${cinema.name}"? This cannot be undone.`
  confirmDialog.visible = true
  confirmDialog.loading = false
  confirmDialog.onConfirm = async () => {
    try {
      confirmDialog.loading = true
      removingCinemaId.value = cinema.cinemaId
      await cinemaService.remove(cinema.cinemaId)
      showNotification('success', 'Cinema removed successfully', 'Cinema has been successfully removed.')
      confirmDialog.visible = false
      if (editingCinema.value?.cinemaId === cinema.cinemaId) cancelCinemaEdit()
      await Promise.all([loadCinemas(), loadTimetables()])
    } catch {
      showNotification(
        'error',
        'An error has ocurred',
        'An error has ocurred while removing cinema. Please try again later.',
      )
    } finally {
      confirmDialog.loading = false
      removingCinemaId.value = null
    }
  }
}

function startEditTimetable(tt: any) {
  if (editingTimetable.value?.timeTableId === tt.timeTableId) {
    cancelTimetableEdit()
    return
  }
  editingTimetable.value = tt
  timetableForm.value = {
    movieId: tt.movieId,
    cinemaId: tt.cinemaId,
    screeningDate: tt.screeningDate,
    startTime: tt.startTime?.substring(0, 5),
    screenType: tt.screenType,
    totalCapacity: tt.totalCapacity,
    price: parseFloat(tt.price),
  }
  document.querySelector('#timetable-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function cancelTimetableEdit() {
  editingTimetable.value = null
  timetableForm.value = {
    movieId: '',
    cinemaId: '',
    screeningDate: '',
    startTime: '',
    screenType: '2D',
    totalCapacity: 128,
    price: 1300,
  }
}

async function submitTimetableForm() {
  try {
    timetableSubmitting.value = true
    const payload = {
      movieId: timetableForm.value.movieId,
      cinemaId: timetableForm.value.cinemaId,
      screeningDate: timetableForm.value.screeningDate,
      startTime: timetableForm.value.startTime,
      screenType: timetableForm.value.screenType,
      totalCapacity: timetableForm.value.totalCapacity,
      price: timetableForm.value.price,
    }

    if (editingTimetable.value) {
      await timeTableService.update(editingTimetable.value.timeTableId, payload)
      showNotification('success', 'Screening updated successfully', 'Screening has been successfully updated.')
      cancelTimetableEdit()
    } else {
      await timeTableService.create(payload)
      showNotification(
        'success',
        'Screening added to schedule successfully',
        'Screening has been successfully added to the schedule.',
      )
      timetableForm.value = {
        movieId: '',
        cinemaId: '',
        screeningDate: '',
        startTime: '',
        screenType: '2D',
        totalCapacity: 128,
        price: 1300,
      }
    }
    await loadTimetables()
  } catch (err) {
    console.error(err)
    showNotification(
      'error',
      'An error has ocurred',
      'An error has ocurred while updating screening. Please try again later.',
    )
  } finally {
    timetableSubmitting.value = false
  }
}

function confirmRemoveTimetable(tt: any) {
  confirmDialog.title = 'Remove Screening'
  confirmDialog.message = `Remove the ${tt.screenType} screening of "${tt.title}" at ${cinemaName(tt.cinemaId)} on ${tt.screeningDate} @ ${tt.startTime?.substring(0, 5)}? This cannot be undone.`
  confirmDialog.visible = true
  confirmDialog.loading = false
  confirmDialog.onConfirm = async () => {
    try {
      confirmDialog.loading = true
      removingTimetableId.value = tt.timeTableId
      await timeTableService.remove(tt.timeTableId)
      showNotification('success', 'Screening removed successfully', 'Screening has been successfully removed.')
      confirmDialog.visible = false
      if (editingTimetable.value?.timeTableId === tt.timeTableId) cancelTimetableEdit()
      await loadTimetables()
    } catch {
      showNotification(
        'error',
        'An error has ocurred',
        'An error has ocurred while removing screening. Please try again later.',
      )
    } finally {
      confirmDialog.loading = false
      removingTimetableId.value = null
    }
  }
}

function cinemaName(cinemaId: number): string {
  return cinemas.value.find((c) => c.cinemaId === cinemaId)?.name ?? `Cinema #${cinemaId}`
}

function screenTypeBadge(type: string): string {
  const map: Record<string, string> = {
    IMAX: 'bg-gold/15 text-gold border border-gold/30',
    Dolby: 'bg-info/12 text-info border border-info/25',
    '3D': 'bg-danger/12 text-danger border border-danger/25',
    '4DX': 'bg-success/12 text-success border border-success/25',
    '2D': 'bg-elevated text-muted border border-dark',
  }
  return map[type] ?? 'bg-elevated text-muted border border-dark'
}

async function loadMovies() {
  try {
    const data = await movieService.getAllMovies()
    movies.value = data
  } catch {
    console.error('Failed to load movies.')
  }
}

async function loadCinemas() {
  try {
    cinemasLoading.value = true
    const data = await cinemaService.getAll()
    cinemas.value = data
  } catch {
    console.error('Failed to load cinemas.')
  } finally {
    cinemasLoading.value = false
  }
}

async function loadTimetables() {
  try {
    timetablesLoading.value = true
    const data = await timeTableService.getAll()
    timetables.value = data
  } catch {
    console.error('Failed to load screenings.')
  } finally {
    timetablesLoading.value = false
  }
}

onMounted(() => {
  Promise.all([loadMovies(), loadCinemas(), loadTimetables()])
})
</script>
