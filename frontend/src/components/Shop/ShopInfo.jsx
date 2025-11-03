import react from 'react';
import { useSelector } from 'react-redux';
import { backend_url, server } from '../../server';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShopInfo = ({ isOwner }) => {
    const { seller } = useSelector((state) => state.seller);
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/dashboard/settings');
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${server}/shop/logout`, { withCredentials: true });
            toast.success('Logged out');
            navigate('/shop-login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Logout failed');
        }
    };
    return (
        <div className='w-full py-5'>
            <div className='w-full flex items-center justify-center'>
                <img
                    src={`${backend_url}${seller?.avatar?.url || seller?.avatar || ''}`}
                    alt=''
                    className='w-[150px] h-[150px] object-cover rounded-full'
                />
            </div>
            <div className='w-full text-center mt-4'>
                <h3 className='text-[18px] font-[600] text-[#333]'>{seller?.name || 'Shop Name'}</h3>
                <p className='text-[14px] text-[#777] mt-1'>{seller?.email || ''}</p>
                {seller?.createdAt && (
                    <p className='text-[13px] text-[#888] mt-1'>Joined: {new Date(seller.createdAt).toLocaleDateString()}</p>
                )}
            </div>

            {/* Details like in the video: Address, Phone, Total Products, Ratings */}
            <div className='w-full mt-6 px-5 space-y-4 text-left'>
                <div>
                    <h5 className='text-[13px] font-[600] text-[#666]'>Address</h5>
                    <p className='text-[14px] text-[#333] mt-1 break-words'>{seller?.address || '—'}</p>
                </div>
                <div>
                    <h5 className='text-[13px] font-[600] text-[#666]'>Phone Number</h5>
                    <p className='text-[14px] text-[#333] mt-1'>03087543</p>
                </div>
                <div>
                    <h5 className='text-[13px] font-[600] text-[#666]'>Total Products</h5>
                    <p className='text-[14px] text-[#333] mt-1'>10</p>
                </div>
                <div>
                    <h5 className='text-[13px] font-[600] text-[#666]'>Shop Ratings</h5>
                    <p className='text-[14px] text-[#333] mt-1'>4/5</p>
                </div>
            </div>

            {isOwner && (
                <div className='w-full mt-6 px-4 space-y-3'>
                    <button onClick={handleEdit} className='w-full h-[40px] bg-[#111827] text-white rounded-[4px] hover:opacity-90'>Edit Shop</button>
                    <button onClick={handleLogout} className='w-full h-[40px] bg-[#ef4444] text-white rounded-[4px] hover:bg-[#dc2626]'>Log Out</button>
                </div>
            )}
        </div>
    )
}

export default ShopInfo;