const db=require('mongoose')
const url='mongodb+srv://socialfox73:Dhruvik123@socialfox.7csphaz.mongodb.net/'
const connection = async () => {
     if (!db.connections[0].readyState) {
       await db.connect(url, {
         useNewUrlParser: true,
         useUnifiedTopology: true
       });
       console.log('Connection successful');
     }
   };
   
module.exports=connection