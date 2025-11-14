import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { getAllEvents } from "../redux/actions/event";
import styles from "../styles/styles";
import Ratings from "../components/Products/Ratings";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events || {});
  const { allProducts = [] } = useSelector((state) => state.product || {});
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  // Fallback iPhone 14 Pro Max data if no events exist
  const fallbackEventData = {
    _id: "iphone-14-pro-max-event",
    name: "Iphone 14 pro max 256 gb ssd and 8 gb ram silver colour",
    description: "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    images: [
      {
        public_id: "test",
        url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg"
      }
    ],
    originalPrice: 1299,
    discountPrice: 1099,
    sold_out: 20,
    stock: 10,
    start_Date: new Date(),
    Finish_Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    shop: {
      _id: "shop-id",
      name: "Becodemy",
      description: "Your trusted shop for quality products",
      avatar: { url: "" },
      createAt: new Date()
    },
    reviews: [],
    ratings: 0
  };

  // Use first event from allEvents if available, otherwise use fallback
  const eventData = (allEvents && allEvents.length > 0) ? allEvents[0] : fallbackEventData;

  // Find related product if event has productId or match by name
  const relatedProduct = allProducts.find(
    (product) => product._id === eventData.productId || product.name === eventData.name
  );

  // Use product reviews if available, otherwise use event reviews
  const reviews = relatedProduct?.reviews || eventData.reviews || [];
  const shopProducts = allProducts.filter(
    (product) => product.shopId === eventData?.shop?._id
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <div className="w-full min-h-[80vh] flex items-center justify-center pt-12 pb-12">
            <div className="w-[90%]">
              <EventCard active={true} data={eventData} />

              {/* Product Details Tabs */}
              <EventDetailsInfo
                data={eventData}
                reviews={reviews}
                shopProducts={shopProducts}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const EventDetailsInfo = ({ data, reviews, shopProducts, activeTab, setActiveTab }) => {
  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded mt-8">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActiveTab(1)}
          >
            Product Details
          </h5>
          {activeTab === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActiveTab(2)}
          >
            Product Reviews
          </h5>
          {activeTab === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActiveTab(3)}
          >
            Seller Information
          </h5>
          {activeTab === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>

      {activeTab === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {activeTab === 2 ? (
        <div className="w-full min-h-[40vh] py-5">
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex items-start pb-4 border-b">
                  <img
                    src={review.user?.avatar?.url || "https://via.placeholder.com/50"}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                    alt=""
                  />
                  <div className="pl-4 flex-1">
                    <div className="flex w-full items-center mb-2">
                      <h1 className="font-[600] pr-2">{review.user?.name || "Anonymous"}</h1>
                      <Ratings rating={review.rating} />
                    </div>
                    <p className="font-[400] text-[#000000a7] mb-1">{review.comment || "No comment"}</p>
                    <p className="text-[#000000a7] text-[14px]">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full justify-center min-h-[40vh] flex items-center">
              <p className="text-[18px] text-[#00000084]">No Reviews yet!</p>
            </div>
          )}
        </div>
      ) : null}

      {activeTab === 3 && data.shop && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={data.shop.avatar?.url || "https://via.placeholder.com/100"}
                  alt=""
                  className="w-[100px] h-[100px] rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className={`${styles.shop_name} pb-1 pt-1 text-[20px]`}>
                    {data.shop.name}
                  </h3>
                  <h5 className="pb-3 text-[15px] text-[#00000084]">
                    (4/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-4 text-[16px] leading-7">
              {data.shop.description || "No description available"}
            </p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600] text-[16px]">
                Joined on: <span className="font-[500]">
                  {data.shop?.createAt
                    ? new Date(data.shop.createAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </h5>
              <h5 className="font-[600] pt-3 text-[16px]">
                Total products: <span className="font-[500]">{shopProducts.length || 0}</span>
              </h5>
              <h5 className="font-[600] pt-3 text-[16px]">
                Total Reviews: <span className="font-[500]">324</span>
              </h5>
              <Link to={`/shop/preview/${data.shop._id}`}>
                <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;