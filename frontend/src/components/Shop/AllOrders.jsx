import { Button, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import axios from "../../axios";
import { server } from "../../server";

const AllOrders = () => {
    const { orders = [], isLoading = false, error } = useSelector(
        (state) => state.order || {}
    );
    const { seller } = useSelector((state) => state.seller || {});

    const dispatch = useDispatch();

    useEffect(() => {
        if (seller && seller._id) {
            dispatch(getAllOrdersOfShop(seller._id));
        }
    }, [dispatch, seller]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearErrors" });
        }
    }, [error, dispatch]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(
                `${server}/order/update-order-status/${orderId}`,
                { status: newStatus },
                { withCredentials: true }
            );
            toast.success("Order status updated successfully!");
            // Refresh orders list
            if (seller && seller._id) {
                dispatch(getAllOrdersOfShop(seller._id));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order status");
        }
    };

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
        {
            field: "customerName",
            headerName: "Customer",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 100,
            flex: 0.5,
        },
        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.8,
            renderCell: (params) => {
                const orderStatuses = [
                    "Processing",
                    "Transferred to delivery partner",
                    "Shipping",
                    "Received",
                    "On the way",
                    "Delivered",
                    "Processing Refund",
                    "Refund Success",
                ];

                return (
                    <Select
                        value={params.row.status || "Processing"}
                        onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                        sx={{ height: "35px" }}
                    >
                        {orderStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
        },
        {
            field: "paymentInfo",
            headerName: "Payment",
            minWidth: 120,
            flex: 0.6,
        },
        {
            field: "createdAt",
            headerName: "Created At",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "Preview",
            flex: 0.8,
            minWidth: 100,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/order/${params.id}`}>
                            <Button>
                                <AiOutlineEye size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            const createdAt = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : "N/A";

            row.push({
                id: item._id,
                customerName: item.user?.name || "N/A",
                itemsQty: item.cart?.length || 0,
                total: "US$ " + item.totalPrice?.toFixed(2),
                status: item.status || "Processing",
                paymentInfo: item.paymentInfo?.type || "N/A",
                createdAt: createdAt,
            });
        });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full mx-8 pt-1 mt-10 bg-white">
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                    />
                </div>
            )}
        </>
    );
};

export default AllOrders;

