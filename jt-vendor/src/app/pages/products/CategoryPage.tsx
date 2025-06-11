import React, { useMemo, useState, useEffect } from 'react'
import { KTIcon } from '../../../_metronic/helpers'
import { PaginationWidget } from '../../components/common/PaginationWidget'
import Select, { SingleValue } from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/redux/store'
import { getCategories } from '@/app/redux/category/category.slice'
import { Category } from '@/app/redux/category/category.models'

type Props = {
  className: string
}

export const CategoryPage: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { categories, isLoading } = useSelector((state: RootState) => state.category)
  
  // Fetch categories when component mounts
  useEffect(() => {
    //console.log('🔄 CategoryPage: Dispatching getCategories action')
    dispatch(getCategories())
  }, [dispatch])

  // Log categories whenever they change
  useEffect(() => {
    //console.log('📊 CategoryPage: Current categories from Redux store:', categories)
  }, [categories])

  // Filter options
  const typeOptions = [
    { value: '1', label: 'Active' },
    { value: '0', label: 'Inactive' },
  ]

  // -------------------------------------
  // FILTER STATES
  // -------------------------------------
  const [searchValue, setSearchValue] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // -------------------------------------
  // PAGINATION
  // -------------------------------------
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 10

  // Filtered categories
  const filteredCategories = useMemo(() => {
    //console.log('🔍 CategoryPage: Filtering categories with search:', searchValue, 'and type filter:', typeFilter)
    
    const filtered = categories.filter((category) => {
      const matchesSearch = category.name.toLowerCase().includes(searchValue.toLowerCase())
      const matchesType = typeFilter ? category.home_status.toString() === typeFilter : true
      return matchesSearch && matchesType
    })
    
    //console.log('🔎 CategoryPage: Filtered categories count:', filtered.length)
    return filtered
  }, [categories, searchValue, typeFilter])

  // Pagination slice
  const indexOfLastItem = currentPage * entriesPerPage
  const indexOfFirstItem = indexOfLastItem - entriesPerPage
  const currentData = filteredCategories.slice(indexOfFirstItem, indexOfLastItem)
  
  //console.log('📑 CategoryPage: Current page data:', currentData)

  // Handlers
  const handleReset = () => {
    //console.log('🔄 CategoryPage: Resetting filters')
    setSearchValue('')
    setTypeFilter('')
  }

  const handleApply = () => {
    //console.log('✅ CategoryPage: Applying filters:', { searchValue, typeFilter })
  }

  if (isLoading) {
    //console.log('⏳ CategoryPage: Loading categories...')
    return <div className="d-flex justify-content-center pt-10"><span className="spinner-border"></span></div>
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <CategoriesHeader
        searchValue={searchValue}
        typeFilter={typeFilter}
        typeOptions={typeOptions}
        onSearchChange={setSearchValue}
        onTypeChange={setTypeFilter}
        onReset={handleReset}
        onApply={handleApply}
      />
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body pt-0'>
        {/* begin::Table container */}
        <CategoriesWidget categories={currentData} />
        {/* end::Table container */}

        <PaginationWidget
          totalEntries={filteredCategories.length}
          entriesPerPage={entriesPerPage}
          onPageChange={(page) => {
            //console.log('📄 CategoryPage: Changing to page:', page)
            setCurrentPage(page)
          }}
        />
      </div>
      {/* end::Body */}
    </div>
  )
}

// --------------------------------------------------------
// Categories Header Component
// --------------------------------------------------------
type CategoriesHeaderProps = {
  searchValue: string
  typeFilter: string
  typeOptions: OptionType[]
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onReset: () => void
  onApply: () => void
}

type OptionType = {
  value: string
  label: string
}

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({
  searchValue,
  typeFilter,
  typeOptions,
  onSearchChange,
  onTypeChange,
  onReset,
  onApply,
}) => {
  return (
    <div className='card-header border-0 align-items-center py-5 gap-2 gap-md-5'>
      <div className='card-title'>
        <div className='d-flex align-items-center position-relative my-1'>
          <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
          <input
            type='text'
            data-kt-ecommerce-category-filter='search'
            className='form-control form-control-solid w-250px ps-14'
            placeholder='Search Category'
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

    
      
    </div>
  )
}

// --------------------------------------------------------
// Categories Widget Component
// --------------------------------------------------------
const CategoriesWidget: React.FC<{ categories: Category[] }> = ({ categories }) => {
  //console.log('🖥️ CategoriesWidget: Rendering categories table with', categories.length, 'items')
  
  // Log detailed category data for debugging
  React.useEffect(() => {
    //console.log('📝 CategoriesWidget: Full category data:', categories)
  }, [categories])
  
  return (
    <div className='table-responsive'>
      <table className='table align-middle table-row-dashed fs-6 gy-5' id='kt_ecommerce_category_table'>
        <thead>
          <tr className='text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0'>
            <th className='w-10px pe-2'>
              <div className='form-check form-check-sm form-check-custom form-check-solid me-3'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  data-kt-check='true'
                  data-kt-check-target='#kt_ecommerce_category_table .form-check-input'
                  value='1'
                />
              </div>
            </th>
            <th className='min-w-250px'>Category</th>
            <th className='min-w-150px'>Status</th>
            <th className='text-end min-w-70px'>Actions</th>
          </tr>
        </thead>
        <tbody className='fw-semibold text-gray-600'>
          {categories.map((category) => {
            ////console.log(`🔵 CategoriesWidget: Rendering category ID:${category.id}, Name:${category.name}, Status:${category.home_status}`)
            return (
              <tr key={category.id}>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input' type='checkbox' value='1' />
                  </div>
                </td>
                <td>
                  <div className='d-flex'>
                    <a className='symbol symbol-50px'>
                      <span
                        className='symbol-label'
                        style={{ backgroundImage: `url(${category.icon_full_url.path})` }}
                      ></span>
                    </a>
                    <div className='ms-5'>
                      <a
                       
                        className='text-gray-800 text-hover-primary fs-5 fw-bold mb-1'
                      >
                        {category.name}
                      </a>
                      <div className='text-muted fs-7 fw-bold'>
                        {category.translations && category.translations.length > 0 
                          ? category.translations[0].description || 'No description' 
                          : 'No description'}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={`badge badge-light-${category.home_status === 1 ? 'success' : 'danger'}`}>
                    {category.home_status === 1 ? 'Active' : 'Inactive'}
                  </div>
                </td>
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}


/*
<div className='card-toolbar'>
        <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
          
          <button
            type='button'
            className='btn btn-light-primary me-3'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTIcon iconName='filter' className='fs-2' />
            Filter
          </button>

         
          <div
            className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'
            data-kt-menu='true'
          >
            <div className='px-7 py-5'>
              <div className='fs-5 text-gray-900 fw-bolder'>Filter Options</div>
            </div>
            <div className='separator border-gray-200'></div>
            <div className='px-7 py-5' data-kt-user-table-filter='form'>
              <div className='mb-10'>
                <Select
                  className='react-select-styled react-select-solid'
                  classNamePrefix='react-select'
                  options={typeOptions}
                  placeholder='Category Type'
                  value={typeOptions.find((opt) => opt.value === typeFilter) ?? null}
                  onChange={(selectedOption: SingleValue<OptionType>) => {
                    onTypeChange(selectedOption?.value || '')
                  }}
                />
              </div>
              <div className='d-flex justify-content-end'>
                <button
                  type='button'
                  onClick={onReset}
                  className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                  data-kt-menu-dismiss='true'
                >
                  Reset
                </button>
                <button
                  type='button'
                  onClick={onApply}
                  className='btn btn-primary fw-bold px-6'
                  data-kt-menu-dismiss='true'
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

    
          <a href='./category_add' className='btn btn-primary'>
            <KTIcon iconName='plus' className='fs-2' />
            Add Category
          </a>
        </div>
      </div>


      */



      /*<td className='text-end'>
                  <div className='dropdown'>
                    <button
                      className='btn btn-sm btn-light btn-active-light-primary'
                      data-bs-toggle='dropdown'
                    >
                      Actions <KTIcon iconName='down' className='fs-5 ms-1' />
                    </button>
                    <div className='dropdown-menu dropdown-menu-end'>
                      <a className='dropdown-item' href={`./category_edit?id=${category.id}`}>
                        Edit
                      </a>
                      <a className='dropdown-item text-danger' href='#'>
                        Delete
                      </a>
                    </div>
                  </div>
                </td> */