import { RootState } from "@/app/store"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Product } from "./productAPI";
type InitialStateType = {
  carts: (Product & {qty:number} )[];
}
const initialState:InitialStateType = {
  carts: [],
}
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart:(state,{payload:{cart}}:PayloadAction<{ cart: Product }>)=>{
      const foundIndex = state.carts.findIndex((item)=>item.ID === cart.ID);
      if(foundIndex>=0){
        state.carts[foundIndex].qty = state.carts[foundIndex].qty + 1
      }else{
        state.carts.push({...cart,qty:1})
      }
      // state.carts.push(cart)
    },
    removeFromCart:(state,{payload:{cart}}:PayloadAction<{ cart: Product }>)=>{
        state.carts = state.carts.filter(item=>item.ID !== cart.ID);
    }
    // setEmail: (
    //   state,
    //   { payload: { email } }: PayloadAction<{ email: string }>,
    // ) => {
    //   state.email = email
    // },
  },
})
export default cartSlice.reducer
export const { addToCart , removeFromCart} = cartSlice.actions

export const selectCarts = (state: RootState) => state.products.carts
