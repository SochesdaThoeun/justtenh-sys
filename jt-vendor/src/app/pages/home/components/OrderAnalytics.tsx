import { StatisticsWidget5 } from "./StatisticsWidget5";
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

const OrderAnalytics = () => {
  // Get order status data directly from Redux state
  const statusData = useSelector((state: RootState) => 
    state.vendorReducer.profile?.dashboardData?.orderStatus || {
      pending: 0,
      confirmed: 0,
      processing: 0,
      out_for_delivery: 0,
      delivered: 0,
      canceled: 0,
      returned: 0,
      failed: 0
    }
  );

  const pendingCount = Number(statusData.pending) + Number(statusData.processing);
  const outForDeliveryCount = Number(statusData.out_for_delivery);
  const deliveredCount = Number(statusData.delivered);
  const failedCount = Number(statusData.canceled) + Number(statusData.returned) + Number(statusData.failed);

  return (
    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-xl-8'
          svgIcon='purchase'
          color='white'
          iconColor='black'
          title={pendingCount.toString()}
          description='Pending Orders'
        />
      </div>
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-xl-8'
          svgIcon='delivery'
          color='white'
          iconColor='black'
          title={outForDeliveryCount.toString()}
          description='Out For Delivery'
        />
      </div>
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-xl-8'
          svgIcon='tablet-ok'
          color='white'
          iconColor='black'
          title={deliveredCount.toString()}
          description='Order Delivered'
        />
      </div>
      <div className='col-xl-3'>
        <StatisticsWidget5
          className='card-xl-stretch mb-5 mb-xl-8'
          svgIcon='tablet-delete'
          color='white'
          iconColor='black'
          title={failedCount.toString()}
          description='Failed Orders'
        />
      </div>
    </div>
  );
};

export { OrderAnalytics }