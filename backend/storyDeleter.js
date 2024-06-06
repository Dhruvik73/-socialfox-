const mongoose=require('mongoose');
const fs=require('fs');
const path = require('path');

const deleteVideoOfDeletedStories=()=>{
  const connection=mongoose.connection;
  const changeStream=(connection.collection('stories')).watch([], { 
    fullDocumentBeforeChange: "required" 
  });
  changeStream.on('change',async (operation)=>{
    if(operation.operationType=="delete"){
        const {story}=operation.fullDocumentBeforeChange||{};
        const storyPath=path.join(__dirname,'frontend','src','storyVideos',story[0]);
        if (storyPath && fs.existsSync(storyPath)) {
            fs.unlink(storyPath, err => {
                if (err) console.error(`Error deleting file: ${err}`);
                else console.log(`File deleted: ${storyPath}`);
            });
        }
    }
  })
}
module.exports=deleteVideoOfDeletedStories;