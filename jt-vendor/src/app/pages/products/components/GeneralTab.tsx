import React, { useState } from 'react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Define the language fields interface
interface LanguageField {
  lang: string;
  name: string;
  description: string;
}

interface GeneralTabProps {
  productName: string;
  setProductName: (val: string) => void;
  productDescription: string;
  setProductDescription: (val: string) => void;
  basePrice: string;
  setBasePrice: (val: string) => void;
  discountType: string;
  setDiscountType: (val: string) => void;
  discountPercentage: number;
  setDiscountPercentage: (val: number) => void;
  discountFixed: string;
  setDiscountFixed: (val: string) => void;
  taxClass: { value: string; label: string } | null;
  setTaxClass: (opt: { value: string; label: string } | null) => void;
  taxOptions: { value: string; label: string }[];
  taxType: { value: string; label: string };
  setTaxType: (newValue: any) => void;
  taxTypeOptions: { value: string; label: string }[];
  taxModel: { value: string; label: string };
  setTaxModel: (newValue: any) => void;
  taxModelOptions: { value: string; label: string }[];
  vatAmount: string;
  setVatAmount: (val: string) => void;
  getInputProps: () => any;
  getRootProps: () => any;
  isDragActive: boolean;
  galleryFiles: File[];
  setGalleryFiles: React.Dispatch<React.SetStateAction<File[]>>;
  sku: string;
  setSku: (val: string) => void;
  generateRandomSKU: () => void;
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
  supportedLanguages: {value: string, label: string}[];
  setSupportedLanguages: React.Dispatch<React.SetStateAction<{value: string, label: string}[]>>;
  languageFields: LanguageField[];
  setLanguageFields: React.Dispatch<React.SetStateAction<LanguageField[]>>;
  existingGalleryImages?: string[];
  onRemoveExistingImage?: (imagePath: string) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  productName,
  setProductName,
  productDescription,
  setProductDescription,
  basePrice,
  setBasePrice,
  discountType,
  setDiscountType,
  discountPercentage,
  setDiscountPercentage,
  discountFixed,
  setDiscountFixed,
  taxClass,
  setTaxClass,
  taxOptions,
  taxType,
  setTaxType,
  taxTypeOptions,
  taxModel,
  setTaxModel,
  taxModelOptions,
  vatAmount,
  setVatAmount,
  getInputProps,
  getRootProps,
  isDragActive,
  galleryFiles,
  setGalleryFiles,
  sku,
  setSku,
  generateRandomSKU,
  selectedAttributes,
  setSelectedAttributes,
  attributeChoices,
  setAttributeChoices,
  variationData,
  setVariationData,
  showVariationTable,
  setShowVariationTable,
  supportedLanguages,
  setSupportedLanguages,
  languageFields,
  setLanguageFields,
  existingGalleryImages,
  onRemoveExistingImage,
}) => {
  // Handlers for discount type radio
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscountType(e.target.value);
  };

  // Decide if we show the discount fields or hide them
  const showPercentageField = discountType === '2'; // '2' => Percentage
  const showFixedField = discountType === '3';      // '3' => Fixed Price

  // Add handler to remove a file from gallery
  const removeFile = (index: number) => {
    setGalleryFiles(currentFiles => 
      currentFiles.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  // State for modal preview
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Handler to open the preview modal
  const openPreviewModal = (index: number) => {
    setSelectedImageIndex(index);
    setPreviewModalOpen(true);
  };

  // Handler to close the preview modal
  const closePreviewModal = () => {
    setPreviewModalOpen(false);
    setSelectedImageIndex(null);
  };

  // Calculate the discounted price
  const calculateDiscountedPrice = () => {
    if (!basePrice) return '';
    
    const basePriceValue = parseFloat(basePrice);
    if (isNaN(basePriceValue)) return '';
    
    if (discountType === '1') { // No discount
      return `$${basePriceValue.toFixed(2)}`;
    } else if (discountType === '2') { // Percentage
      const discountValue = basePriceValue * (discountPercentage / 100);
      return `$${(basePriceValue - discountValue).toFixed(2)} (Save $${discountValue.toFixed(2)})`;
    } else if (discountType === '3' && discountFixed) { // Fixed amount
      const fixedDiscount = parseFloat(discountFixed);
      if (isNaN(fixedDiscount)) return '';
      return `$${(basePriceValue - fixedDiscount).toFixed(2)} (Save $${fixedDiscount.toFixed(2)})`;
    }
    return '';
  };

  // Calculate the price with VAT
  const calculateVatAmount = () => {
    if (!basePrice || !vatAmount) return '';
    
    const basePriceValue = parseFloat(basePrice);
    const vatPercentage = parseFloat(vatAmount);
    
    if (isNaN(basePriceValue) || isNaN(vatPercentage)) return '';
    
    const vatAmountValue = basePriceValue * (vatPercentage / 100);
    return `$${vatAmountValue.toFixed(2)} (Total: $${(basePriceValue + vatAmountValue).toFixed(2)})`;
  };

  // Handle language field changes
  const handleLanguageFieldChange = (lang: string, field: 'name' | 'description', value: string) => {
    setLanguageFields(prev => 
      prev.map(item => 
        item.lang === lang ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div
      className="tab-pane fade show active"
      id="kt_ecommerce_add_product_general"
      role="tab-panel"
    >
      <div className="d-flex flex-column gap-7 gap-lg-10">
        {/* General options */}
        <div className="card card-flush py-4">
          <div className="card-header">
            <div className="card-title">
              <h2>General</h2>
            </div>
          </div>
          <div className="card-body pt-0">
            {/* Media section now inside General */}
            <div className="mb-10">
              <label className="form-label">Media Gallery</label>
              <div className="fv-row mb-2">
                {/* Actual functioning dropzone */}
                <div
                  {...getRootProps()}
                  className="dropzone"
                  id="kt_ecommerce_add_product_media"
                >
                  <input {...getInputProps()} />
                  <div className="dz-message needsclick">
                    <i className="ki-outline ki-file-up text-primary fs-3x"></i>
                    <div className="ms-4">
                      <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                        Drop files here or click to upload.
                      </h3>
                      <span className="fs-7 fw-semibold text-gray-500">
                        Upload up to 10 files
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Display existing gallery images */}
              {existingGalleryImages && existingGalleryImages.length > 0 && (
                <div className="mt-5">
                  <h3 className="fs-6 fw-semibold mb-3">Existing Images:</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {existingGalleryImages.map((imagePath, index) => (
                      <div key={`existing-${index}`} className="position-relative" style={{ width: '120px', height: '120px' }}>
                        <img
                          src={imagePath}
                          alt={`Gallery image ${index + 1}`}
                          className="rounded border"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {onRemoveExistingImage && (
                          <button
                            type="button"
                            className="btn btn-icon btn-sm btn-light-danger position-absolute top-0 end-0 m-1"
                            onClick={() => onRemoveExistingImage(imagePath)}
                          >
                            <i className="ki-outline ki-cross fs-1"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Display uploaded files */}
              {galleryFiles.length > 0 && (
                <div className="mt-5">
                  <h3 className="fs-6 fw-semibold mb-3">New Uploads:</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {galleryFiles.map((file, index) => (
                      <div key={`new-${index}`} className="position-relative" style={{ width: '120px', height: '120px' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Gallery image ${index + 1}`}
                          className="rounded border"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-icon btn-sm btn-light-danger position-absolute top-0 end-0 m-1"
                          onClick={() => setGalleryFiles(prev => prev.filter((_, i) => i !== index))}
                        >
                          <i className="ki-outline ki-cross fs-1"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-muted fs-7 mt-2">
                Set the product media gallery. Only *.png, *.jpg and *.jpeg image files are accepted.
              </div>
            </div>

            {/* Language Tabs */}
            <div className="mb-10">
              <div className="card">
                <div className="card-header card-header-stretch">
                  <h3 className="card-title">Product Languages</h3>
                  <div className="card-toolbar">
                    <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
                      <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#kt_tab_english">English</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#kt_tab_khmer">Khmer</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body">
                  <div className="tab-content" id="myTabContent">
                    {/* English Tab */}
                    <div className="tab-pane fade show active" id="kt_tab_english" role="tabpanel">
                      <div className="mb-10 fv-row">
                        <label className="required form-label">Product Name (English)</label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Product name in English"
                          value={languageFields.find(item => item.lang === 'en')?.name || ''}
                          onChange={(e) => handleLanguageFieldChange('en', 'name', e.target.value)}
                        />
                        <div className="text-muted fs-7">
                          Enter the product name in English.
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Description (English)</label>
                        <ReactQuill
                          value={languageFields.find(item => item.lang === 'en')?.description || ''}
                          onChange={(value) => handleLanguageFieldChange('en', 'description', value)}
                          className="min-h-200px mb-2"
                          style={{ minHeight: '200px' }}
                          placeholder="Type your product description in English here..."
                        />
                        <div className="text-muted fs-7">
                          Set a description to the product for better visibility.
                        </div>
                      </div>
                    </div>

                    {/* Khmer Tab */}
                    <div className="tab-pane fade" id="kt_tab_khmer" role="tabpanel">
                      <div className="mb-10 fv-row">
                        <label className="required form-label">Product Name (Khmer)</label>
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Product name in Khmer"
                          value={languageFields.find(item => item.lang === 'kh')?.name || ''}
                          onChange={(e) => handleLanguageFieldChange('kh', 'name', e.target.value)}
                        />
                        <div className="text-muted fs-7">
                          Enter the product name in Khmer.
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Description (Khmer)</label>
                        <ReactQuill
                          value={languageFields.find(item => item.lang === 'kh')?.description || ''}
                          onChange={(value) => handleLanguageFieldChange('kh', 'description', value)}
                          className="min-h-200px mb-2"
                          style={{ minHeight: '200px' }}
                          placeholder="Type your product description in Khmer here..."
                        />
                        <div className="text-muted fs-7">
                          Set a description to the product for better visibility.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* For backward compatibility - Hidden fields */}
            <input
              type="hidden"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <textarea
              style={{ display: 'none' }}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />

            {/* Hard-coded supported languages */}
            <div style={{ display: 'none' }}>
              {/* This hides the language dropdown but still maintains the state */}
              <input
                type="hidden"
                value={JSON.stringify([
                  {value: 'en', label: 'English'},
                  {value: 'kh', label: 'Khmer'}
                ])}
                onChange={() => {}} 
              />
            </div>
          </div>
        </div>

        {/* Pricing - Moved above Inventory */}
        <div className="card card-flush py-4">
          <div className="card-header">
            <div className="card-title">
              <h2>Pricing</h2>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="mb-10 fv-row">
              <label className="required form-label">Base Price</label>
              <input
                type="text"
                name="price"
                className="form-control mb-2"
                placeholder="Product price"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
              <div className="text-muted fs-7">
                Set the product price.
              </div>
            </div>

            <div className="fv-row mb-10">
              <label className="fs-6 fw-semibold mb-2">
                Discount Type
                <span
                  className="ms-1"
                  data-bs-toggle="tooltip"
                  title="Select a discount type that will be applied to this product"
                >
                  <i className="ki-outline ki-information-5 text-gray-500 fs-6"></i>
                </span>
              </label>
              <div
                className="row row-cols-1 row-cols-md-3 row-cols-lg-1 row-cols-xl-3 g-9"
                data-kt-buttons="true"
                data-kt-buttons-target="[data-kt-button='true']"
              >
                {/* No Discount */}
                <div className="col">
                  <label
                    role="button"
                    className={
                      'btn btn-outline btn-outline-dashed btn-active-light-primary d-flex text-start p-6 ' +
                      (discountType === '1' ? 'active' : '')
                    }
                    data-kt-button="true"
                  >
                    <span className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="discount_option"
                        value="1"
                        checked={discountType === '1'}
                        onChange={handleDiscountChange}
                      />
                    </span>
                    <span className="ms-5">
                      <span className="fs-4 fw-bold text-gray-800 d-block">
                        No Discount
                      </span>
                    </span>
                  </label>
                </div>

                {/* Percentage % */}
                <div className="col">
                  <label
                    role="button"
                    className={
                      'btn btn-outline btn-outline-dashed btn-active-light-primary d-flex text-start p-6 ' +
                      (discountType === '2' ? 'active' : '')
                    }
           
                    data-kt-button="true"
                  >
                    <span className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="discount_option"
                        value="2"
                        checked={discountType === '2'}
                        onChange={handleDiscountChange}
                      />
                    </span>
                    <span className="ms-5">
                      <span className="fs-4 fw-bold text-gray-800 d-block">
                        Percentage %
                      </span>
                    </span>
                  </label>
                </div>

                {/* Fixed Price */}
                <div className="col">
                  <label
                    role="button"
                    className={
                      'btn btn-outline btn-outline-dashed btn-active-light-primary d-flex text-start p-6 ' +
                      (discountType === '3' ? 'active' : '')
                    }
                    data-kt-button="true"
                  >
                    <span className="form-check form-check-custom form-check-solid form-check-sm align-items-start mt-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="discount_option"
                        value="3"
                        checked={discountType === '3'}
                        onChange={handleDiscountChange}
                      />
                    </span>
                    <span className="ms-5">
                      <span className="fs-4 fw-bold text-gray-800 d-block">
                        Fixed Price
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/** 
             * Discount Percentage Field 
             * Show or hide with d-none based on discountType 
             */}
            <div
              className={`mb-10 fv-row ${
                showPercentageField ? '' : 'd-none'
              }`}
              id="kt_ecommerce_add_product_discount_percentage"
            >
              <label className="form-label">Set Discount Percentage</label>
              <input
                type="number"
                className="form-control mb-2"
                value={discountPercentage}
                onChange={(e) =>
                  setDiscountPercentage(Number(e.target.value))
                }
                placeholder="Percentage discount"
              />
              <div className="text-muted fs-7">
                Set a percentage discount to be applied on this product.
              </div>
              {basePrice && discountPercentage > 0 && (
                <div className="alert alert-primary mt-3">
                  <strong>Discounted Price:</strong> {calculateDiscountedPrice()}
                </div>
              )}
            </div>

            {/** 
             * Fixed Price Discount Field 
             * Show or hide with d-none based on discountType 
             */}
            <div
              className={`mb-10 fv-row ${
                showFixedField ? '' : 'd-none'
              }`}
              id="kt_ecommerce_add_product_discount_fixed"
            >
              <label className="form-label">Fixed Discounted Price</label>
              <input
                type="text"
                name="discounted_price"
                className="form-control mb-2"
                placeholder="Discounted price"
                value={discountFixed}
                onChange={(e) => setDiscountFixed(e.target.value)}
              />
              <div className="text-muted fs-7">
                Set the discounted product price. The product will be reduced
                at the determined fixed price.
              </div>
              {basePrice && discountFixed && (
                <div className="alert alert-primary mt-3">
                  <strong>Discounted Price:</strong> {calculateDiscountedPrice()}
                </div>
              )}
            </div>

            {/* Tax */}
            <div className="d-flex flex-wrap gap-5">
              <div className="fv-row w-100 flex-md-root">
                <label className="form-label">VAT Amount (%)</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(e.target.value)}
                />
                <div className="text-muted fs-7">
                  Set the product VAT amount.
                </div>
                {basePrice && vatAmount && parseFloat(vatAmount) > 0 && (
                  <div className="alert alert-info mt-3">
                    <strong>VAT Amount:</strong> {calculateVatAmount()}
                  </div>
                )}
              </div>
            </div>

            {/* Tax Type and Model */}
            <div className="d-flex flex-wrap gap-5 mt-5">
              <div className="fv-row w-100 flex-md-root">
                <label className="form-label">Tax Type</label>
                <Select
                  className="react-select-styled react-select-outlined mb-2"
                  classNamePrefix="react-select"
                  name="tax_type"
                  placeholder="Select tax type"
                  options={taxTypeOptions}
                  value={taxType}
                  onChange={(newValue) => setTaxType(newValue || taxType)}
                />
                <div className="text-muted fs-7">
                  Set as percentage or fixed amount.
                </div>
              </div>

              <div className="fv-row w-100 flex-md-root">
                <label className="form-label">Tax Model</label>
                <Select
                  className="react-select-styled react-select-outlined mb-2"
                  classNamePrefix="react-select"
                  name="tax_model"
                  placeholder="Select tax model"
                  options={taxModelOptions}
                  value={taxModel}
                  onChange={(newValue) => setTaxModel(newValue || taxModel)}
                />
                <div className="text-muted fs-7">
                  Set if tax is included in or excluded from price.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Inventory section */}
        <div className="card card-flush py-4">
          <div className="card-header">
            <div className="card-title">
              <h2>Product Inventory</h2>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="mb-10 fv-row">
              <label className="required form-label">SKU</label>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  name="sku"
                  className="form-control mb-2"
                  placeholder="SKU Number"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn btn-primary mb-2" 
                  onClick={generateRandomSKU}
                >
                  Generate
                </button>
              </div>
              <div className="text-muted fs-7">Enter the product SKU.</div>
            </div>

            <div className="mb-5">
              <label className="form-label">Select Attributes :</label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {selectedAttributes.map(attr => (
                  <div key={attr} className="badge bg-light d-flex align-items-center p-2">
                    <span className="me-2">{attr}</span>
                    <i 
                      className="ki-outline ki-cross fs-7 cursor-pointer" 
                      onClick={() => {
                        setSelectedAttributes(prev => prev.filter(a => a !== attr));
                        const newAttributeChoices = {...attributeChoices};
                        delete newAttributeChoices[attr];
                        setAttributeChoices(newAttributeChoices);
                        
                        // Clear variation data when an attribute is removed
                        setVariationData([]);
                        setShowVariationTable(false);
                      }}
                    ></i>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-2">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Add attribute (e.g. Size, Color, etc)" 
                  id="attributeInput"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      const value = target.value.trim();
                      if (value && !selectedAttributes.includes(value)) {
                        setSelectedAttributes(prev => [...prev, value]);
                        setAttributeChoices(prev => ({...prev, [value]: []}));
                        target.value = '';
                      }
                      e.preventDefault();
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    const input = document.getElementById('attributeInput') as HTMLInputElement;
                    const value = input.value.trim();
                    if (value && !selectedAttributes.includes(value)) {
                      setSelectedAttributes(prev => [...prev, value]);
                      setAttributeChoices(prev => ({...prev, [value]: []}));
                      input.value = '';
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {selectedAttributes.map(attribute => (
              <div key={attribute} className="mb-5">
                <label className="form-label">{attribute}</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {attributeChoices[attribute]?.map((choice, index) => (
                    <div key={index} className="badge bg-light d-flex align-items-center p-2">
                      <span className="me-2">{choice}</span>
                      <i 
                        className="ki-outline ki-cross fs-7 cursor-pointer" 
                        onClick={() => {
                          const newChoices = {...attributeChoices};
                          newChoices[attribute] = newChoices[attribute].filter(c => c !== choice);
                          setAttributeChoices(newChoices);
                        }}
                      ></i>
                    </div>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter choice values"
                    id={`choiceInput-${attribute}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        const value = target.value.trim();
                        if (value) {
                          setAttributeChoices(prev => ({
                            ...prev,
                            [attribute]: [...(prev[attribute] || []), value]
                          }));
                          target.value = '';
                        }
                        e.preventDefault();
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      const input = document.getElementById(`choiceInput-${attribute}`) as HTMLInputElement;
                      const value = input.value.trim();
                      if (value) {
                        setAttributeChoices(prev => ({
                          ...prev,
                          [attribute]: [...(prev[attribute] || []), value]
                        }));
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
            
            {showVariationTable && variationData.length > 0 && (
              <div className="table-responsive mt-5">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                  <thead>
                    <tr className="fw-bold text-muted">
                      <th className="min-w-50px">SL</th>
                      <th className="min-w-150px">Attribute Variation</th>
                      <th className="min-w-150px">Variation Wise Price ($)</th>
                      <th className="min-w-150px">Variation Wise Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variationData.map((variation, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{variation.attributeVariation}</td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control"
                            value={variation.price}
                            onChange={(e) => {
                              const newVariations = [...variationData];
                              newVariations[index].price = e.target.value;
                              setVariationData(newVariations);
                            }}
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control"
                            value={variation.stock}
                            onChange={(e) => {
                              const newVariations = [...variationData];
                              newVariations[index].stock = e.target.value;
                              setVariationData(newVariations);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Image Preview Modal */}
        {previewModalOpen && selectedImageIndex !== null && galleryFiles[selectedImageIndex] && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{galleryFiles[selectedImageIndex].name}</h5>
                  <button type="button" className="btn-close" onClick={closePreviewModal}></button>
                </div>
                <div className="modal-body text-center p-0">
                  <img 
                    src={URL.createObjectURL(galleryFiles[selectedImageIndex])} 
                    className="img-fluid"
                    alt={galleryFiles[selectedImageIndex].name}
                    style={{ maxHeight: '70vh' }}
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closePreviewModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralTab; 