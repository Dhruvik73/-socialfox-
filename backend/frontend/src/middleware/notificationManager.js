import io from 'socket.io-client'
const Socket=io.connect("http://localhost:5001")
export const throwNotifications=(notificationData)=>{
   Socket.emit("serverNotification",notificationData)
}