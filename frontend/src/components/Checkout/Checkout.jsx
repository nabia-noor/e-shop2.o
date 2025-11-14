import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { removeFromCart } from "../../redux/actions/cart";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";

const Checkout = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // ProtectedRoute already handles authentication, so we don't need to check here
  }, []);

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + (item.qty || 1) * (item.discountPrice || item.price || 0),
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const discountAmount = couponCodeData && discountPrice ? discountPrice : 0;

  const totalPrice = (subTotalPrice + shipping - discountAmount).toFixed(2);

  const paymentSubmit = () => {
    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === null ||
      country === "" ||
      city === ""
    ) {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!couponCode || couponCode.trim() === "") {
      toast.error("Please enter a coupon code!");
      return;
    }

    try {
      const name = couponCode.trim();
      const res = await axios.get(`${server}/coupon/get-coupon-value/${name}`);

      console.log("Coupon API Response:", res.data);

      // Check if coupon code exists
      if (!res.data.couponCode || res.data.couponCode === null) {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
        return;
      }

      const couponData = res.data.couponCode;
      const shopId = couponData.shopId;
      const couponCodeValue = couponData.value;

      // Check if coupon is valid for items in cart
      if (!cart || cart.length === 0) {
        toast.error("Your cart is empty!");
        setCouponCode("");
        return;
      }

      const isCouponValid = cart.filter((item) => item.shopId === shopId);

      if (isCouponValid.length === 0) {
        toast.error("Coupon code is not valid for items in your cart!");
        setCouponCode("");
        return;
      }

      // Calculate discount based on eligible items
      const eligiblePrice = isCouponValid.reduce(
        (acc, item) => acc + (item.qty || 1) * (item.discountPrice || item.price),
        0
      );

      const calculatedDiscount = (eligiblePrice * couponCodeValue) / 100;

      setDiscountPrice(calculatedDiscount);
      setCouponCodeData(couponData);
      setCouponCode("");
      toast.success(`Coupon code applied! You saved $${calculatedDiscount.toFixed(2)}`);

    } catch (error) {
      console.error("Coupon code error:", error);
      if (error.response) {
        toast.error(error.response.data?.message || "Failed to apply coupon code!");
      } else if (error.request) {
        toast.error("Network error! Please check your connection.");
      } else {
        toast.error("Something went wrong! Please try again.");
      }
      setCouponCode("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-8">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartItemsList cart={cart} dispatch={dispatch} />
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountAmount={discountAmount}
            couponCodeData={couponCodeData}
            setCouponCodeData={setCouponCodeData}
            setDiscountPrice={setDiscountPrice}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  selectedAddressId,
  setSelectedAddressId,
}) => {
  const handleAddressSelect = (item) => {
    setAddress1(item.address1);
    setAddress2(item.address2);
    setZipCode(item.zipCode);
    setCountry(item.country);
    setCity(item.city);
    setSelectedAddressId(item._id);
  };

  const handleCheckboxChange = (e) => {
    setUserInfo(e.target.checked);
    if (!e.target.checked) {
      // Clear selected address when unchecking
      setSelectedAddressId(null);
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setCountry("");
      setCity("");
    } else if (user && user.addresses && user.addresses.length > 0) {
      // Auto-select first address (or default) when checking
      const defaultAddress = user.addresses.find(addr => addr.addressType === "Default") || user.addresses[0];
      if (defaultAddress) {
        handleAddressSelect(defaultAddress);
      }
    }
  };

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500] mb-4">Shipping Address</h5>
      <form>
        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              required
              readOnly
              className={`${styles.input} !w-full h-[40px] px-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              readOnly
              className={`${styles.input} !w-full h-[40px] px-3`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              readOnly
              className={`${styles.input} !w-full h-[40px] px-3`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">Zip Code</label>
            <input
              type="number"
              value={zipCode || ""}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${styles.input} !w-full h-[40px] px-3`}
              disabled={userInfo}
            />
          </div>
        </div>

        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">Country</label>
            <select
              className="w-full border h-[40px] rounded-[5px] px-3"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={userInfo}
            >
              <option value="">Choose your country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">City</label>
            <select
              className="w-full border h-[40px] rounded-[5px] px-3"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!country || userInfo}
            >
              <option value="">Choose your City</option>
              {State && country &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3 gap-3">
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">Address1</label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-full h-[40px] px-3`}
              disabled={userInfo}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-[14px] font-[400]">Address2</label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={`${styles.input} !w-full h-[40px] px-3`}
              disabled={userInfo}
            />
          </div>
        </div>
      </form>
      {user && user.addresses && user.addresses.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="chooseSavedAddress"
              checked={userInfo}
              onChange={handleCheckboxChange}
              className="mr-2 h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="chooseSavedAddress"
              className="text-[14px] font-[400] cursor-pointer"
            >
              Choose From saved address
            </label>
          </div>
          {userInfo && (
            <div className="mt-3 space-y-2">
              {[...user.addresses]
                .sort((a, b) => {
                  // Sort to show Default address first
                  if (a.addressType === "Default") return -1;
                  if (b.addressType === "Default") return 1;
                  return 0;
                })
                .map((item, index) => (
                  <div
                    key={item._id || index}
                    className={`w-full flex items-center p-2 rounded ${item.addressType === "Default"
                      ? "bg-blue-50 border border-blue-200"
                      : ""
                      }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      id={`address-${item._id || index}`}
                      checked={selectedAddressId === item._id}
                      onChange={() => handleAddressSelect(item)}
                      className="mr-2 h-4 w-4 cursor-pointer"
                    />
                    <label
                      htmlFor={`address-${item._id || index}`}
                      className="text-[14px] cursor-pointer flex items-center flex-1"
                    >
                      <span className="font-[500]">{item.addressType}</span>
                      {item.addressType === "Default" && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[11px] font-[500] rounded">
                          Default
                        </span>
                      )}
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CartItemsList = ({ cart, dispatch }) => {
  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
    toast.success("Item removed from cart!");
  };

  if (!cart || cart.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#fff] rounded-md p-5 mb-4 shadow">
      <h3 className="text-[18px] font-[600] mb-4">Cart Items</h3>
      <div className="space-y-4">
        {cart.map((item, index) => (
          <div key={index} className="flex items-center gap-3 pb-3 border-b">
            <img
              src={item.images && item.images[0]?.url || "https://via.placeholder.com/80"}
              alt={item.name}
              className="w-[60px] h-[60px] object-cover rounded"
            />
            <div className="flex-1">
              <h4 className="text-[14px] font-[500]">{item.name}</h4>
              <p className="text-[12px] text-[#00000082]">
                ${item.discountPrice || item.price} × {item.qty || 1}
              </p>
              <p className="text-[14px] font-[600] text-[#d02222]">
                US${((item.discountPrice || item.price) * (item.qty || 1)).toFixed(2)}
              </p>
            </div>
            <RxCross1
              className="cursor-pointer text-[#00000082] hover:text-[#d02222]"
              onClick={() => handleRemove(item)}
              size={20}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountAmount,
  couponCodeData,
  setCouponCodeData,
  setDiscountPrice,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      {couponCodeData && (
        <div className="mb-3 p-2 bg-green-50 rounded border border-green-200 flex items-center justify-between">
          <p className="text-[14px] text-green-700">
            Coupon Applied: <span className="font-[600]">{couponCodeData.name}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setCouponCodeData(null);
              setDiscountPrice(null);
              toast.info("Coupon code removed");
            }}
            className="text-red-600 hover:text-red-800 text-[12px] font-[500] cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
      <div className="flex justify-between mb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${subTotalPrice.toFixed(2)}</h5>
      </div>
      <div className="flex justify-between mb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping.toFixed(2)}</h5>
      </div>
      <div className="flex justify-between border-b pb-3 mb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {discountAmount > 0 ? `-$${discountAmount.toFixed(2)}` : "-"}
        </h5>
      </div>
      <h5 className="text-[20px] font-[600] text-end pt-3 mb-5">${totalPrice}</h5>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          className={`${styles.input} h-[40px] px-3 mb-3`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button
          type="submit"
          className="w-full h-[40px] border border-[#f63b60] bg-white text-[#f63b60] rounded-[3px] cursor-pointer hover:bg-[#f63b60] hover:text-white transition-colors font-[500]"
        >
          Apply code
        </button>
      </form>
    </div>
  );
};

export default Checkout;
