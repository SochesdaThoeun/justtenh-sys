import React, { useState, useCallback } from 'react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import { useDropzone } from 'react-dropzone';
import 'react-quill/dist/quill.snow.css';

/**
 * Example options for the react-select fields
 */
const statusOptions = [
  { value: '', label: '' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'unpublished', label: 'Unpublished' },
];

const templateOptions = [
  { value: '', label: '' },
  { value: 'default', label: 'Default template' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'office', label: 'Office stationary' },
  { value: 'fashion', label: 'Fashion' },
];

// For the automation conditions
const conditionTypeOptions = [
  { value: '', label: '' },
  { value: 'title', label: 'Product Title' },
  { value: 'tag', label: 'Product Tag' },
  { value: 'price', label: 'Product Price' },
];

const conditionEqualsOptions = [
  { value: '', label: '' },
  { value: 'equal', label: 'is equal to' },
  { value: 'notequal', label: 'is not equal to' },
  { value: 'greater', label: 'is greater than' },
  { value: 'less', label: 'is less than' },
  { value: 'starts', label: 'starts with' },
  { value: 'ends', label: 'ends with' },
];

interface ConditionItem {
  id: number;
  conditionType: { value: string; label: string } | null;
  conditionEquals: { value: string; label: string } | null;
  conditionValue: string;
}

const CategoryAddPage: React.FC = () => {
  // ---------------------------
  // Thumbnail state & handlers
  // ---------------------------
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

  // ---------------
  // Core form data
  // ---------------
  // Category general info
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Meta info
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  // react-select states
  const [categoryStatus, setCategoryStatus] = useState<{
    value: string;
    label: string;
  }>(statusOptions[1]); // default: 'published'

  const [storeTemplate, setStoreTemplate] = useState<{
    value: string;
    label: string;
  }>(templateOptions[1]); // default: 'default'

  // ---------------
  // Automation
  // ---------------
  // "0" => Manual, "1" => Automatic
  const [automationMethod, setAutomationMethod] = useState('0');

  // Conditions array
  const [conditions, setConditions] = useState<ConditionItem[]>([
    {
      id: Date.now(),
      conditionType: null,
      conditionEquals: null,
      conditionValue: '',
    },
  ]);

  const handleAddCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        id: Date.now(),
        conditionType: null,
        conditionEquals: null,
        conditionValue: '',
      },
    ]);
  };

  const handleRemoveCondition = (id: number) => {
    setConditions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConditionChange = (
    id: number,
    field: 'conditionType' | 'conditionEquals' | 'conditionValue',
    value: any
  ) => {
    setConditions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // ---------------
  // Dropzone (if you want to handle gallery or other images)
  // ---------------
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setGalleryFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  // ---------------
  // Form Submit
  // ---------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      thumbnailFile,
      categoryName,
      categoryDescription,
      metaTitle,
      metaDescription,
      metaKeywords,
      categoryStatus,
      storeTemplate,
      automationMethod,
      conditions,
      // If you want the gallery files:
      galleryFiles,
    };

    //console.log('Category form submitted:', formData);
    // Submit to API or do whatever you need
  };

  return (
    <>
      <style>
        {`
          .image-input-placeholder {
            background-image: url('assets/media/svg/files/blank-image.svg');
          }
          [data-bs-theme="dark"] .image-input-placeholder {
            background-image: url('assets/media/svg/files/blank-image-dark.svg');
          }
          /* Quill custom min-height if needed */
          .ql-editor {
            min-height: 100px;
          }
        `}
      </style>

      <form
        id="kt_ecommerce_add_category_form"
        className="form d-flex flex-column flex-lg-row"
        data-kt-redirect="apps/ecommerce/catalog/categories.html"
        onSubmit={handleSubmit}
      >
        {/* Aside column */}
        <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
          {/* Thumbnail settings */}
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Thumbnail</h2>
              </div>
            </div>
            <div className="card-body text-center pt-0">
              <div
                className={`image-input image-input-outline mb-3 ${
                  !thumbnailPreview
                    ? 'image-input-empty image-input-placeholder'
                    : ''
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
                {/* Change */}
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
              <div className="text-muted fs-7">
                Set the category thumbnail image. Only *.png, *.jpg and *.jpeg
                image files are accepted
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Status</h2>
              </div>
              <div className="card-toolbar">
                <div
                  className="rounded-circle bg-success w-15px h-15px"
                  id="kt_ecommerce_add_category_status"
                ></div>
              </div>
            </div>
            <div className="card-body pt-0">
              <Select
                id="kt_ecommerce_add_category_status_select"
                className="react-select-styled react-select-outlined mb-2"
                classNamePrefix="react-select"
                options={statusOptions}
                value={categoryStatus}
                onChange={(option) =>
                  setCategoryStatus(option as { value: string; label: string })
                }
                placeholder="Select a status..."
              />
              <div className="text-muted fs-7">Set the category status.</div>

              {/* If scheduling needed, add date-time fields here */}
            </div>
          </div>

          {/* Template settings */}
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Store Template</h2>
              </div>
            </div>
            <div className="card-body pt-0">
              <label
                htmlFor="kt_ecommerce_add_category_store_template"
                className="form-label"
              >
                Select a store template
              </label>
              <Select
                id="kt_ecommerce_add_category_store_template"
                className="react-select-styled react-select-outlined mb-2"
                classNamePrefix="react-select"
                options={templateOptions}
                value={storeTemplate}
                onChange={(option) =>
                  setStoreTemplate(option as { value: string; label: string })
                }
                placeholder="Select template..."
              />
              <div className="text-muted fs-7">
                Assign a template from your current theme to define how the
                category products are displayed.
              </div>
            </div>
          </div>
        </div>

        {/* Main column */}
        <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
          {/* General options */}
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>General</h2>
              </div>
            </div>
            <div className="card-body pt-0">
              {/* Category Name */}
              <div className="mb-10 fv-row">
                <label className="required form-label">Category Name</label>
                <input
                  type="text"
                  name="category_name"
                  className="form-control mb-2"
                  placeholder="Category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
                <div className="text-muted fs-7">
                  A category name is required and recommended to be unique.
                </div>
              </div>

              {/* Category Description (use ReactQuill) */}
              <div>
                <label className="form-label">Description</label>
                <ReactQuill
                  className="min-h-100px mb-2"
                  value={categoryDescription}
                  onChange={setCategoryDescription}
                  placeholder="Type the category description here..."
                />
                <div className="text-muted fs-7">
                  Set a description to the category for better visibility.
                </div>
              </div>
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
              {/* Meta Title */}
              <div className="mb-10">
                <label className="form-label">Meta Tag Title</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="meta_title"
                  placeholder="Meta tag title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <div className="text-muted fs-7">
                  Set a meta tag title. Recommended to be simple and precise
                  keywords.
                </div>
              </div>

              {/* Meta Description (ReactQuill) */}
              <div className="mb-10">
                <label className="form-label">Meta Tag Description</label>
                <ReactQuill
                  className="min-h-100px mb-2"
                  value={metaDescription}
                  onChange={setMetaDescription}
                  placeholder="Type meta description here..."
                />
                <div className="text-muted fs-7">
                  Set a meta tag description to the category for increased SEO
                  ranking.
                </div>
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="form-label">Meta Tag Keywords</label>
                <input
                  className="form-control mb-2"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="e.g. electronics, phone, mobile"
                />
                <div className="text-muted fs-7">
                  Set a list of keywords that the category is related to.
                  Separate the keywords by commas <code>,</code>.
                </div>
              </div>
            </div>
          </div>

          {/* Automation */}
          <div className="card card-flush py-4">
            <div className="card-header">
              <div className="card-title">
                <h2>Automation</h2>
              </div>
            </div>
            <div className="card-body pt-0">
              <label className="form-label mb-5">Product assignment method</label>
              {/* Manual */}
              <div className="d-flex fv-row mb-4">
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input me-3"
                    name="method"
                    type="radio"
                    value="0"
                    id="kt_ecommerce_add_category_automation_0"
                    checked={automationMethod === '0'}
                    onChange={(e) => setAutomationMethod(e.target.value)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="kt_ecommerce_add_category_automation_0"
                  >
                    <div className="fw-bold text-gray-800">Manual</div>
                    <div className="text-gray-600">
                      Add products to this category one by one by manually
                      selecting this category during product creation or update.
                    </div>
                  </label>
                </div>
              </div>
              <div className="separator separator-dashed my-5"></div>
              {/* Automatic */}
              <div className="d-flex fv-row">
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input me-3"
                    name="method"
                    type="radio"
                    value="1"
                    id="kt_ecommerce_add_category_automation_1"
                    checked={automationMethod === '1'}
                    onChange={(e) => setAutomationMethod(e.target.value)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="kt_ecommerce_add_category_automation_1"
                  >
                    <div className="fw-bold text-gray-800">Automatic</div>
                    <div className="text-gray-600">
                      Products matched with the following conditions will be
                      automatically assigned to this category.
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditions block (only show if method = '1') */}
              {automationMethod === '1' && (
                <div className="mt-10" data-kt-ecommerce-catalog-add-category="auto-options">
                  <label className="form-label">Conditions</label>

                  {/* "All / Any" condition example */}
                  <div className="d-flex flex-wrap align-items-center text-gray-600 gap-5 mb-7">
                    <span>Products must match:</span>
                    <div className="form-check form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="conditions_match"
                        value="all"
                        id="all_conditions"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="all_conditions">
                        All conditions
                      </label>
                    </div>
                    <div className="form-check form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="conditions_match"
                        value="any"
                        id="any_conditions"
                      />
                      <label className="form-check-label" htmlFor="any_conditions">
                        Any conditions
                      </label>
                    </div>
                  </div>

                  {/* Conditions repeater-like form */}
                  <div id="kt_ecommerce_add_category_conditions">
                    {/* For each condition in state */}
                    {conditions.map((condition) => (
                      <div
                        key={condition.id}
                        className="form-group d-flex flex-wrap align-items-center gap-5 mb-3"
                      >
                        {/* Condition Type */}
                        <Select
                          className="react-select-styled react-select-outlined w-200px"
                          classNamePrefix="react-select"
                          options={conditionTypeOptions}
                          value={condition.conditionType}
                          onChange={(opt) =>
                            handleConditionChange(condition.id, 'conditionType', opt)
                          }
                          placeholder="Select field..."
                        />

                        {/* Condition Equals */}
                        <Select
                          className="react-select-styled react-select-outlined w-200px"
                          classNamePrefix="react-select"
                          options={conditionEqualsOptions}
                          value={condition.conditionEquals}
                          onChange={(opt) =>
                            handleConditionChange(condition.id, 'conditionEquals', opt)
                          }
                          placeholder="Select condition..."
                        />

                        {/* Value */}
                        <input
                          type="text"
                          className="form-control w-200px"
                          placeholder="Value"
                          value={condition.conditionValue}
                          onChange={(e) =>
                            handleConditionChange(
                              condition.id,
                              'conditionValue',
                              e.target.value
                            )
                          }
                        />

                        {/* Remove button */}
                        <a
                          role="button"
                          onClick={() => handleRemoveCondition(condition.id)}
                          className="btn btn-sm btn-icon btn-light-danger"
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="ki-outline ki-cross fs-2"></i>
                        </a>
                      </div>
                    ))}

                    {/* Add condition button */}
                    <div className="form-group mt-5">
                      <a
                        role="button"
                        onClick={handleAddCondition}
                        className="btn btn-sm btn-light-primary"
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="ki-outline ki-plus fs-2"></i>
                        Add another condition
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hidden or unused Dropzone area, if you want to handle gallery images */}
          <div style={{ display: 'none' }} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop files here...</p> : null}
          </div>

          {/* Form actions */}
          <div className="d-flex justify-content-end">
            <a
              href="#"
              className="btn btn-light me-5"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              Cancel
            </a>
            <button
              type="submit"
              id="kt_ecommerce_add_category_submit"
              className="btn btn-primary"
            >
              <span className="indicator-label">Save Changes</span>
              <span className="indicator-progress">
                Please wait...
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export { CategoryAddPage };
