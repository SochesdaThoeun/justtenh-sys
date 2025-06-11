import {EnableSidebar, PageTitle} from '../../../_metronic/layout/core'
import {
  RecentOrderWidget,
  EarningLineGraph,
  OrderBarGraph,
  SummaryStats,
  OrderAnalytics,
  PopularProductsListWidget,
  TopSellingListWidget,
} from './components'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/app/redux/store'
import { 
  fetchSellerInfo, 
  fetchMonthlyOrders, 
  fetchEarningStatistics, 
  fetchRecentOrders 
} from '@/app/redux/vendor/vendorSlice'
import { 
  fetchMostPopularProductList, 
  fetchTopSellingProductList 
} from '@/app/redux/product/productslice'

const HomePage = () => (
  <>
    <div className='row gy-5 g-xl-10'>
      {/*begin::Col*/}
      <div className='col-xl-4'>
        <EarningLineGraph
          className='card-xl-stretch mb-xl-10'
          backGroundColor='#E0EBF5'
          chartHeight='100px'
        />
      </div>
      {/*end::Col*/}

      {/*begin::Col*/}
      <div className='col-xl-4'>
        <OrderBarGraph
          className='card-xl-stretch mb-xl-10'
          backGroundColor='#F8D6D5'
          chartHeight='100px'
        />
      </div>
      {/*end::Col*/}

      {/*begin::Col*/}
      <div className='col-xl-4'>
        <SummaryStats 
          className='card-xl-stretch mb-xl-10' 
          backGroundColor='#CBD4F4'
        />
      </div>
      {/*end::Col*/}
    </div>
    {/*end::Row*/}

    <OrderAnalytics />

    <RecentOrderWidget className='mb-5 mb-xl-10' />
    
    {/* begin::Row */}
    <div className='row g-5 g-xl-8'>
      <div className='col-xl-6'>
        <PopularProductsListWidget 
          className='card-xl-stretch mb-5 mb-xl-8'
        />
      </div>
      <div className='col-xl-6'>
        <TopSellingListWidget 
          className='card-xl-stretch mb-5 mb-xl-8'
        />
      </div>
    </div>
    {/* end::Row */}
  </>
)

const HomeWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    profile, 
    recentOrders
  } = useSelector((state: RootState) => state.vendorReducer);
  
  // Get vendor's first name for greeting
  const vendorName = profile?.f_name || 'Vendor';
  
  // Fetch all data needed for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Load all necessary data from APIs 
      await dispatch(fetchSellerInfo());
      await dispatch(fetchMonthlyOrders());
      await dispatch(fetchEarningStatistics('yearEarn'));
      await dispatch(fetchRecentOrders());
      await dispatch(fetchMostPopularProductList({ offset: 1, limit: 4, languageCode: 'en' }));
      await dispatch(fetchTopSellingProductList({ offset: 1, limit: 4, languageCode: 'en' }));
    };
    
    fetchDashboardData();
  }, [dispatch]);

  return (
    <EnableSidebar>
      <PageTitle description={`You've got ${recentOrders?.length || 0} New Sales`} breadcrumbs={[]}>
        Hello {vendorName}
      </PageTitle>
      <HomePage />
    </EnableSidebar>
  )
}

export {HomeWrapper}
