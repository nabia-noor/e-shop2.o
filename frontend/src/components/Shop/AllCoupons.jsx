import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllProductsShop } from "../../redux/actions/product";
import { loadSeller } from "../../redux/actions/user";

const AllCoupons = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [minAmount, setMinAmout] = useState(null);
    const [maxAmount, setMaxAmount] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [value, setValue] = useState(null);
    const { seller } = useSelector((state) => state.seller);
    const { products = [] } = useSelector((state) => state.product || {});

    // Get products array properly - check both direct array and nested
    const productsList = Array.isArray(products) ? products : [];

    const dispatch = useDispatch();

    useEffect(() => {
        // Load seller if not loaded
        if (!seller) {
            console.log("Seller not found, loading seller...");
            dispatch(loadSeller());
        }
        // Load products for dropdown
        if (seller && seller._id) {
            console.log("Seller loaded, checking products...");
            if (!products || products.length === 0) {
                console.log("Loading products for dropdown...");
                dispatch(getAllProductsShop(seller._id));
            }
        }
    }, [dispatch, seller]);

    useEffect(() => {
        console.log("Seller in coupon useEffect:", seller);
        if (seller && seller._id) {
            setIsLoading(true);
            console.log("Fetching coupons for seller:", seller._id);
            axios
                .get(`/coupon/get-coupon/${seller._id}`)
                .then((res) => {
                    setIsLoading(false);
                    console.log("Full response:", res);
                    console.log("Response data:", res.data);
                    // Backend returns {success: true, couponCodes: [...]}
                    // Try multiple possible response structures
                    const couponData = res.data?.couponCodes || res.data?.data?.couponCodes || res.data || [];
                    console.log("Extracted couponData:", couponData);
                    console.log("Is array?", Array.isArray(couponData));
                    console.log("Data type:", typeof couponData);
                    if (Array.isArray(couponData)) {
                        console.log("Setting coupons array with length:", couponData.length);
                        setCoupons(couponData);
                    } else {
                        console.log("couponData is not an array, setting empty array");
                        setCoupons([]);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.error("Error fetching coupons:", error);
                    console.error("Error response:", error.response);
                    toast.error(error.response?.data?.message || "Failed to load coupons");
                });
        } else {
            console.log("Seller not available or seller._id missing");
            console.log("Seller object:", seller);
            setIsLoading(false);
        }
    }, [seller]);

    const handleDelete = async (id) => {
        axios.delete(`/coupon/delete-coupon/${id}`).then((res) => {
            toast.success("Coupon code deleted successfully!");
            // Refresh coupons list
            if (seller && seller._id) {
                axios
                    .get(`/coupon/get-coupon/${seller._id}`)
                    .then((res) => {
                        const couponData = res.data?.couponCodes || res.data?.data?.couponCodes || res.data || [];
                        setCoupons(Array.isArray(couponData) ? couponData : []);
                    })
                    .catch((error) => {
                        console.error("Error refreshing coupons:", error);
                    });
            }
        }).catch((error) => {
            console.error("Error deleting coupon:", error);
            toast.error(error.response?.data?.message || "Failed to delete coupon");
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post(
                `/coupon/create-coupon-code`,
                {
                    name,
                    minAmount,
                    maxAmount,
                    selectedProducts,
                    value,
                    shopId: seller._id,
                }
            )
            .then((res) => {
                toast.success("Coupon code created successfully!");
                setOpen(false);
                // Reset form
                setName("");
                setValue(null);
                setMinAmout(null);
                setMaxAmount(null);
                setSelectedProducts(null);
                // Refresh coupons list
                if (seller && seller._id) {
                    axios
                        .get(`/coupon/get-coupon/${seller._id}`)
                        .then((res) => {
                            const couponData = res.data.couponCodes || res.data || [];
                            setCoupons(Array.isArray(couponData) ? couponData : []);
                        })
                        .catch((error) => {
                            console.error("Error refreshing coupons:", error);
                        });
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };

    const columns = [
        { field: "id", headerName: "Coupon Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: "Coupon Code",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: "Discount %",
            minWidth: 120,
            flex: 0.8,
        },
        {
            field: "minAmount",
            headerName: "Min Amount",
            minWidth: 120,
            flex: 0.8,
        },
        {
            field: "maxAmount",
            headerName: "Max Amount",
            minWidth: 120,
            flex: 0.8,
        },
        {
            field: "selectedProduct",
            headerName: "Product",
            minWidth: 150,
            flex: 1.0,
        },
        {
            field: "Delete",
            flex: 0.8,
            minWidth: 120,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => handleDelete(params.id)}>
                            <AiOutlineDelete size={20} />
                        </Button>
                    </>
                );
            },
        },
    ];

    const row = React.useMemo(() => {
        console.log("Building rows from coupons:", coupons);
        const rows = [];
        if (coupons && Array.isArray(coupons)) {
            console.log("Coupons is array with length:", coupons.length);
            coupons.forEach((item) => {
                if (item && item._id) {
                    console.log("Adding coupon to rows:", item);
                    rows.push({
                        id: item._id,
                        name: item.name || "N/A",
                        price: item.value ? `${item.value}%` : "N/A",
                        minAmount: item.minAmount ? `$${item.minAmount}` : "No limit",
                        maxAmount: item.maxAmount ? `$${item.maxAmount}` : "No limit",
                        selectedProduct: item.selectedProduct || "All products",
                    });
                } else {
                    console.log("Skipping item - missing _id:", item);
                }
            });
        } else {
            console.log("Coupons is not an array:", coupons);
        }
        console.log("Final rows array:", rows);
        return rows;
    }, [coupons]);

    // Show loading if seller is not loaded or coupons are loading
    const { isLoading: sellerLoading } = useSelector((state) => state.seller || {});

    if (sellerLoading || isLoading) {
        return <Loader />;
    }

    // Show message if seller is not available
    if (!seller || !seller._id) {
        return (
            <div className="w-full mx-8 pt-1 mt-10 bg-white">
                <div className="w-full text-center py-10">
                    <p className="text-red-500 text-lg">Please login as seller to view coupons</p>
                    <p className="text-gray-500 text-sm mt-2">Seller information not found</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full mx-8 pt-1 mt-10 bg-white">
                <div className="w-full flex justify-end">
                    <div
                        className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3 cursor-pointer`}
                        onClick={() => setOpen(true)}
                    >
                        <span className="text-white">Create Coupon Code</span>
                    </div>
                </div>
                {row && row.length > 0 ? (
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                        autoHeight
                    />
                ) : coupons.length === 0 ? (
                    <div className="w-full text-center py-10">
                        <p className="text-gray-500 text-lg mb-4">No coupons found. Create your first coupon!</p>
                        <button
                            className={`${styles.button} !h-[40px] px-4 !rounded-[5px]`}
                            onClick={() => setOpen(true)}
                        >
                            <span className="text-white">Create Your First Coupon</span>
                        </button>
                    </div>
                ) : null}
                {open && (
                    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
                        <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
                            <div className="w-full flex justify-end">
                                <RxCross1
                                    size={30}
                                    className="cursor-pointer"
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                            <h5 className="text-[30px] font-Poppins text-center">
                                Create Coupon code
                            </h5>
                            {/* create coupon code */}
                            <form onSubmit={handleSubmit} aria-required={true}>
                                <br />
                                <div>
                                    <label className="pb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={name}
                                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your coupon code name..."
                                    />
                                </div>
                                <br />
                                <div>
                                    <label className="pb-2">
                                        Discount Percentenge{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="value"
                                        value={value}
                                        required
                                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="Enter your coupon code value..."
                                    />
                                </div>
                                <br />
                                <div>
                                    <label className="pb-2">Min Amount</label>
                                    <input
                                        type="number"
                                        name="value"
                                        value={minAmount}
                                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        onChange={(e) => setMinAmout(e.target.value)}
                                        placeholder="Enter your coupon code min amount..."
                                    />
                                </div>
                                <br />
                                <div>
                                    <label className="pb-2">Max Amount</label>
                                    <input
                                        type="number"
                                        name="value"
                                        value={maxAmount}
                                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        placeholder="Enter your coupon code max amount..."
                                    />
                                </div>
                                <br />
                                <div>
                                    <label className="pb-2">Selected Product</label>
                                    <select
                                        className="w-full mt-2 border h-[35px] rounded-[5px]"
                                        value={selectedProducts}
                                        onChange={(e) => setSelectedProducts(e.target.value)}
                                    >
                                        <option value="Choose your selected products">
                                            Choose a selected product
                                        </option>
                                        {productsList &&
                                            productsList.length > 0 &&
                                            productsList.map((i) => (
                                                <option value={i.name} key={i._id || i.name}>
                                                    {i.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <br />
                                <div>
                                    <input
                                        type="submit"
                                        value="Create"
                                        className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-black text-white font-medium"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AllCoupons;