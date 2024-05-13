import { PixelBank } from "@/types/PixelBank";

export const getPixelBank = async () => {
  const result = await fetch("/api/bank");
  return (await result.json()) as PixelBank
}

export const pixelBankHeartbeat = async () => {
    const result = await fetch("/api/bank", {
        method: "POST"
    })
    
    return (await result.json()) as PixelBank
}