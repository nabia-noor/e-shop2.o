import React, { useState, useEffect } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            dispatch(loadUser());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your password to update information");
      return;
    }
    await dispatch(
      updateUserInformation(
        name,
        email,
        phoneNumber,
        password
      )
    );
    // Reload user data to get updated information
    dispatch(loadUser());
    // Clear password field
    setPassword("");
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${user?.avatar?.url}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/* user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

// ------------------------ Orders, Refund, Track, Payment, Address same as before ------------------------

const AllOrders = () => {
  const orders = [
    {
      _id: "7463hvbfbhfbrtr28820221",
      orderItems: [
        {
          name: "Iphone 14 pro max",
        },
      ],
      totalPrice: 120,
      orderstatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  orders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart?.length || 0,
      total: "US$ " + item.totalPrice,
      status: item.orderstatus,
    });
  });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const orders = [
    {
      _id: "7463hvbfbhfbrtr28820221",
      orderItems: [{ name: "Iphone 14 pro max" }],
      totalPrice: 120,
      orderstatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  orders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.orderItems.length,
      total: "US$ " + item.totalPrice,
      status: item.orderstatus,
    });
  });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const orders = [
    {
      _id: "7463hvbfbhfbrtr28820221",
      orderItems: [{ name: "Iphone 14 pro max" }],
      totalPrice: 120,
      orderstatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <Button>
            <MdTrackChanges size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  orders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.orderItems.length,
      total: "US$ " + item.totalPrice,
      status: item.orderstatus,
    });
  });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {


  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.success);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form aria-required onSubmit={passwordChangeHandler}></form>
      </div>

    </div>
  );
};

const Address = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [addressType, setAddressType] = useState("");

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!country || !city || !address1 || !address2 || !zipCode || !addressType) {
      toast.error("Please fill all the fields!");
      return;
    }

    // Validate zipCode is a valid number
    const zipCodeNum = Number(zipCode);
    if (isNaN(zipCodeNum) || zipCodeNum <= 0) {
      toast.error("Please enter a valid zip code!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to add address");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `${server}/user/add-address`,
        {
          country,
          city,
          address1,
          address2,
          zipCode: zipCodeNum,
          addressType,
        },
        config
      );

      toast.success(data?.message || "Address added successfully!");
      dispatch(loadUser());
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to add address";
      toast.error(errorMessage);
      console.error("Add address error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to delete address");
        return;
      }

      if (!id) {
        toast.error("Address ID is missing");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.delete(
        `${server}/user/delete-user-address/${id}`,
        config
      );

      toast.success(data?.message || "Address deleted successfully!");
      dispatch(loadUser());
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete address";
      toast.error(errorMessage);
      console.error("Delete address error:", error);
    }
  };

  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Addresses
        </h1>
        <div
          className={`${styles.button} !rounded-md cursor-pointer`}
          onClick={() => setOpen(!open)}
        >
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />

      {/* Add Address Form */}
      {open && (
        <div className="w-full bg-white rounded-md p-5 mb-4 shadow">
          <form onSubmit={handleSubmit}>
            <div className="w-full flex pb-3 gap-3">
              <div className="w-[50%]">
                <label className="block pb-2 text-[14px] font-[400]">Country</label>
                <select
                  className="w-full border h-[40px] rounded-[5px] px-3"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
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
                  disabled={!country}
                  required
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
                  className={`${styles.input} !w-full h-[40px] px-3`}
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className="w-[50%]">
                <label className="block pb-2 text-[14px] font-[400]">Address2</label>
                <input
                  type="text"
                  className={`${styles.input} !w-full h-[40px] px-3`}
                  required
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex pb-3 gap-3">
              <div className="w-[50%]">
                <label className="block pb-2 text-[14px] font-[400]">Zip Code</label>
                <input
                  type="number"
                  className={`${styles.input} !w-full h-[40px] px-3`}
                  required
                  value={zipCode || ""}
                  onChange={(e) => setZipCode(e.target.value ? Number(e.target.value) : null)}
                />
              </div>
              <div className="w-[50%]">
                <label className="block pb-2 text-[14px] font-[400]">Address Type</label>
                <select
                  className="w-full border h-[40px] rounded-[5px] px-3"
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  required
                >
                  <option value="">Choose Address Type</option>
                  <option value="Default">Default</option>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                </select>
              </div>
            </div>

            <div className="w-full flex gap-3">
              <button
                type="submit"
                className={`${styles.button} !rounded-md`}
              >
                <span className="text-[#fff]">Add</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setCountry("");
                  setCity("");
                  setAddress1("");
                  setAddress2("");
                  setZipCode(null);
                  setAddressType("");
                }}
                className="w-full border border-[#3a24db] text-[#3a24db] h-[40px] rounded-[5px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display Addresses */}
      {user && user.addresses && user.addresses.length > 0 ? (
        user.addresses.map((item, index) => (
          <div
            key={index}
            className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-3"
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6>
                {item.address1}, {item.address2}, {item.city}, {item.country}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6>{item.zipCode}</h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer text-red-500 hover:text-red-700"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this address?")) {
                    handleDelete(item._id);
                  }
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-center">
          <h5 className="text-[#000000ba]">No saved addresses</h5>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
