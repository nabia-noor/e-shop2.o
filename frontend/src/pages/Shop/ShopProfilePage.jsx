import React from 'react';
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import { useSelector } from 'react-redux';
import { backend_url } from '../../server';

const ShopProfilePage = () => {
    const { seller } = useSelector((state) => state.seller);

    return (
        <div>
            <DashboardHeader />
            <div className="w-full min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shop Profile</h1>

                        {seller ? (
                            <div className="space-y-6">
                                {/* Profile Image */}
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                                        {seller.avatar ? (
                                            <img
                                                src={`${backend_url}${seller.avatar.url || seller.avatar}`}
                                                alt="Shop Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">{seller.name}</h2>
                                        <p className="text-gray-600">{seller.email}</p>
                                    </div>
                                </div>

                                {/* Shop Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                                        <p className="text-gray-900">{seller.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <p className="text-gray-900">{seller.email}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <p className="text-gray-900">{seller.phoneNumber || 'Not provided'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                        <p className="text-gray-900">{seller.zipCode || 'Not provided'}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <p className="text-gray-900">{seller.address || 'Not provided'}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4 pt-6">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Edit Profile
                                    </button>
                                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Please log in to view your shop profile.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProfilePage;
