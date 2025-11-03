import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";
import { backend_url } from "../../server";
import { productData } from "../../static/data";

const ShopProfileData = ({ isOwner, showDashboardBtn = false }) => {
    const products = useSelector((state) => state.product?.products || []);
    const events = useSelector((state) => state.events?.events || []);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        dispatch(getAllEventsShop(id));
    }, [dispatch, id]);

    const [active, setActive] = useState(1);

    const allReviews =
        products && products.map((product) => product.reviews).flat();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <div className="w-full flex">
                    <div className="flex items-center" onClick={() => setActive(1)}>
                        <h5
                            className={`font-[600] text-[20px] ${active === 1 ? "text-red-500" : "text-[#333]"
                                } cursor-pointer pr-[20px]`}
                        >
                            Shop Products
                        </h5>
                    </div>
                    <div className="flex items-center" onClick={() => setActive(2)}>
                        <h5
                            className={`font-[600] text-[20px] ${active === 2 ? "text-red-500" : "text-[#333]"
                                } cursor-pointer pr-[20px]`}
                        >
                            Running Events
                        </h5>
                    </div>

                    <div className="flex items-center" onClick={() => setActive(3)}>
                        <h5
                            className={`font-[600] text-[20px] ${active === 3 ? "text-red-500" : "text-[#333]"
                                } cursor-pointer pr-[20px]`}
                        >
                            Shop Reviews
                        </h5>
                    </div>
                </div>
                <div>
                    {isOwner && (
                        <div>
                            <Link to="/dashboard">
                                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                                    <span className="text-[#fff]">Go Dashboard</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <br />
            {active === 1 && (
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
                    {(products && products.length ? products : productData)
                        .filter((p) => !((p.name || "").toLowerCase().includes("macbook")))
                        .map((p, index) => {
                            const first = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
                            let imageUrl = "";
                            if (first) {
                                imageUrl = typeof first === "string" ? first : first.url || "";
                                if (imageUrl && imageUrl.startsWith("/")) {
                                    imageUrl = `${backend_url}${imageUrl.replace(/^\//, "")}`;
                                }
                            }
                            // If using frontend seed data (image_Url already present)
                            if (!imageUrl && Array.isArray(p.image_Url) && p.image_Url[0]?.url) {
                                imageUrl = p.image_Url[0].url;
                            }
                            if (!imageUrl) {
                                const nameLc = (p.name || "").toLowerCase();
                                const shopLc = (p.shop?.name || p.shopName || "").toLowerCase();
                                const fallback = productData.find(pd => {
                                    const pdName = (pd.name || "").toLowerCase();
                                    const pdShop = (pd.shop?.name || "").toLowerCase();
                                    return (shopLc && pdShop && pdShop === shopLc) || (pdName && nameLc && (pdName.includes(nameLc) || nameLc.includes(pdName)));
                                });
                                if (fallback?.image_Url?.[0]?.url) {
                                    imageUrl = fallback.image_Url[0].url;
                                }
                            }
                            const adapted = {
                                ...p,
                                image_Url: [{ url: imageUrl }],
                                discount_price: p.discountPrice ?? p.discount_price,
                                total_sell: p.sold ?? p.total_sell,
                                shop: p.shop || { name: (p.shopName || "") },
                            };
                            return <ProductCard data={adapted} key={p._id || index} isShop={true} />
                        })}
                </div>
            )}

            {active === 2 && (
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
                        {events &&
                            events.map((i, index) => (
                                <ProductCard
                                    data={i}
                                    key={index}
                                    isShop={true}
                                    isEvent={true}
                                />
                            ))}
                    </div>
                    {events && events.length === 0 && (
                        <h5 className="w-full text-center py-5 text-[18px]">
                            No Events have for this shop!
                        </h5>
                    )}
                </div>
            )}

            {active === 3 && (
                <div className="w-full">
                    {allReviews &&
                        allReviews.map((item, index) => (
                            <div className="w-full flex my-4">
                                <img
                                    src={`${item.user.avatar?.url}`}
                                    className="w-[50px] h-[50px] rounded-full"
                                    alt=""
                                />
                                <div className="pl-2">
                                    <div className="flex w-full items-center">
                                        <h1 className="font-[600] pr-2">{item.user.name}</h1>
                                        <Ratings rating={item.rating} />
                                    </div>
                                    <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                                    <p className="text-[#000000a7] text-[14px]">{"2days ago"}</p>
                                </div>
                            </div>
                        ))}
                    {allReviews && allReviews.length === 0 && (
                        <h5 className="w-full text-center py-5 text-[18px]">
                            No Reviews have for this shop!
                        </h5>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopProfileData;