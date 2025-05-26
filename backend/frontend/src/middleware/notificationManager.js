export const throwNotifications=async(notificationData,Socket,relationID)=>{
   await Socket.emit("serverNotification",notificationData)
   const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({notification:notificationData,fromUser:notificationData?.fromUser,toUser:notificationData?.toUser,relationID:relationID})
    }
<<<<<<< Updated upstream
    // await fetch('http://65.0.19.137:5001/notification/addNotifications',body).then(res=>res.json()).then((res)=>{
    //   if(res.error){
    //     return res.error
    //   }
    // })
=======
    await fetch('http://localhost:5001/notification/addNotifications',body).then(res=>res.json()).then((res)=>{
      if(res.error){
        return res.error
      }
    })
}

export const updateNotificationStatus=async(notificationData)=>{
   const body={
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({fromUser:notificationData?.fromUser,toUser:notificationData?.toUser,All:notificationData?.All})
    }
    await fetch('http://localhost:5001/notification/updateNotifications',body).then(res=>res.json()).then((res)=>{
      if(res.error){
        return res.error
      }
    })
>>>>>>> Stashed changes
}