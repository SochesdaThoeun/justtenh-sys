
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to='/home'
        icon='home'
        title={intl.formatMessage({id: 'MENU.HOME'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItemWithSub
        to='/orders'
        icon='purchase'
        title={intl.formatMessage({id: 'MENU.ORDER'})}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/orders/list/all' title='All Orders' hasBullet={true} />
        <AsideMenuItem to='/orders/list/pending' title='Pending Orders' hasBullet={true} />
        <AsideMenuItem to='/orders/list/out_for_delivery' title='Out For Delivery' hasBullet={true} />
        <AsideMenuItem to='/orders/list/orders_delivered' title='Orders Delivered' hasBullet={true} />
        <AsideMenuItem to='/orders/list/orders_failed' title='Orders Failed' hasBullet={true} />
        
      
      </AsideMenuItemWithSub>


      <AsideMenuItem
        to='/products/list/all'
        icon='archive'
        title={intl.formatMessage({id: 'MENU.PRODUCT'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/reviews'
        icon='star'
        title={intl.formatMessage({id: 'MENU.REVIEW'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/customers'
        icon='user'
        title={intl.formatMessage({id: 'MENU.CUSTOMER'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/reports'
        icon='chart-line'
        title={intl.formatMessage({id: 'MENU.REPORT'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/pos'
        icon='monitor-mobile'
        title={intl.formatMessage({id: 'MENU.POS'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/chat'
        icon='message-text-2'
        title={intl.formatMessage({id: 'MENU.CHAT'})}
        fontIcon='bi-app-indicator'
      />
      
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Business Section</span>
        </div>
      </div>

      <AsideMenuItem
        to='/shipping'
        icon='delivery'
        title={intl.formatMessage({id: 'MENU.SHIPPING'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/accounting'
        icon='bill'
        title={intl.formatMessage({id: 'MENU.ACCOUNTING'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/bank'
        icon='bank'
        title={intl.formatMessage({id: 'MENU.BANK'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/store_settings'
        icon='shop'
        title={intl.formatMessage({id: 'MENU.SHOP'})}
        fontIcon='bi-app-indicator'
      />





    </>
  )
}
