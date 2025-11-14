import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../../styles/styles";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addTocart, removeFromCart } from "../../redux/actions/cart";

const Cart = ({ setOpenCart }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.discount_price || item.price || 0;
    return acc + (item.qty || 1) * price;
  }, 0);

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  }

  const handleCheckout = (e) => {
    e.preventDefault();

    // Close cart first
    setOpenCart(false);

    // If still loading, navigate anyway and let ProtectedRoute handle it
    if (loading === true || loading === undefined) {
      navigate("/checkout");
      return;
    }

    // If not authenticated, show error and redirect to login
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout");
      // Store the intended destination in localStorage
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      return;
    }

    // If authenticated, navigate to checkout
    navigate("/checkout");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">

        {
          cart && cart.length === 0 ? (
            <div className="w-full h-screen flex items-center justify-center">
              <div className="flex w-full justify-end pt-5 pr-5 fixed top-0 right-3">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              <div className="w-full flex items-center justify-center">
                <h5 className="text-[#00000082]">Your cart is empty!</h5>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="flex w-full justify-end pt-5 pr-5">
                  <RxCross1
                    size={25}
                    className="cursor-pointer"
                    onClick={() => setOpenCart(false)}
                  />
                </div>
                {/* Item length */}
                <div className={`${styles.noramlFlex} p-4`}>
                  <IoBagHandleOutline size={25} />
                  <h5 className="pl-2 text-[20px] font-[500]">
                    {cart && cart.length} {cart && cart.length === 1 ? "item" : "items"}
                  </h5>
                </div>

                {/* cart Single Items */}
                <b />
                <div className="w-full border-t">
                  {cart && cart.length > 0 ? (
                    cart.map((i, index) => (
                      <CartSingle key={index} data={i} quantityChangeHandler={quantityChangeHandler} removeFromCartHandler={removeFromCartHandler} />
                    ))
                  ) : (
                    <div className="w-full flex items-center justify-center py-8">
                      <h5 className="text-[#00000082]">Your cart is empty!</h5>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 mb-3">
                {/* checkout button */}
                <div
                  onClick={handleCheckout}
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px] cursor-pointer`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    CheckOut Now (USD${totalPrice})
                  </h1>
                </div>
              </div>
            </>
          )
        }

      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty || 1);
  const itemPrice = data.discountPrice || data.discount_price || data.price || 0;
  const totalPrice = itemPrice * value;

  const handleRemove = () => {
    removeFromCartHandler(data);
    toast.success("Item removed from cart!");
  };

  const increment = (data) => {
    const stock = data.stock || 0;
    if (stock < value + 1) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updatedCart = { ...data, qty: value + 1 };
      quantityChangeHandler(updatedCart);
    }
  }



  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updatedCart = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updatedCart);
  }

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{data.qty}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        <img
          src={data.image_Url?.[0]?.url || data.images?.[0]?.url || "https://tse4.mm.bing.net/th/id/OIP.cF269Ylne2B3O6Gj3nG_FwHaI8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"}
          alt={data.name}
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />
        <div className="pl-[5px] flex-1">
          <h1 className="text-[14px]">{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${itemPrice} * {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice.toFixed(2)}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer ml-2"
          onClick={handleRemove}
          size={20}
        />
      </div>
    </div>
  );
};

export default Cart;
