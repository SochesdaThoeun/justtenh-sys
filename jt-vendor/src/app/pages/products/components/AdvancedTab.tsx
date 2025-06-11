import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface AdvancedTabProps {
  sku: string;
  setSku: (val: string) => void;
  barcode: string;
  setBarcode: (val: string) => void;
  shelfQuantity: string;
  setShelfQuantity: (val: string) => void;
  warehouseQuantity: string;
  setWarehouseQuantity: (val: string) => void;
  allowBackorders: boolean;
  setAllowBackorders: (checked: boolean) => void;
  isPhysicalProduct: boolean;
  setIsPhysicalProduct: (checked: boolean) => void;
  weight: string;
  setWeight: (val: string) => void;
  width: string;
  setWidth: (val: string) => void;
  height: string;
  setHeight: (val: string) => void;
  length: string;
  setLength: (val: string) => void;
  shippingCost: string;
  setShippingCost: (val: string) => void;
  metaTitle: string;
  setMetaTitle: React.Dispatch<React.SetStateAction<string>>;
  metaDescription: string;
  setMetaDescription: React.Dispatch<React.SetStateAction<string>>;
  selectedAttributes: string[];
  setSelectedAttributes: React.Dispatch<React.SetStateAction<string[]>>;
  attributeChoices: {[key: string]: string[]};
  setAttributeChoices: React.Dispatch<React.SetStateAction<{[key: string]: string[]}>>;
  variationData: {
    attributeVariation: string,
    price: string,
    stock: string,
    sku: string
  }[];
  setVariationData: React.Dispatch<React.SetStateAction<{
    attributeVariation: string,
    price: string,
    stock: string,
    sku: string
  }[]>>;
  showVariationTable: boolean;
  setShowVariationTable: React.Dispatch<React.SetStateAction<boolean>>;
  useColors: boolean;
  setUseColors: React.Dispatch<React.SetStateAction<boolean>>;
  basePrice: string;
  generateRandomSKU: () => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  sku,
  setSku,
  barcode,
  setBarcode,
  shelfQuantity,
  setShelfQuantity,
  warehouseQuantity,
  setWarehouseQuantity,
  allowBackorders,
  setAllowBackorders,
  isPhysicalProduct,
  setIsPhysicalProduct,
  weight,
  setWeight,
  width,
  setWidth,
  height,
  setHeight,
  length,
  setLength,
  shippingCost,
  setShippingCost,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  selectedAttributes,
  setSelectedAttributes,
  attributeChoices,
  setAttributeChoices,
  variationData,
  setVariationData,
  showVariationTable,
  setShowVariationTable,
  useColors,
  setUseColors,
  basePrice,
  generateRandomSKU,
}) => {

  return (
    <div
      className="tab-pane fade"
      id="kt_ecommerce_add_product_advanced"
      role="tab-panel"
    >
      <div className="d-flex flex-column gap-7 gap-lg-10">
        {/* Shipping */}
        <div className="card card-flush py-4">
          <div className="card-header">
            <div className="card-title">
              <h2>Shipping</h2>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="fv-row">
              <div className="form-check form-check-custom form-check-solid mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="kt_ecommerce_add_product_shipping_checkbox"
                  checked={isPhysicalProduct}
                  onChange={(e) => setIsPhysicalProduct(e.target.checked)}
                />
                <label className="form-check-label">
                  This is a physical product
                </label>
              </div>
              <div className="text-muted fs-7">
                Set if the product is a physical or digital item. Physical
                products may require shipping.
              </div>
            </div>
            {isPhysicalProduct && (
              <div id="kt_ecommerce_add_product_shipping" className="mt-10">
                <div className="mb-10 fv-row">
                  <label className="form-label">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    className="form-control mb-2"
                    placeholder="Product weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <div className="text-muted fs-7">
                    Set a product weight in kilograms (kg).
                  </div>
                </div>
                <div className="mb-10 fv-row">
                  <label className="form-label">Shipping Cost</label>
                  <input
                    type="text"
                    name="shipping_cost"
                    className="form-control mb-2"
                    placeholder="Shipping cost"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                  />
                  <div className="text-muted fs-7">
                    Set the shipping cost for this product.
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </div>

        {/* Meta options */}
        <div className="card card-flush py-4">
          <div className="card-header">
            <div className="card-title">
              <h2>Meta Options</h2>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="mb-10">
              <label className="form-label">Meta Tag Title</label>
              <input
                type="text"
                className="form-control mb-2"
                name="meta_title"
                placeholder="Meta tag name"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
              <div className="text-muted fs-7">
                Set a meta tag title. Recommended to be simple and precise
                keywords.
              </div>
            </div>
            <div className="mb-10">
              <label className="form-label">Meta Tag Description</label>
              <ReactQuill               
                value={metaDescription}
                onChange={setMetaDescription}
                className="min-h-100px mb-2"
                placeholder="Type meta description here..."
              />
              <div className="text-muted fs-7">
                Set a meta tag description to the product for increased SEO
                ranking.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTab; 