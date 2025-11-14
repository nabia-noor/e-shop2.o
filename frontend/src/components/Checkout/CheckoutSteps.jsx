import React from "react";
import styles from "../../styles/styles";

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap justify-center">
        <div className={`${styles.noramlFlex}`}>
          <div className={`${active === 1 ? styles.cart_button : "px-[20px] h-[38px] rounded-[20px] bg-[#FDE1E6] flex items-center justify-center"}`}>
            <span className={`${active === 1 ? styles.cart_button_text : "text-[#f63b60] text-[16px] font-[600]"}`}>
              1. Shipping
            </span>
          </div>
          <div
            className={`${active > 1
              ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
              : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
              }`}
          />
        </div>

        <div className={`${styles.noramlFlex}`}>
          <div
            className={`${active >= 2
              ? styles.cart_button
              : "px-[20px] h-[38px] rounded-[20px] bg-[#FDE1E6] flex items-center justify-center"
              }`}
          >
            <span
              className={`${active >= 2
                ? styles.cart_button_text
                : "text-[#f63b60] text-[16px] font-[600]"
                }`}
            >
              2. Payment
            </span>
          </div>
          <div
            className={`${active > 2
              ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
              : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
              }`}
          />
        </div>

        <div className={`${styles.noramlFlex}`}>
          <div
            className={`${active >= 3
              ? styles.cart_button
              : "px-[20px] h-[38px] rounded-[20px] bg-[#FDE1E6] flex items-center justify-center"
              }`}
          >
            <span
              className={`${active >= 3
                ? styles.cart_button_text
                : "text-[#f63b60] text-[16px] font-[600]"
                }`}
            >
              3. Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
