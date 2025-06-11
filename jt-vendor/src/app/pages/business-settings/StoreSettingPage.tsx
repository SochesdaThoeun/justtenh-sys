import React, { useState } from 'react';
import Select from 'react-select';
import { PageLink, PageTitle } from '../../../_metronic/layout/core';
import { GeneralSettingsWidget } from './components/GeneralSettingsWidget';
import { StoreSettingsWidget } from './components/StoreSettingsWidget';
import { LocalizationSettingsWidget } from './components/LocalizationSettingsWidget';
import { ProductSettingsWidget } from './components/ProductSettingsWidget';
import { CustomersSettingsWidget } from './components/CustomersSettingsWidget';

// ---------------------
// Sub-Components (Widgets)
// ---------------------


// ---------------------------------------------------
// MAIN COMPONENT: StoreSettingPage
// ---------------------------------------------------
export default function StoreSettingPage() {
  const widgetsBreadCrumbs: Array<PageLink> = [
      {
          title: 'Store Settings',
          path: '/store_settings/',
          isSeparator: false,
          isActive: false,
      },
  ]
  return (
    <>
    <PageTitle breadcrumbs={widgetsBreadCrumbs}>Store Settings</PageTitle>
    <div className="card card-flush">
      {/* Card Body */}
      <div className="card-body">
        {/* Tabs */}
        <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-4 fw-semibold mb-15">
          <li className="nav-item">
            <a
              className="nav-link text-active-primary d-flex align-items-center pb-5 active"
              data-bs-toggle="tab"
              href="#kt_ecommerce_settings_general"
            >
              <i className="ki-solid ki-home fs-2 me-2"></i>
              General
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-active-primary d-flex align-items-center pb-5"
              data-bs-toggle="tab"
              href="#kt_ecommerce_settings_store"
            >
              <i className="ki-solid ki-shop fs-2 me-2" />
              Store
            </a>
          </li>
          
        </ul>
        {/* End Tabs */}

        {/* Tab Content */}
        <div className="tab-content" id="myTabContent">
          {/* General Settings */}
          <GeneralSettingsWidget />

          {/* Store Settings */}
          <StoreSettingsWidget />

        </div>
        {/* End Tab Content */}
      </div>
      {/* End Card Body */}
    </div></>
  );
}
