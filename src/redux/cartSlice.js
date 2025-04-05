import { createSlice } from "@reduxjs/toolkit";

const initialState ={
  cartCountFlag:false
}

// --- Slice ---
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartCountFlag:(state , action)=>{
      state.cartCountFlag=action.payload
    }
  },
 
});
export const {setCartCountFlag}=cartSlice.actions
export default cartSlice.reducer;
