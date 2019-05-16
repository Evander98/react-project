const INITIAL_STATE = {jumlahCart: 0}

export default(state = INITIAL_STATE, action) => {
    if(action.type === 'UBAH_JUMLAH_CART'){
        return{...INITIAL_STATE, jumlahCart : action.payload}
    } else{
        return state
    }
}