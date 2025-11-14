import React from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Wishlist = ({ setOpenWishlist }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  }

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenWishlist(false)}
            />
          </div>
          {/* Item length */}
          <div className={`${styles.noramlFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">
              {wishlist && wishlist.length} {wishlist && wishlist.length === 1 ? "item" : "items"}
            </h5>

          </div>

          {/* cart Single Items */}
          <b />
          <div className="w-full border-t">
            {wishlist && wishlist.length > 0 ? (
              wishlist.map((i, index) => (
                <CartSingle
                  key={index}
                  data={i}
                  removeFromWishlistHandler={() => dispatch(removeFromWishlist(i))}
                  addToCartHandler={() => {
                    dispatch(addTocart(i));
                    toast.success("Item added to cart!");
                  }}
                />
              ))
            ) : (
              <div className="w-full flex items-center justify-center py-8">
                <h5 className="text-[#00000082]">Your wishlist is empty!</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const imageUrl = data.image_Url?.[0]?.url || data.images?.[0]?.url || "https://tse4.mm.bing.net/th/id/OIP.cF269Ylne2B3O6Gj3nG_FwHaI8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3";
  const price = data.discountPrice || data.discount_price || data.price || 0;

  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <RxCross1
          className="cursor-pointer"
          onClick={removeFromWishlistHandler}
          title="Remove from wishlist"
        />
        <img
          src={imageUrl}
          alt={data.name}
          className="w-[80px] h-[80px] ml-2 rounded-[5px] object-contain"
        />

        <div className="pl-[5px] flex-1">
          <h1 className="text-[14px]">{data.name}</h1>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${price.toFixed(2)}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            onClick={() => addToCartHandler(data)}
            title="Add to cart"
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
