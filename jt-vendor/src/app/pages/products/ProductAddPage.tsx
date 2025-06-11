import React, { useCallback, useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import { useDropzone } from 'react-dropzone';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { addProduct, resetProductAdded } from '@/app/redux/product/productslice';
import { uploadProductImage, UploadImageResponse } from '@/app/redux/product/product.service';
import { getDefaultLanguage } from '@/app/redux/product/productOperations.service';
import { getCategories } from '@/app/redux/category/category.slice';
import GeneralTab from '@/app/pages/products/components/GeneralTab';
import AdvancedTab from '@/app/pages/products/components/AdvancedTab';

/**
 * ProductAddPage Component
 * 
 * Form fields map to these API parameters:
 * - name (array): Product name as array of strings
 *   - ["Product Name"]
 * - category_id (integer): Category ID
 * - product_type (string): "physical" or "digital"
 * - unit_price (numeric): Product price
 * - description (array): Product description as array of strings
 *   - ["<p>Product description</p>"]
 * - minimum_order_qty (integer): Minimum order quantity
 * - code (string): Product SKU
 * - lang (array): Supported languages
 * - unit (string): Required if product_type is "physical"
 * - discount (numeric): Discount amount
 * - discount_type (string): "flat" or "percent"
 */

/**
 * Example options, typically from config or an API
 */
const brandOptions = [
  { value: '1', label: 'Your Brand' },
];

// Update existing taxOptions to be taxClassOptions
const taxClassOptions = [
  { value: '', label: '' },
  { value: '0', label: 'Tax Free' },
  { value: '1', label: 'Taxable Goods' },
  { value: '2', label: 'Downloadable Product' },
];

// Add tax type options
const taxTypeOptions = [
  { value: 'percent', label: 'Percentage (%)' },
  { value: 'amount', label: 'Fixed Amount' },
];

// Add tax model options
const taxModelOptions = [
  { value: 'include', label: 'Included in price' },
  { value: 'exclude', label: 'Excluded from price' },
];

// Define the language fields interface
interface LanguageField {
  lang: string;
  name: string;
  description: string;
}

const ProductAddPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, productAdded } = useSelector((state: RootState) => state.product);
  const { categories, isLoading: categoriesLoading } = useSelector((state: RootState) => state.category);
  
  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  
  // Transform categories for select options
  const productCategoryOptions = useMemo(() => {
    const options = categories.map(category => ({
      value: category.id.toString(),
      label: category.name
    }));
    
    return options;
  }, [categories]);

  // Reset productAdded state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetProductAdded());
    };
  }, [dispatch]);

  // Navigate to product list on successful add
  useEffect(() => {
    if (productAdded) {
      alert('Product added successfully!');
      //window.location.href = '/products/list/all';
    }
  }, [productAdded]);

  // Handle error display
  const [formError, setFormError] = useState('');
  
  // Define error type for Laravel validation errors
  interface ValidationError {
    code: string;
    message: string;
  }
  
  // For demonstration, unify the rest of the form data in states
  
  // ...
  
  // Languages - Fixed to only English and Khmer
  const [supportedLanguages, setSupportedLanguages] = useState<{value: string, label: string}[]>([
    {value: 'en', label: 'English'},
    {value: 'kh', label: 'Khmer'}
  ]);
  
  // Language-specific fields for product name and description
  const [languageFields, setLanguageFields] = useState<LanguageField[]>([
    { lang: 'en', name: '', description: '' },
    { lang: 'kh', name: '', description: '' }
  ]);
  
  // Fetch default language when component mounts
  useEffect(() => {
    const fetchDefaultLanguage = async () => {
      try {
        const response = await getDefaultLanguage();
        if (response && response.default_lang) {
          // Check if default language is already in the selected languages
          const defaultLang = response.default_lang;
          //console.log('Default language from server:', defaultLang);
          
          // Find if this language is already in our supportedLanguages array
          const langExists = supportedLanguages.some(lang => lang.value === defaultLang);
          
          // If not found, add it to supportedLanguages
          if (!langExists) {
            const langLabel = getLangLabel(defaultLang);
            setSupportedLanguages(prev => [...prev, {value: defaultLang, label: langLabel}]);
          }
        }
      } catch (error) {
        console.error('Error fetching default language:', error);
      }
    };
    
    fetchDefaultLanguage();
  }, []); // Only run once on component mount
  
  // Helper function to get language label from code
  const getLangLabel = (langCode: string): string => {
    const langMap: Record<string, string> = {
      'en': 'English',
      'kh': 'Khmer',
    };
    
    return langMap[langCode] || langCode;
  };
  
  useEffect(() => {
    if (error) {
      try {
        //console.log('Error:', error);
        // Check if error is already an array
        if (Array.isArray(error)) {
          // Direct array from API
          if (error.length > 0 && typeof error[0] === 'object' && 'message' in error[0]) {
            const errorMessages = error.map(item => item.message).join('\n');
            setFormError(errorMessages);
            return;
          }
        }
        
        // Handle string format that might be JSON
        if (typeof error === 'string') {
          try {
            const parsedError = JSON.parse(error);
            if (Array.isArray(parsedError)) {
              // Parsed array format with code/message structure
              if (parsedError.length > 0 && typeof parsedError[0] === 'object' && 'message' in parsedError[0]) {
                const errorMessages = parsedError.map(item => item.message).join('\n');
                setFormError(errorMessages);
                return;
              }
            }
            // Fall back to showing the parsed object as a string
            setFormError(JSON.stringify(parsedError));
            return;
          } catch {
            // Not valid JSON, use the string directly
            setFormError(error);
            return;
          }
        }
        
        // Handle any other object type
        setFormError(typeof error === 'object' ? JSON.stringify(error) : String(error));
      } catch (e) {
        // Fallback for any unexpected error handling issues
        setFormError('An error occurred while processing the error message.');
        console.error('Error parsing API error:', e, 'Original error:', error);
      }
      
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        setFormError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Basic States for the left aside
   */
  const [productBrand, setProductBrand] = useState<{ value: string; label: string } | null>(null);
  
  const [productCategories, setProductCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [tax, setTax] = useState<{ value: string; label: string } | null>(
    null
  );

  /**
   * For demonstration, unify the rest of the form data in states
   */
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountType, setDiscountType] = useState('1'); // 1 => no discount, 2 => percentage, 3 => fixed
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountFixed, setDiscountFixed] = useState('');

  const [vatAmount, setVatAmount] = useState('');

  // Add tax type and model state
  const [taxType, setTaxType] = useState<{ value: string; label: string }>({ value: 'percent', label: 'Percentage (%)' });
  const [taxModel, setTaxModel] = useState<{ value: string; label: string }>({ value: 'include', label: 'Included in price' });

  // Inventory
  const [sku, setSku] = useState('');
  const [useColors, setUseColors] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [shelfQuantity, setShelfQuantity] = useState('');
  const [warehouseQuantity, setWarehouseQuantity] = useState('');
  const [allowBackorders, setAllowBackorders] = useState(false);

  // Shipping
  const [isPhysicalProduct, setIsPhysicalProduct] = useState(false);
  const [weight, setWeight] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [length, setLength] = useState('');
  const [shippingCost, setShippingCost] = useState('');

  // Meta
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Variations
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [attributeChoices, setAttributeChoices] = useState<{[key: string]: string[]}>({
    Size: [],
    Color: []
  });
  const [variationData, setVariationData] = useState<{
    attributeVariation: string,
    price: string,
    stock: string,
    sku: string
  }[]>([]);
  const [showVariationTable, setShowVariationTable] = useState(false);

  /**
   * Thumbnail image
   */
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
      setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  /**
   * Dropzone for media gallery
   */
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // You can limit to 10, or do further validations
    setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  /**
   * Form Submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields first
      const validationErrors = [];
      
      // Check if English product name is filled
      const englishName = languageFields.find(field => field.lang === 'en')?.name || '';
      if (!englishName.trim()) validationErrors.push('Product name in English is required');
      
      if (productCategories.length === 0) validationErrors.push('Category is required');
      if (!productBrand) validationErrors.push('Brand is required');
      if (!thumbnailFile) validationErrors.push('Thumbnail image is required');
      if (galleryFiles.length === 0) validationErrors.push('At least one product image is required');
      if (!basePrice || parseFloat(basePrice) <= 0) validationErrors.push('Unit price must be greater than zero');
      
      // Enhanced SKU validation
      if (!sku) {
        validationErrors.push('SKU must be at least 6 alphanumeric characters');
      } else if (sku.length < 6) {
        validationErrors.push('SKU must be at least 6 alphanumeric characters');
      } else if (!/^[a-zA-Z0-9]+$/.test(sku)) {
        validationErrors.push('SKU must be at least 6 alphanumeric characters');
      }
      
      if (isPhysicalProduct && !weight) validationErrors.push('Weight is required for physical products');
      
      // Show validation errors if any
      if (validationErrors.length > 0) {
        setFormError(validationErrors.join('\n'));
        return;
      }
      
      // Set loading state while uploading images
      setFormError('Uploading images...');
      
      // Step 1: Upload thumbnail image first
      let thumbnailData: UploadImageResponse;
      try {
        if (thumbnailFile) {
          thumbnailData = await uploadProductImage(thumbnailFile, 'thumbnail');
        } else {
          throw new Error('Thumbnail image is required');
        }
      } catch (error) {
        setFormError('Failed to upload thumbnail image. Please try again.');
        return;
      }
      
      // Step 2: Upload product gallery images
      const uploadedImages: string[] = [];
      try {
        // Upload each gallery image one by one
        for (const file of galleryFiles) {
          const imageData = await uploadProductImage(file, 'product');
          uploadedImages.push(imageData.image_name);
        }
      } catch (error) {
        setFormError('Failed to upload gallery images. Please try again.');
        return;
      }
      
      setFormError(''); // Clear the "Uploading images..." message
      
      // Prepare language-specific data for the API
      const productNames = languageFields.map(field => field.name);
      const productDescriptions = languageFields.map(field => field.description);
      
      // Create product data object in the required format
      const productData: Record<string, any> = {
        name: productNames, // Array of names in different languages
        category_id: 1, // Always set to 1 as required
        product_type: isPhysicalProduct ? 'physical' : 'digital',
        unit_price: parseFloat(basePrice),
        description: productDescriptions, // Array of descriptions in different languages
        minimum_order_qty: 1,
        code: sku,
        lang: supportedLanguages.map(lang => lang.value) // Use selected languages
      };

      // Add brand ID
      if (productBrand) {
        productData.brand_id = parseInt(productBrand.value);
      }
      
      // Physical product specific fields
      if (isPhysicalProduct) {
        productData.unit = weight ? 'kg' : '';
        if (weight) productData.weight = parseFloat(weight);
        if (width) productData.width = parseFloat(width);
        if (height) productData.height = parseFloat(height);
        if (length) productData.length = parseFloat(length);
        if (shippingCost) productData.shipping_cost = parseFloat(shippingCost);
      }

      // Set discount information
      productData.discount = 0;
      if (discountType === '2') { // Percentage
        productData.discount = discountPercentage;
        productData.discount_type = 'percent';
      } else if (discountType === '3') { // Fixed
        productData.discount = parseFloat(discountFixed);
        productData.discount_type = 'flat';
      } else {
        productData.discount_type = 'flat';
      }
      
      // Tax information
      productData.tax = vatAmount ? parseFloat(vatAmount) : 0;
      productData.tax_type = taxType ? taxType.value : 'percent';
      productData.tax_model = taxModel ? taxModel.value : 'include';
      
      // Add required missing fields with default values
      productData.sub_category_id = '';
      productData.sub_sub_category_id = '';
      productData.multiplyQTY = '0';
      productData.video_link = '';
      productData.meta_index = 'index';
      productData.meta_no_follow = 'follow';
      
      // Images
      productData.thumbnail = thumbnailData.image_name;
      productData.images = uploadedImages;
      
      // Meta information
      if (metaTitle) productData.meta_title = metaTitle;
      if (metaDescription) productData.meta_description = metaDescription;
      
      // Process variations if there are any
      if (selectedAttributes.length > 0 && showVariationTable) {
        // Format choice options
        productData.choice_options = selectedAttributes.map((attr, index) => ({
          name: `choice_${index + 1}`,
          title: attr,
          options: attributeChoices[attr] || []
        }));
        
        // Set choice directly as a simple string array (not stringified)
        productData.choice = [...selectedAttributes]; // Use spread to ensure it's a new array
        
        // Set choice numbers
        productData.choice_no = selectedAttributes.map((_, index) => index + 1);
        
        // Set choice attributes (same as choice numbers)
        productData.choice_attributes = selectedAttributes.map((_, index) => index + 1);
        
        // Format variations
        productData.variations = variationData.map(variation => ({
          type: variation.attributeVariation,
          price: parseFloat(variation.price),
          sku: variation.sku,
          qty: parseInt(variation.stock)
        }));
        
        // Calculate total stock
        productData.current_stock = variationData.reduce((sum, item) => sum + parseInt(item.stock), 0);
      } else {
        // No variations
        productData.colors = [];
        productData.colors_active = false;
        productData.color_image = [];
        productData.choice_options = [];
        productData.variations = [];
        productData.choice = [];
        productData.choice_no = [];
        productData.choice_attributes = [];
        productData.current_stock = parseInt(shelfQuantity) + parseInt(warehouseQuantity || '0');
      }
      
      // Create FormData object with the product data
      const formData = new FormData();
      formData.append('product_data', JSON.stringify(productData));
      
      // Dispatch the add product action
      dispatch(addProduct(formData));
    } catch (error) {
      setFormError('Error preparing form data. Please check the console for details.');
      console.error('Form submission error:', error);
    }
  };

  // Add a function to load dummy data for testing
  const loadDummyData = () => {
    // Basic product info
    setProductName('Test Product');
    setProductDescription('<p>This is a test product description with <strong>formatted text</strong>.</p>');
    
    // Set language-specific fields
    setLanguageFields([
      { lang: 'en', name: 'Test Product', description: '<p>This is a test product description with <strong>formatted text</strong>.</p>' },
      { lang: 'kh', name: 'ផលិតផលសាកល្បង', description: '<p>នេះគឺជាការពិពណ៌នាអំពីផលិតផលសាកល្បង។</p>' }
    ]);
    
    // Categories and brand
    setProductCategories([{ value: 'Computers', label: 'Computers' }]);
    setProductBrand({ value: '1', label: 'Apple' });
    
    // Languages - fixed to English and Khmer
    setSupportedLanguages([
      {value: 'en', label: 'English'},
      {value: 'kh', label: 'Khmer'}
    ]);
    
    // Pricing
    setBasePrice('99.99');
    setDiscountType('2'); // Percentage discount
    setDiscountPercentage(10);
    
    // Tax settings
    setTax({ value: '1', label: 'Taxable Goods' });
    setTaxType({ value: 'percent', label: 'Percentage (%)' });
    setTaxModel({ value: 'include', label: 'Included in price' });
    setVatAmount('7.5'); // Set VAT amount
    
    // Inventory
    setSku(generateAlphanumericSKU(6)); // Generate a 6-character alphanumeric SKU
    setBarcode('BARCODE' + Date.now().toString().substring(8));
    setShelfQuantity('50');
    setWarehouseQuantity('100');
    
    // Product details
    setIsPhysicalProduct(true);
    setWeight('1.5');
    setWidth('10');
    setHeight('5');
    setLength('20');
    setShippingCost('9.99'); // Add shipping cost
    
    // Meta data
    setMetaTitle('Test Product Title');
    setMetaDescription('Meta description for test product');
    
    // Sample attributes for variations
    const attributesToAdd = ['Size', 'Color'];
    setSelectedAttributes(attributesToAdd);
    
    // Sample attribute choices
    setAttributeChoices({
      'Size': ['Small', 'Medium', 'Large'],
      'Color': ['Red', 'Blue', 'Green']
    });
    
    // This will trigger useEffect to generate variation combinations automatically
  };

  // Function to generate alphanumeric SKU of specified length
  const generateAlphanumericSKU = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomSKU = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Add function to handle random SKU generation
  const handleGenerateRandomSKU = () => {
    setSku(generateRandomSKU());
  };

  useEffect(() => {
    // For development/testing purposes only
    // Comment this out for production
    // loadDummyData();
  }, []);

  // Update the useEffect to generate variations automatically when attributes change
  useEffect(() => {
    if (selectedAttributes.length === 0 || 
        selectedAttributes.some(attr => attributeChoices[attr]?.length === 0)) {
      return;
    }
    
    // Generate all combinations of attribute choices
    const generateCombinations = (
      attrs: string[], 
      index: number, 
      current: {[key: string]: string}, 
      result: {[key: string]: string}[]
    ) => {
      if (index === attrs.length) {
        result.push({...current});
        return;
      }
      
      const attr = attrs[index];
      const choices = attributeChoices[attr];
      
      for (const choice of choices) {
        current[attr] = choice;
        generateCombinations(attrs, index + 1, current, result);
      }
    };
    
    const combinations: {[key: string]: string}[] = [];
    generateCombinations(selectedAttributes, 0, {}, combinations);
    
    // Create variation data with these combinations
    const variations = combinations.map(combo => {
      // Create a string representation of this variation (e.g., "Size-L/Color-Blue")
      const attrVariation = Object.entries(combo)
        .map(([attr, val]) => `${val}`)
        .join('-');
      
      return {
        attributeVariation: attrVariation,
        price: basePrice, // Default to base price
        stock: '10',      // Default stock
        sku: sku ? `${sku}-${attrVariation}` : attrVariation // Generate SKU based on main SKU
      };
    });
    
    setVariationData(variations);
    setShowVariationTable(true);
  }, [selectedAttributes, attributeChoices, sku, basePrice]);

  // Add handlers for tax type and model
  const handleTaxTypeChange = (newValue: any) => {
    setTaxType(newValue || taxType);
  };

  const handleTaxModelChange = (newValue: any) => {
    setTaxModel(newValue || taxModel);
  };

  return (
    <>
      <style>
        {`.image-input-placeholder {
          background-image: url('assets/media/svg/files/blank-image.svg');
        }
        [data-bs-theme="dark"] .image-input-placeholder {
          background-image: url('assets/media/svg/files/blank-image-dark.svg');
        }`}
      </style>

      <form
        id="kt_ecommerce_add_product_form"
        className="form d-flex flex-column flex-lg-row"
        data-kt-redirect="apps/ecommerce/catalog/products.html"
        onSubmit={handleSubmit}
      >
        {/* Aside column */}
        <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
          {/* Thumbnail settings */}
          <div className="card card-flush py-4">
            {/* Card header */}
            <div className="card-header">
              <div className="card-title">
                <h2>Thumbnail</h2>
              </div>
            </div>
            {/* Card body */}
            <div className="card-body text-center pt-0">
              {/* Image input */}
              <div
                className={`image-input image-input-outline mb-3 ${
                  !thumbnailPreview ? 'image-input-empty image-input-placeholder' : ''
                }`}
                data-kt-image-input="true"
              >
                <div
                  className="image-input-wrapper w-150px h-150px"
                  style={
                    thumbnailPreview
                      ? {
                          backgroundImage: `url(${thumbnailPreview})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : {}
                  }
                />
                {/* Label */}
                <label
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="change"
                  data-bs-toggle="tooltip"
                  title="Change avatar"
                >
                  <i className="ki-solid ki-pencil fs-7"></i>
                  <input
                    type="file"
                    name="avatar"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleThumbnailChange}
                  />
                  <input type="hidden" name="avatar_remove" />
                </label>
                {/* Cancel */}
                <span
                  className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                  data-kt-image-input-action="cancel"
                  data-bs-toggle="tooltip"
                  title="Cancel avatar"
                  onClick={handleRemoveThumbnail}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="ki-solid ki-cross fs-2"></i>
                </span>
                {/* Remove */}
                {thumbnailPreview && (
                  <span
                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="remove"
                    data-bs-toggle="tooltip"
                    title="Remove avatar"
                    onClick={handleRemoveThumbnail}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className="ki-outline ki-cross fs-2"></i>
                  </span>
                )}
              </div>
              {/* Description */}
              <div className="text-muted fs-7">
                Set the product thumbnail image. Only *.png, *.jpg and *.jpeg
                image files are accepted
              </div>
            </div>
          </div>

          

          {/* Category & tags */}
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Product Details</h2>
              </div>
            </div>
            <div className="card-body pt-0">
              {/* Categories */}
              <label className="form-label">Categories</label>
              <Select
                isMulti
                className="react-select-styled react-select-outlined mb-2"
                classNamePrefix="react-select"
                data-control="select2"
                placeholder="Select an category"
                options={productCategoryOptions}
                value={productCategories}
                onChange={(values) => {
                  //console.log('🔄 ProductAddPage: Category selection changed:', values);
                  setProductCategories(values as { value: string; label: string }[]);
                }}
                isLoading={categoriesLoading}
              />
              <div className="text-muted fs-7 mb-7">
                Add product to a category.
              </div>
              <a
                href="./categories"
                className="btn btn-light-primary btn-sm mb-10"
              >
                <i className="ki-outline ki-plus fs-2">
                  
                </i>
                Create new category
              </a>
              
              {/* Brand Selection - Required */}
              <label className="form-label d-block required">Brand</label>
              <Select
                className="react-select-styled react-select-outlined mb-2"
                classNamePrefix="react-select"
                placeholder="Select a brand"
                options={brandOptions}
                value={productBrand}
                onChange={(option) => 
                  setProductBrand(option as { value: string; label: string })
                }
              />
              <div className="text-muted fs-7 mb-7">
                Select the product brand. This field is required.
              </div>
            </div>
          </div>

         
          
        </div>

        {/* Main column */}
        <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
          {/* Tabs */}
          <ul className="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-n2">
            <li className="nav-item">
              <a
                className="nav-link text-active-primary pb-4 active"
                data-bs-toggle="tab"
                href="#kt_ecommerce_add_product_general"
              >
                General
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-active-primary pb-4"
                data-bs-toggle="tab"
                href="#kt_ecommerce_add_product_advanced"
              >
                Advanced
              </a>
            </li>
          </ul>

          {/* Tab content */}
          <div className="tab-content">
            {/* General Tab */}
            <GeneralTab
              productName={productName}
              setProductName={setProductName}
              productDescription={productDescription}
              setProductDescription={setProductDescription}
              basePrice={basePrice}
              setBasePrice={setBasePrice}
              discountType={discountType}
              setDiscountType={setDiscountType}
              discountPercentage={discountPercentage}
              setDiscountPercentage={setDiscountPercentage}
              discountFixed={discountFixed}
              setDiscountFixed={setDiscountFixed}
              taxClass={tax}
              setTaxClass={setTax}
              taxOptions={taxClassOptions}
              taxType={taxType}
              setTaxType={handleTaxTypeChange}
              taxTypeOptions={taxTypeOptions}
              taxModel={taxModel}
              setTaxModel={handleTaxModelChange}
              taxModelOptions={taxModelOptions}
              vatAmount={vatAmount}
              setVatAmount={setVatAmount}
              getInputProps={getInputProps}
              getRootProps={getRootProps}
              isDragActive={isDragActive}
              galleryFiles={galleryFiles}
              setGalleryFiles={setGalleryFiles}
              sku={sku}
              setSku={setSku}
              generateRandomSKU={handleGenerateRandomSKU}
              selectedAttributes={selectedAttributes}
              setSelectedAttributes={setSelectedAttributes}
              attributeChoices={attributeChoices}
              setAttributeChoices={setAttributeChoices}
              variationData={variationData}
              setVariationData={setVariationData}
              showVariationTable={showVariationTable}
              setShowVariationTable={setShowVariationTable}
              supportedLanguages={supportedLanguages}
              setSupportedLanguages={setSupportedLanguages}
              languageFields={languageFields}
              setLanguageFields={setLanguageFields}
            />

            {/* Advanced Tab */}
            <AdvancedTab
              sku={sku}
              setSku={setSku}
              barcode={barcode}
              setBarcode={setBarcode}
              shelfQuantity={shelfQuantity}
              setShelfQuantity={setShelfQuantity}
              warehouseQuantity={warehouseQuantity}
              setWarehouseQuantity={setWarehouseQuantity}
              allowBackorders={allowBackorders}
              setAllowBackorders={setAllowBackorders}
              isPhysicalProduct={isPhysicalProduct}
              setIsPhysicalProduct={setIsPhysicalProduct}
              weight={weight}
              setWeight={setWeight}
              width={width}
              setWidth={setWidth}
              height={height}
              setHeight={setHeight}
              length={length}
              setLength={setLength}
              shippingCost={shippingCost}
              setShippingCost={setShippingCost}
              metaTitle={metaTitle}
              setMetaTitle={setMetaTitle}
              metaDescription={metaDescription}
              setMetaDescription={setMetaDescription}
              selectedAttributes={selectedAttributes}
              setSelectedAttributes={setSelectedAttributes}
              attributeChoices={attributeChoices}
              setAttributeChoices={setAttributeChoices}
              variationData={variationData}
              setVariationData={setVariationData}
              showVariationTable={showVariationTable}
              setShowVariationTable={setShowVariationTable}
              useColors={useColors}
              setUseColors={setUseColors}
              basePrice={basePrice}
              generateRandomSKU={handleGenerateRandomSKU}
            />
          </div>

          {/* Error message */}
          {formError && (
            <div className="alert alert-danger mb-5">
              <div className="d-flex flex-column">
                <h4 className="mb-1 text-danger">Error</h4>
                {formError.includes('\n') ? (
                  <ul className="mb-0 ps-3">
                    {formError.split('\n').map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{formError}</span>
                )}
              </div>
            </div>
          )}

          {/* Form buttons */}
          <div className="d-flex justify-content-end">
            <a
              
              id="kt_ecommerce_add_product_cancel"
              className="btn btn-light me-5"
              onClick={(e) => {window.history.back(); e.preventDefault();}}
            >
              Cancel
            </a>
            
            {/* Development-only button for loading dummy data */}
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                className="btn btn-info me-5"
                onClick={(e) => {
                  e.preventDefault();
                  loadDummyData();
                }}
              >
                Load Test Data
              </button>
            )}
            
            <button
              type="submit"
              id="kt_ecommerce_add_product_submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {!isLoading ? (
                <span className="indicator-label">Add Product</span>
              ) : (
                <span className="indicator-progress">
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

const styles = `
  .ql-editor {
    height: 200px;
    max-height: 200px;
    overflow: auto;
  }
`;

// Inject the CSS styles into the document head.
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);



export  {ProductAddPage};
 

