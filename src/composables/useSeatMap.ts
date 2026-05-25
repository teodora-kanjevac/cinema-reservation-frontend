import { ref } from 'vue'

type AisleCell = { aisle: true }
type SeatCell = {
  aisle: false
  taken: boolean
  premium: boolean
  row: number
  col: number
  seatIndex: number
  label: string
}

export type SeatMapCell = AisleCell | SeatCell

type SelectedSeat = {
  row: number
  col: number
  label: string
  price: number
  premium: boolean
  seatIndex: number
}

const DEFAULT_ROWS = 8
const DEFAULT_COLS = 16

function aislePosition(cols: number) {
  return Math.floor((cols + 1) / 2)
}

export function encodeSeatIndex(row: number, col: number, cols = DEFAULT_COLS): number {
  const ap = aislePosition(cols)
  const realCol = col > ap ? col - 1 : col
  return row * cols + realCol
}

export function decodeSeatIndex(index: number, cols = DEFAULT_COLS): { row: number; col: number } {
  const ap = aislePosition(cols)
  const row = Math.floor(index / cols)
  const realCol = index % cols
  const col = realCol >= ap ? realCol + 1 : realCol
  return { row, col }
}

export function useSeatMap(rows = DEFAULT_ROWS, cols = DEFAULT_COLS) {
  const seatMap = ref<SeatMapCell[][]>([])
  const selectedSeats = ref<SelectedSeat[]>([])

  function generateSeatLabel(row: number, col: number): string {
    const ap = aislePosition(cols)
    const functionalCol = col > ap ? col - 1 : col
    return `${String.fromCharCode(65 + row)}${functionalCol + 1}`
  }

  function buildMap(apiSeats?: Array<{ row: number; col: number; taken: boolean; premium: boolean }>) {
    const ap = aislePosition(cols)

    const takenSeatsMap = new Map<string, boolean>()
    const premiumSeatsMap = new Map<string, boolean>()

    if (apiSeats && apiSeats.length > 0) {
      apiSeats.forEach((s) => {
        const key = `${s.row}-${s.col}`
        takenSeatsMap.set(key, s.taken ?? false)
        premiumSeatsMap.set(key, s.premium ?? false)
      })
    }

    seatMap.value = Array.from({ length: rows }, (_, ri) =>
      Array.from({ length: cols + 1 }, (_, ci): SeatMapCell => {
        if (ci === ap) return { aisle: true }

        const calculatedIndex = encodeSeatIndex(ri, ci, cols)
        const functionalCol = ci > ap ? ci - 1 : ci
        const coordinateKey = `${ri}-${functionalCol}`

        const isTaken = apiSeats && apiSeats.length > 0 ? (takenSeatsMap.get(coordinateKey) ?? false) : false
        const isPremium = apiSeats && apiSeats.length > 0 ? (premiumSeatsMap.get(coordinateKey) ?? ri < 2) : ri < 2

        return {
          aisle: false,
          taken: isTaken,
          premium: isPremium,
          row: ri,
          col: ci,
          seatIndex: calculatedIndex,
          label: generateSeatLabel(ri, ci),
        }
      }),
    )

    selectedSeats.value = []
  }

  function isSelected(row: number, col: number): boolean {
    return selectedSeats.value.some((s) => s.row === row && s.col === col)
  }

  function toggleSeat(seat: SeatMapCell) {
    if (seat.aisle) return
    const s = seat as SeatCell
    if (s.taken) return

    const idx = selectedSeats.value.findIndex((sel) => sel.seatIndex === s.seatIndex)

    if (idx >= 0) {
      selectedSeats.value.splice(idx, 1)
      return
    }

    const price = s.premium ? 1700 : 1350

    selectedSeats.value.push({
      row: s.row,
      col: s.col,
      label: s.label,
      price,
      premium: s.premium,
      seatIndex: s.seatIndex,
    })
  }

  function totalPrice(): number {
    return selectedSeats.value.reduce((sum, s) => sum + s.price, 0)
  }

  return {
    seatMap,
    selectedSeats,
    buildMap,
    isSelected,
    toggleSeat,
    totalPrice,
    encodeSeatIndex,
    decodeSeatIndex,
    generateSeatLabel,
  }
}
