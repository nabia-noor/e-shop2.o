import React from 'react'
import { AiOutlineGif, AiOutlineGift } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { FiShoppingBag } from 'react-icons/fi';
import { FiPackage } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { backend_url } from '../../../server';

const DashboardHeader = () => {
    const { seller } = useSelector((state) => state.seller);
    return (
        <div className='w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4'>
            <div>
                <Link to="/dashboard">
                    <img src='https://shopo.quomodothemes.website/assets/images/logo.svg' alt='' />
                </Link>
            </div>
            <div className='flex items-center'>
                <div className='flex items-center mr-4'>
                    <Link to='/dashboard/cupouns' className='800px:block hidden'>
                        <AiOutlineGift
                            color='#555'
                            size={30}
                            className='mx-5 cursor-pointer'
                        />
                    </Link>
                    <Link to='/dashboard-events' className='800px:block hidden'>
                        <MdOutlineLocalOffer
                            color='#555'
                            size={30}
                            className='mx-5 cursor-pointer'
                        />
                    </Link>
                    <Link to='/dashboard-products' className='800px:block hidden'>
                        <FiShoppingBag
                            color='#555'
                            size={30}
                            className='mx-5 cursor-pointer'
                        />
                    </Link>
                    <Link to='/dashboard-orders' className='800px:block hidden'>
                        <FiPackage
                            color='#555'
                            size={30}
                            className='mx-5 cursor-pointer'
                        />
                    </Link>
                    <Link to='/dashboard-messages' className='800px:block hidden'>
                        <BiMessageSquareDetail
                            color='#555'
                            size={30}
                            className='mx-5 cursor-pointer'
                        />
                    </Link>
                    <Link to="/dashboard/profile">
                        {seller && seller._id ? (
                            <img src={`${backend_url}${seller.avatar?.url || seller.avatar}`}
                                alt=''
                                className='w-[50px] h-[50px] rounded-full object-cover'
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className='w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center' style={{ display: seller && seller._id ? 'none' : 'flex' }}>
                            <span className='text-gray-600 text-sm'>Profile</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default DashboardHeader;