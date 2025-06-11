import React, { useState, useRef, useEffect } from 'react'
import Select, { SingleValue } from 'react-select'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import UpdateConfirmationModal from '../customers/widgets/modals/UpdateConfirmationModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../redux/store'
import { 
  getShippingMethods, 
  addShippingMethod, 
  updateShippingMethod,
  deleteShippingMethod,
  updateShippingMethodStatus
} from '../../redux/shippingMethod/shippingMethod.slice'
import { ShippingMethod, ShippingMethodRequest } from '../../redux/shippingMethod/shippingMethod.models'
import { PaginationWidget } from '../../components/common/PaginationWidget'

const ShippingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { shippingMethods, loading, error } = useSelector((state: RootState) => state.shippingMethod)

  // -----------------------------
  // 1. STATE MANAGEMENT
  // -----------------------------
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)

  // Form data for Add/Edit
  const [addShippingForm, setAddShippingForm] = useState<ShippingMethodRequest>({
    title: '',
    duration: '',
    cost: 0,
  })

  // Track Add vs Edit
  const [isEdit, setIsEdit] = useState(false)
  const [editItemId, setEditItemId] = useState<number | null>(null)

  // Track which items to delete
  const [deleteIds, setDeleteIds] = useState<number[]>([])
  const openDeleteConfirmationModalRef = useRef<HTMLButtonElement>(null)

  // -----------------------------
  // 2. EFFECTS
  // -----------------------------
  useEffect(() => {
    dispatch(getShippingMethods())
  }, [dispatch])

  // -----------------------------
  // 3. FILTERED DATA CALCULATION
  // -----------------------------
  const filteredShippingData = shippingMethods.filter((item) => {
    const term = searchTerm.toLowerCase()
    const statusMatch =
      selectedStatus === 'all' ||
      (item.status ? 'active' : 'locked').toLowerCase() === selectedStatus.toLowerCase()

    return (
      statusMatch &&
      (item.title.toLowerCase().includes(term) ||
        item.duration.toLowerCase().includes(term) ||
        item.cost.toString().includes(term))
    )
  })

  // Pagination calculation
  const indexOfLastEntry = currentPage * entriesPerPage
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage
  const currentEntries = filteredShippingData.slice(indexOfFirstEntry, indexOfLastEntry)

  // -----------------------------
  // 4. HANDLERS
  // -----------------------------
  const handleRowCheckboxChange = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = currentEntries.map((item) => item.id)
    if (selectedRows.length === allFilteredIds.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(allFilteredIds)
    }
  }

  // Delete handlers
  const openDeleteModal = (ids: number[]) => {
    setDeleteIds(ids)
    openDeleteConfirmationModalRef.current?.click()
  }

  const handleDeleteConfirmed = () => {
    if (deleteIds.length === 0) return
    deleteIds.forEach((id) => {
      dispatch(deleteShippingMethod(id))
    })
    setDeleteIds([])
    setSelectedRows([])
  }

  // Form handlers
  const handleAddShipping = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(addShippingMethod(addShippingForm))
    handleDiscard()
  }

  const handleUpdateShipping = (e: React.FormEvent) => {
    e.preventDefault()
    if (editItemId === null) return

    dispatch(updateShippingMethod({ id: editItemId, data: addShippingForm }))
    handleDiscard()
  }

  const handleModalFormSubmit = (e: React.FormEvent) => {
    if (isEdit) {
      handleUpdateShipping(e)
    } else {
      handleAddShipping(e)
    }
  }

  const handleDiscard = () => {
    setIsEdit(false)
    setEditItemId(null)
    setAddShippingForm({
      title: '',
      duration: '',
      cost: 0,
    })
  }

  const handleEditClick = (item: ShippingMethod) => {
    setAddShippingForm({
      title: item.title,
      duration: item.duration,
      cost: item.cost,
    })
    setIsEdit(true)
    setEditItemId(item.id)
    const modalTrigger = document.getElementById('openAddShippingModalButton')
    modalTrigger?.click()
  }

  const handleStatusChange = (id: number, currentStatus: boolean) => {
    dispatch(updateShippingMethodStatus({ id, status: currentStatus ? 0 : 1 }))
  }

  // -----------------------------
  // 5. STATUS FILTER OPTIONS
  // -----------------------------
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'locked', label: 'Locked' },
  ]

  const widgetsBreadCrumbs: PageLink[] = [
    {
      title: 'Shipping',
      path: '/shipping/',
      isSeparator: false,
      isActive: false,
    },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <PageTitle breadcrumbs={widgetsBreadCrumbs}>Shipping</PageTitle>
      <div className="card">
        {/* Header with search and filters */}
        <div className="card-header border-0 pt-6">
          <div className="card-title">
            <div className="d-flex align-items-center position-relative my-1">
              <i className="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
              <input
                type="text"
                className="form-control form-control-solid w-250px ps-13"
                placeholder="Search Shipments"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="card-toolbar">
            <div className="d-flex justify-content-end" data-kt-customer-table-toolbar="base">
              <div className="w-150px me-3">
                <Select
                  options={statusOptions}
                  placeholder="Status"
                  isSearchable={false}
                  value={statusOptions.find((option) => option.value === selectedStatus)}
                  onChange={(option: SingleValue<{ value: string; label: string }>) =>
                    setSelectedStatus(option?.value || 'all')
                  }
                  className="react-select-styled react-select-solid"
                  classNamePrefix="react-select"
                />
              </div>

              <button
                id="openAddShippingModalButton"
                type="button"
                className="btn btn-primary me-3"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_add_shipping"
                style={{ display: 'none' }}
              >
                Hidden Trigger
              </button>

              <button
                type="button"
                className="btn btn-primary me-3"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_add_shipping"
                onClick={handleDiscard}
              >
                Add Shipping
              </button>
            </div>

            <div
              className={`d-flex justify-content-end align-items-center ${
                selectedRows.length > 0 ? '' : 'd-none'
              }`}
              data-kt-customer-table-toolbar="selected"
            >
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => openDeleteModal(selectedRows)}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-body pt-0">
          <table className="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr className="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                <th className="w-10px pe-2">
                  <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={
                        currentEntries.length > 0 &&
                        currentEntries.every((item) => selectedRows.includes(item.id))
                      }
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="min-w-50px">SL</th>
                <th className="min-w-125px">Title</th>
                <th className="min-w-125px">Duration</th>
                <th className="min-w-125px">Cost</th>
                <th className="min-w-125px">Status</th>
                <th className="text-end min-w-70px">Actions</th>
              </tr>
            </thead>

            <tbody className="fw-semibold text-gray-600">
              {currentEntries.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleRowCheckboxChange(item.id)}
                      />
                    </div>
                  </td>
                  <td>{indexOfFirstEntry + index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.duration}</td>
                  <td>${item.cost}</td>
                  <td>
                    <div 
                      className={`badge badge-light-${item.status ? 'success' : 'danger'} cursor-pointer`}
                      onClick={() => handleStatusChange(item.id, item.status)}
                    >
                      {item.status ? 'Active' : 'Locked'}
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary"
                        data-bs-toggle="dropdown"
                      >
                        Actions
                        <i className="ki-duotone ki-down fs-5 ms-1"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handleEditClick(item)
                          }}
                        >
                          Edit
                        </a>
                        <a
                          className="dropdown-item text-danger"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            openDeleteModal([item.id])
                          }}
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <PaginationWidget
            totalEntries={filteredShippingData.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onEntriesPerPageChange={setEntriesPerPage}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <div
        className="modal fade"
        id="kt_modal_add_shipping"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content">
            <form className="form" onSubmit={handleModalFormSubmit}>
              <div className="modal-header">
                <h2 className="fw-bold">
                  {isEdit ? 'Edit Shipping Info' : 'Add Shipping Info'}
                </h2>
                <a
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  data-bs-dismiss="modal"
                  style={{ cursor: 'pointer' }}
                  onClick={handleDiscard}
                >
                  <i className="ki-duotone ki-cross fs-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </a>
              </div>

              <div className="modal-body py-10 px-lg-17">
                <div className="scroll-y me-n7 pe-7">
                  <div className="fv-row mb-7">
                    <label className="required fs-6 fw-semibold mb-2">Title</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="title"
                      value={addShippingForm.title}
                      onChange={(e) =>
                        setAddShippingForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="fv-row mb-7">
                    <label className="required fs-6 fw-semibold mb-2">Duration</label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      name="duration"
                      value={addShippingForm.duration}
                      onChange={(e) =>
                        setAddShippingForm((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="fv-row mb-7">
                    <label className="required fs-6 fw-semibold mb-2">Cost</label>
                    <input
                      type="number"
                      className="form-control form-control-solid"
                      name="cost"
                      value={addShippingForm.cost}
                      onChange={(e) =>
                        setAddShippingForm((prev) => ({
                          ...prev,
                          cost: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer flex-center">
                <button
                  type="button"
                  className="btn btn-light me-3"
                  data-bs-dismiss="modal"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  {isEdit ? 'Update' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <UpdateConfirmationModal
        modalId="deleteConfirmationModal"
        ref={openDeleteConfirmationModalRef}
        title="Are you sure you want to delete?"
        bodyText="You will not be able to revert this action."
        confirmText="Yes, delete"
        onSaveChanges={handleDeleteConfirmed}
      />
    </div>
  )
}

export default ShippingPage
