import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {AllProductsPage} from './AllProductsPage'
import { CategoryPage } from './CategoryPage'
import { CategoryAddPage } from './CategoryAddPage'
import { ProductAddPage } from './ProductAddPage'
import {CategoryEditPage} from './CategoryEditPage'
import { ProductEditPage } from './ProductEditPage'




const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Products',
    path: '/products/',
    isSeparator: false,
    isActive: false,
  },
]

const ProductsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='all'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>All Products</PageTitle>
              <AllProductsPage className={''} />
            </>
          }
        />
        <Route
          path='categories'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Categories</PageTitle>
              <CategoryPage className={''} />
            </>
          }
        />
        <Route
          path='add'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Add Product</PageTitle>
              <ProductAddPage />
            </>
          }
        />
        <Route
          path='edit/:productId'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Edit Product</PageTitle>
              <ProductEditPage />

            </>
          }
        />
        <Route
          path='category_add'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Add Category</PageTitle>
              <CategoryAddPage />
             
            </>
          }
        />
         <Route
          path='category_edit'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs} showBackButton>Order Edit</PageTitle>
              <CategoryEditPage />
            </>
          }
        />

        <Route index element={<Navigate to='/porducts/list/' />} />
      </Route>
    </Routes>
  )
}

export default ProductsPage
