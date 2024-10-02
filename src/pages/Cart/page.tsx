import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { removeFromCart, selectCarts } from '@/features/products/cartSlice'
import { Product } from '@/features/products/productAPI';
import React from 'react'

const Cart = () => {
  const carts =useAppSelector(selectCarts);
  const dispatch = useAppDispatch()
  console.log({carts})
  const handleRemoveCart = (item:Product)=>{
    dispatch(removeFromCart({cart:item}))
  }
  return (
    <div className='container space-y-2 mt-8'>
      {carts.map((item)=>{
        return <div key={item.ID} className='bg-gray-200 p-2 rounded-md'>
          <div>{item.Name}</div>
          <p>{item.Description}</p>
        <button onClick={()=>handleRemoveCart(item)}>Remove</button>
          </div>
      })}
    </div>
  )
}

export default Cart