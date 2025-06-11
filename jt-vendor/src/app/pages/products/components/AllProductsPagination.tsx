import React from 'react'
import { PaginationWidget } from '../../../components/common/PaginationWidget'
import { changePage } from '../../../redux/product/productslice'
import { useDispatch, useSelector } from 'react-redux'
import { 
    RootState, 
    AppDispatch 
  } from '../../../redux/store'


// -------------------------------------------------------
// Pagination Widget Props
// -------------------------------------------------------
export interface AllProductsPaginationProps {
  totalEntries: number
  entriesPerPage: number
  onPageChange: (page: number) => void
}

export const AllProductsPagination: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
  const { 
    totalSize, 
    entriesPerPage,
    currentPage
  } = useSelector((state: RootState) => state.product)

  const handlePageChange = (page: number) => {
    //console.log('Changing page to:', page)
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