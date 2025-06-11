import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PaginationWidget, PaginationProps } from '../../../components/common/PaginationWidget';
import { CustomerOrderModel } from '@/app/redux/customer/customer.models';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { fetchCustomerOrders } from '@/app/redux/customer/customer.slice';

type TransactionRow = {
  orderNo: string;
  status: string;
  amount: string;
  rewards: string;
  date: string;
};

interface OverviewWidgetProps {
  transactionData?: TransactionRow[];
  entriesPerPage: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
  customerId?: string;
}

export default function OverviewWidget({
  transactionData = [],
  entriesPerPage,
  currentPage,
  onPageChange,
  customerId,
}: OverviewWidgetProps) {
  const dispatch = useDispatch();
  const { customerOrders, customerOrdersLoading, total } = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerOrders({ 
        customerId, 
        limit: entriesPerPage, 
        offset: currentPage 
      }) as any);
    }
  }, [dispatch, customerId, entriesPerPage, currentPage]);

  // Map customer orders to transaction data format if available
  const mappedTransactions = customerOrders.length > 0
    ? customerOrders.map((order: CustomerOrderModel) => ({
        orderNo: `#${order.id}`,
        status: order.order_status?.charAt(0).toUpperCase() + order.order_status?.slice(1) || 'Pending', // Capitalize first letter
        amount: `$${(order.order_amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
        rewards: '0.00', // Default value
        date: new Date(order.created_at).toLocaleString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
      }))
    : transactionData;

  // Get status color based on order status
  const getStatusColor = (status: string): string => {
    const normalizedStatus = status.toLowerCase();
    
    if (!normalizedStatus || normalizedStatus === 'pending') return 'secondary';
    if (normalizedStatus === 'confirmed' || normalizedStatus === 'paid') return 'primary';
    if (normalizedStatus === 'delivering' || normalizedStatus === 'outfordelivery') return 'info';
    if (normalizedStatus === 'packaging') return 'warning';
    if (normalizedStatus === 'delivered' || normalizedStatus === 'completed') return 'success';
    if (normalizedStatus.includes('fail') || normalizedStatus.includes('cancel')) return 'danger';
    
    return 'info';
  };

  return (
    <div className="tab-pane fade show active" id="kt_ecommerce_customer_overview" role="tabpanel">
      {/* Order History Table */}
      <div className="card pt-4 mb-6 mb-xl-9">
        <div className="card-header border-0">
          <div className="card-title">
            <h2>Order History</h2>
          </div>
        </div>
        <div className="card-body pt-0 pb-5">
          {customerOrdersLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <table className="table align-middle table-row-dashed gy-5" id="kt_table_customers_payment">
                <thead className="border-bottom border-gray-200 fs-7 fw-bold">
                  <tr className="text-start text-muted text-uppercase gs-0">
                    <th className="min-w-100px">Order No.</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th className="min-w-100px">Date</th>
                  </tr>
                </thead>
                <tbody className="fs-6 fw-semibold text-gray-600">
                  {mappedTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">No orders found</td>
                    </tr>
                  ) : (
                    mappedTransactions.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Link
                            to={`/orders/list/all/order_details/${row.orderNo.replace('#', '')}`}
                            className="text-gray-600 text-hover-primary mb-1"
                          >
                            {row.orderNo}
                          </Link>
                        </td>
                        <td>
                          <span className={`badge badge-light-${getStatusColor(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="text-gray-900 fw-bold fs-6">{row.amount}</td>
                        <td>{row.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination at the bottom */}
              <PaginationWidget
                totalEntries={total || mappedTransactions.length}
                entriesPerPage={entriesPerPage}
                onPageChange={onPageChange}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
