import React from 'react';

type CustomerInfo = {
  avatar: string;
  name: string;
  email: string;
  accountId: string;
  billingEmail: string;
  deliveryAddress: string;
  language: string;
  latestTransaction: string;
  statusTag?: string;
};

interface SidebarWidgetProps {
  customerInfo: CustomerInfo;
}

export default function SidebarWidget({ customerInfo }: SidebarWidgetProps) {
  const {
    avatar,
    name,
    email,
    accountId,
    billingEmail,
    deliveryAddress,
    language,
    latestTransaction,
    statusTag,
  } = customerInfo;

  return (
    <div className="flex-column flex-lg-row-auto w-100 w-xl-350px mb-10">
      <div className="card mb-5 mb-xl-8">
        <div className="card-body pt-15">
          {/* Profile Summary */}
          <div className="d-flex flex-center flex-column mb-5">
            <div className="symbol symbol-150px symbol-circle mb-7">
              <img src={avatar} alt="image" />
            </div>
            <a href="#" className="fs-3 text-gray-800 text-hover-primary fw-bold mb-1">
              {name}
            </a>
            <a href="#" className="fs-5 fw-semibold text-muted text-hover-primary mb-6">
              {email}
            </a>
          </div>

          {/* Details */}
          <div className="d-flex flex-stack fs-4 py-3">
            <div className="fw-bold">Details</div>
            {statusTag && <div className="badge badge-light-info d-inline">{statusTag}</div>}
          </div>
          <div className="separator separator-dashed my-3"></div>
          <div className="pb-5 fs-6">
            <div className="fw-bold mt-5">Account ID</div>
            <div className="text-gray-600">{accountId}</div>

            <div className="fw-bold mt-5">Billing Email</div>
            <div className="text-gray-600">
              <a href="#" className="text-gray-600 text-hover-primary">
                {billingEmail}
              </a>
            </div>

            <div className="fw-bold mt-5">Delivery Address</div>
            <div className="text-gray-600">
              {deliveryAddress}
            </div>

            <div className="fw-bold mt-5">Language</div>
            <div className="text-gray-600">{language}</div>

            <div className="fw-bold mt-5">Latest Transaction</div>
            <div className="text-gray-600">
              <a href="apps/ecommerce/sales/details.html" className="text-gray-600 text-hover-primary">
                {latestTransaction}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
