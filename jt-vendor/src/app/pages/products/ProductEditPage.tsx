import React, { useCallback, useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/app/redux/store';
import { updateProduct, resetProductUpdated, fetchProductDetails } from '@/app/redux/product/productslice';
import { uploadProductImage, UploadImageResponse } from '@/app/redux/product/product.service';
import { getDefaultLanguage } from '@/app/redux/product/productOperations.service';
import { getCategories } from '@/app/redux/category/category.slice';
import GeneralTab from '@/app/pages/products/components/GeneralTab';
import AdvancedTab from '@/app/pages/products/components/AdvancedTab';
import ReviewTab from '@/app/pages/products/components/ReviewTab';
import { useDropzone } from 'react-dropzone';
import ErrorDisplay from '@/app/pages/orders/components/ErrorDisplay';
import { ChoiceOptions, Product, Variation } from '@/app/redux/product/product.models';

// Define error message interface
interface ErrorMessage {
  message: string;
}

// Import tax options from utility file or define here
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

// Import brand options from utility file or define here
const brandOptions = [
  { value: '1', label: 'Your Brand' },
];

// Define the language fields interface
interface LanguageField {
  lang: string;
  name: string;
  description: string;
}

const ProductEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, productUpdated, productDetails } = useSelector((state: RootState) => state.product);
  const { categories, isLoading: categoriesLoading } = useSelector((state: RootState) => state.category);
  
  // Form error state
  const [formError, setFormError] = useState('');
  // Product not found state
  const [productNotFound, setProductNotFound] = useState(false);
  
  // Fetch categories when component mounts
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  
  // Reset productUpdated state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetProductUpdated());
    };
  }, [dispatch]);

  // Navigate to product list on successful update
  useEffect(() => {
    if (productUpdated) {
      alert('Product updated successfully!');
      //navigate('/products/list/all');
    }
  }, [productUpdated, navigate]);

  // Handle error display
  useEffect(() => {
    if (error) {
      try {
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

  // Transform categories for select options
  const productCategoryOptions = React.useMemo(() => {
    return categories.map(category => ({
      value: category.id.toString(),
      label: category.name
    }));
  }, [categories]);

  /**
   * Basic States for the product form
   */
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [discountType, setDiscountType] = useState('1'); // 1 => no discount, 2 => percentage, 3 => fixed
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountFixed, setDiscountFixed] = useState('');
  
  const [productBrand, setProductBrand] = useState<{ value: string; label: string } | null>(null);
  const [productCategories, setProductCategories] = useState<{ value: string; label: string }[]>([]);
  const [taxClass, setTaxClass] = useState<{ value: string; label: string } | null>(null);

  // Add tax type and model state
  const [taxType, setTaxType] = useState<{ value: string; label: string }>({ value: 'percent', label: 'Percentage (%)' });
  const [taxModel, setTaxModel] = useState<{ value: string; label: string }>({ value: 'include', label: 'Included in price' });
  const [vatAmount, setVatAmount] = useState('');

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
   * Languages
   */
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
          
          // Ensure both English and Khmer are in our supportedLanguages array
          const langs = [
            {value: 'en', label: 'English'},
            {value: 'kh', label: 'Khmer'}
          ];
          setSupportedLanguages(langs);
        }
      } catch (error) {
        console.error('Error fetching default language:', error);
      }
    };
    
    fetchDefaultLanguage();
  }, []);
  
  // Helper function to get language label from code
  const getLangLabel = (langCode: string): string => {
    const langMap: Record<string, string> = {
      'en': 'English',
      'kh': 'Khmer',
    };
    
    return langMap[langCode] || langCode;
  };

  /**
   * Thumbnail image
   */
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
      setThumbnailPreview(URL.createObjectURL(e.target.files[0]));
      setExistingThumbnail(null); // Clear existing thumbnail as we're replacing it
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setExistingThumbnail(null);
  };

  /**
   * Dropzone for media gallery
   */
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Remove existing gallery image
  const handleRemoveExistingImage = (imagePath: string) => {
    setExistingGalleryImages(prev => prev.filter(path => path !== imagePath));
  };

  // Function to handle random SKU generation
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

  // Parse and set product choice options and variations
  const parseChoiceOptions = useCallback((product: Product) => {
    if (!product || !product.choice_options) return;

    // Reset selected attributes and choices
    setSelectedAttributes([]);
    setAttributeChoices({});
    setShowVariationTable(false);

    const attributeNames: string[] = [];
    const choicesObj: {[key: string]: string[]} = {};

    // Process each choice option
    product.choice_options.forEach((choiceOption: ChoiceOptions) => {
      const { title } = choiceOption;
      if (!title) return;

      attributeNames.push(title);
      
      // Parse options - they might be a string or already an array
      let options: string[] = [];
      if (choiceOption.options) {
        if (typeof choiceOption.options === 'string') {
          try {
            options = JSON.parse(choiceOption.options);
          } catch (e) {
            console.error('Error parsing options:', e);
            options = [];
          }
        } else if (Array.isArray(choiceOption.options)) {
          options = choiceOption.options;
        }
      }
      
      choicesObj[title] = options;
    });

    // Set the attributes and choices
    setSelectedAttributes(attributeNames);
    setAttributeChoices(choicesObj);

    // If there are variations, populate them
    if (product.variation && Array.isArray(product.variation) && product.variation.length > 0) {
      const variations = product.variation.map((variation: Variation) => {
        return {
          attributeVariation: variation.type || '',
          price: variation.price?.toString() || '',
          stock: variation.qty?.toString() || '',
          sku: variation.sku || ''
        };
      });
      
      setVariationData(variations);
      setShowVariationTable(true);
    }
  }, []);

  // Fetch product data when productId changes
  useEffect(() => {
    if (productId) {
      //console.log(`Fetching product data for ID: ${productId}`);
      setProductNotFound(false);
      
      // Dispatch action to fetch product details
      dispatch(fetchProductDetails({ productId }))
        .unwrap()
        .then((data) => {
          //console.log('ProductEditPage: Product details fetched successfully:', data);
          if (!data) {
            setProductNotFound(true);
            return;
          }
          
          // Cast data to Product type
          const productData = data as Product;
          
          // For language-specific fields
          const langFields: LanguageField[] = [
            { lang: 'en', name: '', description: '' },
            { lang: 'kh', name: '', description: '' }
          ];

          // Update language fields with fetched data
          if (Array.isArray(productData.name)) {
            langFields[0].name = productData.name[0] || '';
            if (productData.name.length > 1) {
              langFields[1].name = productData.name[1] || '';
            }
          }

          // Handle descriptions - check for array format
          if (productData.description && Array.isArray(productData.description)) {
            langFields[0].description = productData.description[0] || '';
            if (productData.description.length > 1) {
              langFields[1].description = productData.description[1] || '';
            }
          } else if (productData.details) {
            // For backward compatibility
            if (Array.isArray(productData.details)) {
              langFields[0].description = productData.details[0] || '';
            } else if (typeof productData.details === 'string') {
              langFields[0].description = productData.details;
            }
          }

          setLanguageFields(langFields);

          // Update form fields with fetched data (for backward compatibility)
          if (productData.name) setProductName(typeof productData.name === 'string' ? productData.name : productData.name[0] || '');

          // Handle details - check both string and array formats
          if (productData.details) {
            if (Array.isArray(productData.details)) {
              setProductDescription(productData.details[0] || '');
            } else if (typeof productData.details === 'string') {
              setProductDescription(productData.details);
            } else if (typeof productData.details === 'object') {
              // If it's an object with language keys, take the first available details
              const firstDetails = String(Object.values(productData.details)[0] || '');
              setProductDescription(firstDetails);
            }
          }
          
          if (productData.unit_price) setBasePrice(productData.unit_price.toString());
          
          // Set discount information
          if (productData.discount_type) {
            if (productData.discount_type === 'percent') {
              setDiscountType('2');
              setDiscountPercentage(productData.discount || 0);
            } else if (productData.discount_type === 'flat') {
              setDiscountType('3');
              setDiscountFixed(productData.discount?.toString() || '');
            } else {
              setDiscountType('1'); // No discount
            }
          }
          
          // Set SKU and inventory
          if (productData.code) setSku(productData.code);
          if (productData.current_stock) {
            // Only set shelf quantity if there are no variations
            if (!productData.variation || !Array.isArray(productData.variation) || productData.variation.length === 0) {
              setShelfQuantity(productData.current_stock.toString());
            }
          }
          
          // Set physical product attributes
          setIsPhysicalProduct(productData.product_type === 'physical');
          if (productData.weight) setWeight(productData.weight.toString());
          if (productData.width) setWidth(productData.width.toString());
          if (productData.height) setHeight(productData.height.toString());
          if (productData.length) setLength(productData.length.toString());
          if (productData.shipping_cost) setShippingCost(productData.shipping_cost.toString());
          
          // Set meta information
          if (productData.meta_title) setMetaTitle(productData.meta_title);
          if (productData.meta_description) setMetaDescription(productData.meta_description || '');
          
          // Set category
          if (productData.category_id) {
            const categoryOption = categories.find(c => c.id === productData.category_id);
            if (categoryOption) {
              setProductCategories([{ 
                value: categoryOption.id.toString(), 
                label: categoryOption.name 
              }]);
            }
          }
          
          // Set brand
          if (productData.brand_id) {
            const brandOption = brandOptions.find(b => parseInt(b.value) === productData.brand_id);
            if (brandOption) {
              setProductBrand(brandOption);
            }
          }
          
          // Set tax information
          if (productData.tax !== undefined) {
            const taxOption = taxClassOptions.find(t => parseInt(t.value) === productData.tax);
            if (taxOption) {
              setTaxClass(taxOption);
            }
            // Set VAT amount directly from the tax value
            setVatAmount(productData.tax.toString());
          }
          
          if (productData.tax_type) {
            const typeOption = taxTypeOptions.find(t => t.value === productData.tax_type);
            if (typeOption) {
              setTaxType(typeOption);
            }
          }
          
          if (productData.tax_model) {
            const modelOption = taxModelOptions.find(m => m.value === productData.tax_model);
            if (modelOption) {
              setTaxModel(modelOption);
            }
          }
          
          // Set thumbnail and images
          if (productData.thumbnail_full_url && productData.thumbnail_full_url.path) {
            setExistingThumbnail(productData.thumbnail_full_url.path);
          }
          
          if (productData.images_full_url && Array.isArray(productData.images_full_url)) {
            const imageUrls = productData.images_full_url
              .filter(img => img.path && img.status === 200)
              .map(img => img.path) as string[];
            
            setExistingGalleryImages(imageUrls);
          }
          
          // Handle variations and choice options
          parseChoiceOptions(productData);
          
          // Set languages
          if (productData.lang && Array.isArray(productData.lang)) {
            const langOptions = productData.lang.map(lang => {
              const langLabel = getLangLabel(lang);
              return { value: lang, label: langLabel };
            });
            setSupportedLanguages(langOptions);
          }
        })
        .catch((error) => {
          console.error('ProductEditPage: Error fetching product details:', error);
          setProductNotFound(true);
        });
    }
  }, [productId, dispatch, parseChoiceOptions, categories, brandOptions, taxClassOptions, taxTypeOptions, taxModelOptions]);

  // Add useEffect to log productDetails changes
  useEffect(() => {
    if (productDetails) {
      //console.log('ProductDetails state updated:', productDetails);
    }
  }, [productDetails]);

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

  /**
   * Form Submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      setFormError('Product ID is missing');
      return;
    }
    
    try {
      // Validate required fields first
      const validationErrors = [];
      
      // Check if English product name is filled
      const englishName = languageFields.find(field => field.lang === 'en')?.name || '';
      if (!englishName.trim()) validationErrors.push('Product name in English is required');
      
      if (productCategories.length === 0) validationErrors.push('Category is required');
      if (!productBrand) validationErrors.push('Brand is required');
      if (!thumbnailFile && !existingThumbnail) validationErrors.push('Thumbnail image is required');
      if (galleryFiles.length === 0 && existingGalleryImages.length === 0) 
        validationErrors.push('At least one product image is required');
      if (!basePrice || parseFloat(basePrice) <= 0) validationErrors.push('Unit price must be greater than zero');
      if (supportedLanguages.length === 0) validationErrors.push('At least one language must be selected');
      
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
      
      // Prepare language-specific data for the API
      const productNames = languageFields.map(field => field.name);
      const productDescriptions = languageFields.map(field => field.description);
      
      // Upload new thumbnail if it exists
      let thumbnailData: UploadImageResponse | null = null;
      if (thumbnailFile) {
        setFormError('Uploading thumbnail image...');
        try {
          thumbnailData = await uploadProductImage(thumbnailFile, 'thumbnail');
        } catch (error) {
          setFormError('Failed to upload thumbnail image. Please try again.');
          return;
        }
      }
      
      // Upload new gallery images if they exist
      const uploadedImages: string[] = [];
      if (galleryFiles.length > 0) {
        setFormError('Uploading gallery images...');
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
      }
      
      setFormError(''); // Clear any upload messages
      
      // Get the original product data to preserve any fields we're not changing
      const originalProduct = productDetails || {} as Product;
      
      // Create product data object in the required format
      const productData: Record<string, any> = {
        id: productId,
        name: productNames, // Array of names in different languages
        category_id: productCategories.length > 0 ? parseInt(productCategories[0].value) : originalProduct.category_id || 1,
        product_type: isPhysicalProduct ? 'physical' : 'digital',
        unit_price: parseFloat(basePrice),
        description: productDescriptions, // Array of descriptions in different languages
        minimum_order_qty: originalProduct.minimum_order_qty || 1,
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
      
      // Add required missing fields with default values or use values from original product
      productData.sub_category_id = originalProduct.sub_category_id || '';
      productData.sub_sub_category_id = originalProduct.sub_sub_category_id || '';
      productData.multiplyQTY = originalProduct.multiply_qty || '0';
      productData.video_link = originalProduct.video_url || '';
      productData.meta_index = originalProduct.meta_index || 'index';
      productData.meta_no_follow = originalProduct.meta_no_follow || 'follow';
      
      // Images - use new thumbnail if uploaded, otherwise keep existing
      if (thumbnailData) {
        productData.thumbnail = thumbnailData.image_name;
      } else if (existingThumbnail) {
        // If we're using the existing thumbnail, get the filename from the path
        const existingThumbnailParts = existingThumbnail.split('/');
        productData.thumbnail = existingThumbnailParts[existingThumbnailParts.length - 1] || originalProduct.thumbnail;
      }
      
      // Combine existing and new gallery images
      const existingImageFileNames = existingGalleryImages.map(url => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      });
      
      const allImages = [
        ...existingImageFileNames,
        ...uploadedImages
      ];
      productData.images = allImages;
      
      // Empty tags array since we removed the tag section
      productData.tags = [];
      
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
        // If no variations, preserve original values or set defaults
        productData.colors = originalProduct.colors || [];
        productData.colors_active = originalProduct.colors_active || false;
        productData.color_image = originalProduct.color_image || [];
        productData.choice_options = originalProduct.choice_options || [];
        productData.variations = originalProduct.variation || [];
        productData.choice = originalProduct.choice || [];
        productData.choice_no = originalProduct.choice_no || [];
        productData.choice_attributes = originalProduct.attributes || [];
        
        // Set current stock from shelf and warehouse quantities
        const shelf = parseInt(shelfQuantity) || 0;
        const warehouse = parseInt(warehouseQuantity) || 0;
        productData.current_stock = shelf + warehouse;
      }
      
      // Create FormData object with the product data
      const formData = new FormData();
      formData.append('product_data', JSON.stringify(productData));
      
      // Dispatch the update product action
      dispatch(updateProduct({ id: productId, formData }));
    } catch (error) {
      setFormError('Error preparing form data. Please check the console for details.');
      console.error('Form submission error:', error);
    }
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

      {productNotFound && (
        <ErrorDisplay 
          title="Product Not Found" 
          message={`The product with ID ${productId} could not be found. Please check the ID and try again.`} 
        />
      )}

      {formError && (
        <ErrorDisplay title="Error" message={formError} />
      )}

      <form
        id="kt_ecommerce_edit_product_form"
        className="form d-flex flex-column flex-lg-row"
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
                  !thumbnailPreview && !existingThumbnail ? 'image-input-empty image-input-placeholder' : ''
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
                      : existingThumbnail
                      ? {
                          backgroundImage: `url(${existingThumbnail})`,
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
                {(thumbnailPreview || existingThumbnail) && (
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

          {/* Category & Brand */}
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
                  //console.log('🔄 ProductEditPage: Category selection changed:', values);
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
            <li className="nav-item">
              <a
                className="nav-link text-active-primary pb-4"
                data-bs-toggle="tab"
                href="#kt_ecommerce_add_product_reviews"
              >
                Reviews
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
              taxClass={taxClass}
              setTaxClass={setTaxClass}
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
              existingGalleryImages={existingGalleryImages}
              onRemoveExistingImage={handleRemoveExistingImage}
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

            {/* Reviews Tab */}
            <ReviewTab productId={productId || ''} reviews={productDetails?.reviews || []} />
          </div>

          {/* Form buttons */}
          <div className="d-flex justify-content-end">
            <a
              
              id="kt_ecommerce_edit_product_cancel"
              className="btn btn-light me-5"
              onClick={(e) => {window.history.back(); e.preventDefault();}}
            >
              Cancel
            </a>
            
            <button
              type="submit"
              id="kt_ecommerce_edit_product_submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {!isLoading ? (
                <span className="indicator-label">Update Product</span>
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

export { ProductEditPage };





          

       