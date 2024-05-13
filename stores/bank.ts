import { create } from "zustand"

interface BankStore {
    currentPixels: number,
    setCurrentPixels: (x: number) => void
}

export const useBankStore = create<BankStore>((set, get) => ({
    currentPixels: 0,
    setCurrentPixels: (currentPixels: number) => set(() => ({ currentPixels }))
}))