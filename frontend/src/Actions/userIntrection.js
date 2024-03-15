export function followMe(id){
    return async dispatch=>{
        const mybody = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "logedUserId": localStorage.getItem('id'), 'toBeFollowed': id })
          }
          await fetch('http://localhost:5001/user/follow', mybody).then((res)=>(res.json())).then((res)=>{
            dispatch(sendRes(res,'followMe'))
          })
    }
}

export function sendRes(res,type){
    return{
        type:type,
        res:res
    }
}