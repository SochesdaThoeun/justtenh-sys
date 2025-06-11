import React from 'react';
import { Product } from '@/app/redux/product/product.models';
import SelectionProductWidget from '../widgets/SelectionProductWidget';
import SelectedProductWidget from '../widgets/SelectedProductWidget';

interface ProductWidgetProps {
  onAddProduct?: (product: Product) => void;
  onRemoveProduct?: (productId: number) => void;
  onUpdateQuantity?: (productId: number, newQuantity: number) => void;
}

// Main component that combines both widgets
const OrderEditListWidget: React.FC<ProductWidgetProps> = (props) => {
  return (
    <div className="row gy-5 g-xl-8">
      {/* CARD 1: Select Product to Add */}
      <div className="col-12">
        <SelectionProductWidget {...props} />
      </div>

      {/* CARD 2: Selected Products */}
      <div className="col-12">
        <SelectedProductWidget {...props} />
      </div>
    </div>
  );
};

// Add default props
OrderEditListWidget.defaultProps = {
  onAddProduct: undefined,
  onRemoveProduct: undefined,
  onUpdateQuantity: undefined
};

export default OrderEditListWidget;
