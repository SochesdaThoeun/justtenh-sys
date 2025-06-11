
import React from 'react'
import {KTIcon} from '@/_metronic/helpers'


type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  title: string
  titleColor?: string
  description: string
  descriptionColor?: string
}

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
}) => {
  return (
    <a href='#' className={`card hoverable ${className}`}>
      <div className='card-body'>
        <KTIcon iconName={svgIcon} className={`text fs-3x ms-n1`} />

        <div className={`text fw-bold fs-2 mb-2 mt-5`}>{title}</div>

        <div className={`fw-semibold text`}>{description}</div>
      </div>
    </a>
  )
}

export {StatisticsWidget5}
