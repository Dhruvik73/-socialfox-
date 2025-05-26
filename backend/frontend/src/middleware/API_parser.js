export const bindAPI=async (API_URL,body)=>{
    const res=await fetch(API_URL,body)
    return await res.json()
}