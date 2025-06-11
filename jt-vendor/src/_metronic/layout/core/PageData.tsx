/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {FC, createContext, useContext, useEffect, useState} from 'react'
import {KTIcon, WithChildren} from '../../helpers'
import {useNavigate} from 'react-router-dom'

export interface PageLink {
  title: string
  path: string
  isActive: boolean
  isSeparator?: boolean
}

export interface PageDataContextModel {
  pageTitle?: string
  setPageTitle: (_title: string) => void
  pageDescription?: string
  setPageDescription: (_description: string) => void
  pageBreadcrumbs?: Array<PageLink>
  setPageBreadcrumbs: (_breadcrumbs: Array<PageLink>) => void
  showBackButton?: boolean
  setShowBackButton: (_show: boolean) => void
  handleBack: () => void
}

const PageDataContext = createContext<PageDataContextModel>({
  setPageTitle: (_title: string) => {},
  setPageBreadcrumbs: (_breadcrumbs: Array<PageLink>) => {},
  setPageDescription: (_description: string) => {},
  setShowBackButton: (_show: boolean) => {},
  handleBack: () => {},
})

const PageDataProvider: FC<WithChildren> = ({children}) => {
  const [pageTitle, setPageTitle] = useState<string>('')
  const [pageDescription, setPageDescription] = useState<string>('')
  const [pageBreadcrumbs, setPageBreadcrumbs] = useState<Array<PageLink>>([])
  const [showBackButton, setShowBackButton] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const value: PageDataContextModel = {
    pageTitle,
    setPageTitle,
    pageDescription,
    setPageDescription,
    pageBreadcrumbs,
    setPageBreadcrumbs,
    showBackButton,
    setShowBackButton,
    handleBack,
  }
  return <PageDataContext.Provider value={value}>{children}</PageDataContext.Provider>
}

function usePageData() {
  return useContext(PageDataContext)
}

type Props = {
  description?: string
  breadcrumbs?: Array<PageLink>
  showBackButton?: boolean
}

const PageTitle: FC<Props & WithChildren> = ({children, description, breadcrumbs, showBackButton}) => {
  const {setPageTitle, setPageDescription, setPageBreadcrumbs, setShowBackButton} = usePageData()
  useEffect(() => {
    if (children) {
      setPageTitle(children.toString())
    }
    return () => {
      setPageTitle('')
    }
  }, [children])

  useEffect(() => {
    if (description) {
      setPageDescription(description)
    }
    return () => {
      setPageDescription('')
    }
  }, [description])

  useEffect(() => {
    if (breadcrumbs) {
      setPageBreadcrumbs(breadcrumbs)
    }
    return () => {
      setPageBreadcrumbs([])
    }
  }, [breadcrumbs])

  useEffect(() => {
    setShowBackButton(!!showBackButton)
    return () => {
      setShowBackButton(false)
    }
  }, [showBackButton, setShowBackButton])

  return <></>
}

// Component to display back button in layouts
const PageBackButton: FC = () => {
  const {showBackButton, handleBack} = usePageData()
  
  if (!showBackButton) {
    return null
  }

  return (
    <button
      className='btn btn-sm btn-icon btn-light-primary me-3'
      onClick={handleBack}
    >
      <KTIcon iconName='arrow-left' className='fs-2' />
    </button>
  )
}

const PageDescription: FC<WithChildren> = ({children}) => {
  const {setPageDescription} = usePageData()
  useEffect(() => {
    if (children) {
      setPageDescription(children.toString())
    }
    return () => {
      setPageDescription('')
    }
  }, [children])
  return <></>
}

export {PageDescription, PageTitle, PageDataProvider, usePageData, PageBackButton}
