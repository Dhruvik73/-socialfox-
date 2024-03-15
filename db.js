const db=require('mongoose')
const url='mongodb://localhost:27017'
const connection=()=>{
     db.connect(url);
     console.log('connection succefull')
}
module.exports=connection