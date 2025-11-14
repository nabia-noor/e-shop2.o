import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";

const ProductCard = ({ data }) => {
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (data && wishlist && Array.isArray(wishlist)) {
      const dataId = data._id || data.id;
      const isInWishlist = wishlist.find((i) => {
        const itemId = i._id || i.id;
        return itemId === dataId;
      });
      setClick(!!isInWishlist);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  if (!data) {
    return null;
  }

  const d = data.name;
  const product_name = d.replace(/\s+/g, "-");

  const removeFromWishlistHandler = (e, data) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (e, data) => {
    e.stopPropagation();
    dispatch(addToWishlist(data));
  }

  // Handle both static data and API data structures
  const imageUrl = data.image_Url?.[0]?.url || data.images?.[0]?.url || "";
  const shopName = data.shop?.name || "";
  const discountPrice = data.discount_price || data.discountPrice || 0;
  const originalPrice = data.price || data.originalPrice || 0;
  const soldCount = data.total_sell || data.sold_out || 0;

  const addToCartHandler = () => {
    if (!data) {
      toast.error("Product data is missing!");
      return;
    }

    // Get product ID (handle both _id and id)
    const productId = data._id || data.id;
    if (!productId) {
      toast.error("Product ID is missing!");
      return;
    }

    // Check if item already exists in cart (handle both _id and id)
    const isItemExists = cart && cart.find((i) => {
      const itemId = i._id || i.id;
      return itemId === productId;
    });

    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      const stock = data.stock || 0;
      const count = 1; // Default quantity for ProductCard (no quantity selector)
      if (stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link to={`/product/${product_name}`}>
          <img
            src={imageUrl}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>
        <Link to={`/shop/preview/${data?.shop._id}`} >
          <h5 className={`${styles.shop_name}`}>{shopName}</h5>
        </Link>
        <Link to={`/product/${product_name}`}>
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex">
            <AiFillStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              size={20}
              color="#F6BA00"
            />
            <AiFillStar
              className="mr-2 cursor-pointer"
              color="#F6BA00"
              size={20}
            />
            <AiOutlineStar
              size={20}
              className="mr-2 cursor-pointer"
              color="#F6BA00"
            />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {originalPrice === 0 ? originalPrice : discountPrice}$
              </h5>
              <h4 className={`${styles.price}`}>
                {originalPrice ? originalPrice + " $" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {soldCount} sold
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={(e) => removeFromWishlistHandler(e, data)}
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={(e) => addToWishlistHandler(e, data)}
              color="#333"
              title="Add to wishlist"
            />
          )}

          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={addToCartHandler}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
