import {useEffect, useRef, FC} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSSVariableValue} from '@/_metronic/assets/ts/_utils'
import {useThemeMode} from '@/_metronic/partials/layout/theme-mode/ThemeModeProvider'
import {useSelector} from 'react-redux'
import {RootState} from '@/app/redux/store'

type Props = {
  className: string
  chartHeight: string
  backGroundColor: string
}

const EarningLineGraph: FC<Props> = ({
  className, 
  backGroundColor, 
  chartHeight
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
  
  // Get earning data directly from Redux
  const earningData = useSelector((state: RootState) => 
    state.vendorReducer.sellerEarnings || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  )

  // Calculate the total of all earnings (sum of all monthly earnings)
  const totalEarnings = earningData && earningData.length > 0 
    ? earningData.reduce((sum, value) => sum + (value || 0), 0)
    : 0;

  useEffect(() => {
    const chart = refreshChart()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode, earningData])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, chartOptions(chartHeight, earningData))
    if (chart) {
      chart.render()
    }

    return chart
  }

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
            Earnings
          </a>
          {/* end::Title */}

          <div
            ref={chartRef}
            className='mixed-widget-13-chart'
            style={{height: chartHeight, minHeight: chartHeight}}
          ></div>
        </div>
        {/* end::Wrapper */}

        {/* begin::Stats */}
        <div className='pt-5'>
          {/* begin::Symbol */}
          <span className='text-gray-900 fw-bolder fs-2x lh-0'>$</span>
          {/* end::Symbol */}

          {/* begin::Number */}
          <span className='text-gray-900 fw-bolder fs-3x me-2 lh-0'>
            {Math.round(totalEarnings).toLocaleString('en-US')}
          </span>
          {/* end::Number */}

          {/* begin::Text */}
          <span className='text-gray-900 fw-bolder fs-6 lh-0'>Total Earnings</span>
          {/* end::Text */}
        </div>
        {/* end::Stats */}
      </div>
    </div>
  )
}

const chartOptions = (
  chartHeight: string, 
  earningData: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
): ApexOptions => {
  const labelColor = getCSSVariableValue('--bs-gray-800')
  const strokeColor = getCSSVariableValue('--bs-gray-300') as string
  
  // Default month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return {
    series: [
      {
        name: 'Seller Earnings',
        data: earningData,
      }
    ],
    grid: {
      show: false,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [20, 120, 120, 120],
      },
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: ['#FFFFFF'],
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: strokeColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: Math.max(...earningData) * 1.2, // Set max value 20% higher than highest data point
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '$' + Math.round(val)
        },
      },
    },
    colors: ['#ffffff'],
    markers: {
      colors: [labelColor],
      strokeColors: [strokeColor],
      strokeWidth: 3,
    },
  }
}

export {EarningLineGraph}
