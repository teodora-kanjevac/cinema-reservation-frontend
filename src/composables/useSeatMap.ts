import { ref } from 'vue'

type Seat =
  | { aisle: true }
  | { aisle: false; taken: boolean; premium: boolean; row: number; col: number }

type SelectedSeat = { row: number; col: number; label: string; price: number; premium: boolean }

type SeatRow = Seat[]

export function useSeatMap(rows = 8, cols = 16) {
  const seatMap = ref<SeatRow[]>([])
  const selectedSeats = ref<SelectedSeat[]>([])

  function buildMap() {
    seatMap.value = Array.from({ length: rows }, (_, ri) =>
      Array.from({ length: cols + 1 }, (_, ci) => {
        if (ci === Math.floor((cols + 1) / 2)) return { aisle: true }
        const taken = Math.random() < 0.28
        const premium = ri < 2
        return {
          aisle: false,
          taken,
          premium,
          row: ri,
          col: ci,
        }
      }),
    )
    selectedSeats.value = []
  }

  function isSelected(row: number, col: number): boolean {
    return selectedSeats.value.some((s) => s.row === row && s.col === col)
  }

  function toggleSeat(seat: Seat) {
    if (seat.aisle || seat.taken) return
    const idx = selectedSeats.value.findIndex((s) => s.row === seat.row && s.col === seat.col)
    if (idx >= 0) {
      selectedSeats.value.splice(idx, 1)
    } else {
      const displayCol = seat.col > Math.floor((cols + 1) / 2) ? seat.col - 1 : seat.col
      const price = seat.premium ? 16 : 12
      selectedSeats.value.push({
        row: seat.row,
        col: seat.col,
        label: `${String.fromCharCode(65 + seat.row)}${displayCol + 1}`,
        price,
        premium: seat.premium,
      })
    }
  }

  function totalPrice() {
    return selectedSeats.value.reduce((sum, s) => sum + s.price, 0)
  }

  buildMap()

  return { seatMap, selectedSeats, buildMap, isSelected, toggleSeat, totalPrice }
}
