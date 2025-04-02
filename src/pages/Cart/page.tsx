import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { Button } from "@/components/ui/button"
import Rating from "@/components/ui/rating"
import { removeFromCart, selectCarts } from "@/features/products/cartSlice"
import { Product } from "@/features/products/productAPI"
import { ROUTES } from "@/Router"
import { Trash } from "lucide-react"
import { Link } from "react-router-dom"

const Cart = () => {
  const carts = useAppSelector(selectCarts)
  const dispatch = useAppDispatch()
  console.log({ carts })
  const handleRemoveCart = (item: Product) => {
    dispatch(removeFromCart({ cart: item }))
  }
  return (
    <div className="container space-y-2 mt-8">
      <div className="flex">
        <h1>Your Cart</h1>
        <Link className="ml-auto" to={ROUTES.PRODUCTS}>
          Continue Shopping
        </Link>
      </div>
      {carts.map((item) => {
        return (
          <div
            key={item.ID}
            className="flex bg-gray-200 p-4 rounded-md dark:bg-gray-900 justify-between"
          >
            <div className=" flex flex-col">
              <div className="font-bold">{item.Name}</div>
              <p className="text-xs text-gray-400">{item.Description}</p>
              <p>Rs. {item.Price}</p>
              {item.Rating && (
                <Rating
                  rating={Number(item.Rating)}
                  reviews={Number(item.Reviews)}
                />
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="destructive"
                onClick={() => handleRemoveCart(item)}
              >
                <Trash className="w-4 h-4 me-1 hover:opacity-80" /> Remove
              </Button>
              <Button asChild className="ml-auto">
                <Link to={item.Prod_link} target="_blank">
                  Buy Now
                </Link>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Cart
