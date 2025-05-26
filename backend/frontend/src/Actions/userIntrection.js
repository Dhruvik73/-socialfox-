function sendRes(res,type){
    return{
        type:type,
        res:res
    }
}

export function followMe(id){
    return async dispatch=>{
        const mybody = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "logedUserId": localStorage.getItem('id')?localStorage.getItem('id'):0, 'toBeFollowed': id })
          }
          await fetch('http://65.0.19.137:5001/user/follow', mybody).then((res)=>(res.json())).then((res)=>{
            dispatch(sendRes(res,'followMe'))
          })
    }
}


export function setLastviewedPost(posts,comments,postId,totalPosts,isCloseBtnClicked,logedUserDetails){
    return async dispatch=>
    {
        dispatch(sendRes({posts,comments,postId,totalPosts,isCloseBtnClicked,logedUserDetails},'setLastviewedPost'))
          }
    }

export function detectChangeOfPosts(){
    const res={
        postChanged:1
    }
    return async dispatch=>{
        dispatch(sendRes(res,'detectChangeStream'))
    }

}
