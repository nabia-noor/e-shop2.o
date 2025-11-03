import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import ShopInfo from '../../components/Shop/ShopInfo'
import ShopProfileData from '../../components/Shop/ShopProfileData'
import styles from '../../styles/styles'

const ShopDashboardProfile = () => {
    return (
        <div>
            <DashboardHeader />
            <div className='w-full flex justify-between'>
                <div className='w-[80px] 800px:w-[330px]'>
                    <DashboardSideBar active={1} />
                </div>
                <div className='w-full'>
                    <div className={`${styles.section} bg-[#f5f5f5]`}>
                        <div className='w-full flex py-10 justify-between'>
                            <div className='w-[25%] bg-[#fff] rounded-[4px] shadow-sm overflow-y-scroll h-[95vh] sticky top-10 left-0 z-10'>
                                <ShopInfo isOwner={true} />
                            </div>
                            <div className='w-[72%] rounded-[4px]'>
                                <ShopProfileData isOwner={true} showDashboardBtn={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopDashboardProfile
