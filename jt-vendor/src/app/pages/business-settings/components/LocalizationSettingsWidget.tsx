import React, { useState } from 'react';
import Select from 'react-select';
// ---------------------------------------------------
// 3) LOCALIZATION SETTINGS WIDGET
// ---------------------------------------------------

export function LocalizationSettingsWidget() {
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');
    const [currency, setCurrency] = useState('');
    const [lengthClass, setLengthClass] = useState('cm');
    const [weightClass, setWeightClass] = useState('kg');
  
    // Example: If you want to put react-select for country, you'd transform the <option> list into an array of { value, label }.
    // Because there are many <option>s, consider a big array of objects or some lazy approach.
    // Below, we'll just show a short snippet as an example. You could expand it or move it to an external file.
    const countryOptions = [
      { value: '', label: '' },
      { value: 'AF', label: 'Afghanistan' },
      { value: 'AL', label: 'Albania' },
      // ... and so on for all countries
      { value: 'US', label: 'United States' },
      { value: 'GB', label: 'United Kingdom' },
    ];
  
    const languageOptions = [
      { value: '', label: '' },
      { value: 'id', label: 'Bahasa Indonesia - Indonesian' },
      { value: 'msa', label: 'Bahasa Melayu - Malay' },
      { value: 'en', label: 'English' },
      // ... etc.
    ];
  
    const currencyOptions = [
      { value: '', label: '' },
      { value: 'USD', label: 'US Dollar' },
      { value: 'Euro', label: 'Euro' },
      { value: 'Pound', label: 'Pound' },
      { value: 'AUD', label: 'Australian Dollar' },
      { value: 'JPY', label: 'Japanese Yen' },
      { value: 'KRW', label: 'Korean Won' },
    ];
  
    // Similar for lengthClass, weightClass (these are simpler, so you can do a react-select or just keep them as is).
    const lengthOptions = [
      { value: '', label: '' },
      { value: 'cm', label: 'Centimeter' },
      { value: 'mm', label: 'Milimeter' },
      { value: 'in', label: 'Inch' },
    ];
  
    const weightOptions = [
      { value: '', label: '' },
      { value: 'kg', label: 'Kilogram' },
      { value: 'g', label: 'Gram' },
      { value: 'lb', label: 'Pound' },
      { value: 'oz', label: 'Ounce' },
    ];
  
    const handleLocalizationSubmit = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
     
    };
  
    const handleCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
    };
  
    return (
      <div className="tab-pane fade" id="kt_ecommerce_settings_localization" role="tabpanel">
        <form
          id="kt_ecommerce_settings_general_localization"
          className="form"
          action="#"
        >
          <div className="row mb-7">
            <div className="col-md-9 offset-md-3">
              <h2>Localization Settings</h2>
            </div>
          </div>
  
          {/* Country */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Country</span>
              </label>
            </div>
            <div className="col-md-9">
              <Select
                className="react-select-styled react-select-solid"
                classNamePrefix="react-select"
                name="localization_country"
                placeholder="Select a country"
                options={countryOptions}
                value={countryOptions.find((opt) => opt.value === country)}
                onChange={(opt) => setCountry(opt ? opt.value : '')}
              />
            </div>
          </div>
  
          {/* Language */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Language</span>
              </label>
            </div>
            <div className="col-md-9">
              <Select
                className="react-select-styled react-select-solid"
                classNamePrefix="react-select"
                name="localization_language"
                placeholder="Select a language"
                options={languageOptions}
                value={languageOptions.find((opt) => opt.value === language)}
                onChange={(opt) => setLanguage(opt ? opt.value : '')}
              />
            </div>
          </div>
  
          {/* Currency */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span className="required">Currency</span>
              </label>
            </div>
            <div className="col-md-9">
              <Select
                className="react-select-styled react-select-solid"
                classNamePrefix="react-select"
                name="localization_currency"
                placeholder="Select a currency"
                options={currencyOptions}
                value={currencyOptions.find((opt) => opt.value === currency)}
                onChange={(opt) => setCurrency(opt ? opt.value : '')}
              />
            </div>
          </div>
  
          {/* Length Class */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Length Class</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Set the unit measurement for length.">
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <Select
                className="react-select-styled react-select-solid"
                classNamePrefix="react-select"
                placeholder="Select a length class"
                options={lengthOptions}
                value={lengthOptions.find((opt) => opt.value === lengthClass)}
                onChange={(opt) => setLengthClass(opt ? opt.value : '')}
              />
            </div>
          </div>
  
          {/* Weight Class */}
          <div className="row fv-row mb-7">
            <div className="col-md-3 text-md-end">
              <label className="fs-6 fw-semibold form-label mt-3">
                <span>Weight Class</span>
                <span className="ms-1" data-bs-toggle="tooltip" title="Set the unit measurement for weight.">
                  <i className="ki-duotone ki-information-5 text-gray-500 fs-6">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>
              </label>
            </div>
            <div className="col-md-9">
              <Select
                className="react-select-styled react-select-solid"
                classNamePrefix="react-select"
                placeholder="Select a weight class"
                options={weightOptions}
                value={weightOptions.find((opt) => opt.value === weightClass)}
                onChange={(opt) => setWeightClass(opt ? opt.value : '')}
              />
            </div>
          </div>
  
          {/* Action buttons */}
          <div className="row py-5">
            <div className="col-md-9 offset-md-3">
              <div className="d-flex">
                <a
                  href="#"
                  data-kt-ecommerce-settings-type="cancel"
                  className="btn btn-light me-3"
                  onClick={handleCancel}
                >
                  Cancel
                </a>
                <a
                  href="#"
                  data-kt-ecommerce-settings-type="submit"
                  className="btn btn-primary"
                  onClick={handleLocalizationSubmit}
                >
                  <span className="indicator-label">Save</span>
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }