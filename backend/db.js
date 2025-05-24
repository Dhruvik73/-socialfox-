const db=require('mongoose')
const url='mongodb://socialfox73:Dhruvik123@socialfox.7csphaz.mongodb.net/?retryWrites=true&w=majority&appName=SocialFox'
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