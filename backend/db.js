const db=require('mongoose')
const url='mongodb+srv://dhruvik73:dhruvik123@cluster0.deszimu.mongodb.net/socialfox?retryWrites=true&w=majority'
const connection=()=>{
     db.connect(url);
     console.log('connection succefull')
}
module.exports=connection