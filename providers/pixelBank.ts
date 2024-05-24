import { PixelBank } from "@/types/PixelBank";

export const getBank = async () => {
    const result = await fetch("/api/bank")
    
    return (await result.json()) as PixelBank
}