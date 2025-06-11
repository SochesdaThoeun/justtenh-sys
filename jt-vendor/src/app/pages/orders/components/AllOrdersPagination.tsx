import React from 'react'
import {PaginationWidget} from '../../../components/common/PaginationWidget'
import { useDispatch, useSelector } from 'react-redux'
import { 
  RootState, 
  AppDispatch 
} from '../../../redux/store'
import { changePage } from '../../../redux/order/orderSlice'

// -------------------------------------------------------
// Pagination Widget Props
// -------------------------------------------------------
export interface AllOrdersPaginationProps {
  totalEntries: number
  entriesPerPage: number
  onPageChange: (page: number) => void
}

export const AllOrdersPagination: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    totalSize, 
    entriesPerPage,
    currentPage
  } = useSelector((state: RootState) => state.orderReducer)

  const handlePageChange = (page: number) => {
    dispatch(changePage(page))
  }

  return (
    <PaginationWidget
      totalEntries={totalSize}
      entriesPerPage={entriesPerPage}
      onPageChange={handlePageChange}
    />
  )
} 