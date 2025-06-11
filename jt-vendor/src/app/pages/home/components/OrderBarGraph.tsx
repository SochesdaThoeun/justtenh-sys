import {useEffect, useRef, FC} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {useThemeMode} from '@/_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {useSelector} from 'react-redux'
import {RootState} from '@/app/redux/store'


type Props = {
  className: string
  chartHeight: string
  backGroundColor: string
}

const OrderBarGraph: FC<Props> = ({
  className, 
  backGroundColor, 
  chartHeight = '150px'
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()

  // Get data directly from Redux
  const orders_count = useSelector(
    (state: RootState) => state.vendorReducer?.profile?.orders_count || 0
  )
  
  const orderData = useSelector(
    (state: RootState) => state.vendorReducer.monthlyOrders || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  )

  // Ensure we have valid orderData for the chart
  const validOrderData = Array.isArray(orderData) && orderData.length > 0 
    ? orderData 
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  //console.log('Order Bar Graph data:', validOrderData);

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, validOrderData))
    if (chart) {
      chart.render()
    }

    return chart
  }

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, validOrderData])

  return (
    <div
      className={`card ${className} theme-dark-bg-body`}
      style={{backgroundColor: backGroundColor}}
    >
      {/* begin::Body */}
      <div className='card-body d-flex flex-column'>
        {/* begin::Wrapper */}
        <div className='d-flex flex-column flex-grow-1'>
          {/* begin::Title                    */}
          <a href='#' className='text-gray-900 text-hover-primary fw-bolder fs-3'>
            Orders
          </a>

          {/* end::Title */}

          <div
            ref={chartRef}
            className='mixed-widget-14-chart'
            style={{height: chartHeight, minHeight: chartHeight}}
          ></div>
        </div>
        {/* end::Wrapper */}

        {/* begin::Stats */}
        <div className='pt-5'>
          
          {/* begin::Number */}
          <span className='text-gray-900 fw-bolder fs-3x me-2 lh-0'>{orders_count}</span>
          {/* end::Number */}

          {/* begin::Text */}
          <span className='text-gray-900 fw-bolder fs-6 lh-0'>Total Orders</span>
          {/* end::Text */}
        </div>
        {/* end::Stats */}
      </div>
    </div>
  )
}

const chartOptions = (
  chartHeight: string,
  orderData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
): ApexOptions => {
  // Month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Ensure orderData is valid and has 12 months, padding with zeros if needed
  const safeOrderData = Array.isArray(orderData) ? orderData : [];
  const paddedOrderData = [...safeOrderData];
  
  // Pad array to exactly 12 elements if needed
  while (paddedOrderData.length < 12) {
    paddedOrderData.push(0);
  }
  
  // Trim array to exactly 12 elements if it's longer
  if (paddedOrderData.length > 12) {
    paddedOrderData.length = 12;
  }

  return {
    series: [
      {
        name: 'Monthly Orders',
        data: paddedOrderData,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      height: chartHeight,
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    colors: ['#ffffff'],
    plotOptions: {
      bar: {
        borderRadius: 2.5,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
        columnWidth: '20%',
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val + ''
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
      categories: months,
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      show: false,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val + ''
        },
      },
    },
  }
}

export {OrderBarGraph}
