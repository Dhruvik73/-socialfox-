export const throwNotifications=async(notificationData,Socket)=>{
   await Socket.emit("serverNotification",notificationData)
   const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({notification:notificationData,fromUser:notificationData?.fromUser,toUser:notificationData?.toUser})
    }
    // await fetch('http://13.234.20.67:5001/notification/addNotifications',body).then(res=>res.json()).then((res)=>{
    //   if(res.error){
    //     return res.error
    //   }
    // })
}