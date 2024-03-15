const initialState={payload:''}
export default function userIntrection(state=initialState,action){
    switch (action.type) {
        case 'followMe':return{...state,payload:action.res};
        default:return state;
    }
}