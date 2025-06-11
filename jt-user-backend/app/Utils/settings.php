<?php

use App\Models\BusinessSetting; // Import the BusinessSetting model to interact with the business settings in the database.
use Illuminate\Support\Facades\Storage; // Import the Storage facade to handle file storage.

if (!function_exists('getWebConfig')) {

    /**
     * This function retrieves web configurations based on a given name.
     * If the configuration is session-based (stored in session), it fetches it from the session.
     * Otherwise, it retrieves the configuration from the `BusinessSetting` model.
     * It handles special cases for logo and banner images by fetching them from storage.
     *
     * @param string $name // The name of the configuration to retrieve.
     * @return string|object|array|null // Returns the configuration as a string, object, array, or null.
     */
    function getWebConfig($name): string|object|array|null
    {
        $config = null;
        $check = [
            'currency_model', 'currency_symbol_position', 'system_default_currency', 'language',
            'company_name', 'decimal_point_settings', 'product_brand', 'digital_product',
            'company_email', 'business_mode', 'storage_connection_type', 'company_web_logo'
        ]; // Predefined list of settings to check for in session.

        // If the config name is session-based and exists in the session, retrieve it from there.
        if (in_array($name, $check) == true && session()->has($name)) {
            $config = session($name);
        } else {
            // If not in the session, retrieve the setting from the database.
            $data = BusinessSetting::where(['type' => $name])->first();

            // If data exists, decode JSON if necessary or handle image-related settings.
            if (isset($data)) {
                $arrayOfCompaniesValue = ['company_web_logo', 'company_mobile_logo', 'company_footer_logo', 'company_fav_icon', 'loader_gif'];
                $arrayOfBanner = ['shop_banner', 'offer_banner', 'bottom_banner'];
                $mergeArray = array_merge($arrayOfCompaniesValue, $arrayOfBanner); // Merge lists for special handling.

                $config = json_decode($data['value'], true); // Decode the data as an associative array.

                // For certain settings (logos, banners), resolve the storage path using `storageLink`.
                if (in_array($name, $mergeArray)) {
                    $folderName = in_array($name, $arrayOfCompaniesValue) ? 'company' : 'shop'; // Determine folder based on the setting type.
                    $value = isset($config['image_name']) ? $config : ['image_name' => $data['value'], 'storage' => 'public'];
                    $config = storageLink($folderName, $value['image_name'], $value['storage']);
                }

                // If the config remains null after processing, assign the raw value.
                if (is_null($config)) {
                    $config = $data['value'];
                }
            }

            // Store the retrieved config in the session for faster access next time.
            if (in_array($name, $check) == true) {
                session()->put($name, $config);
            }
        }
        return $config; // Return the config value.
    }

    /**
     * Processes data related to storage, specifically for company-related images (logos, etc.).
     * Determines the appropriate storage path using `storageLink`.
     *
     * @param string $name // The name of the setting (e.g., company logo).
     * @param mixed $value // The value to process, could be a string or an array.
     * @return string|array // Returns the resolved storage path or the raw value.
     */
    function storageDataProcessing($name, $value)
    {
        $arrayOfCompaniesValue = ['company_web_logo', 'company_mobile_logo', 'company_footer_logo', 'company_fav_icon', 'loader_gif'];

        // If the setting name corresponds to a company-related image, process it accordingly.
        if (in_array($name, $arrayOfCompaniesValue)) {
            if (!is_array($value)) {
                return storageLink('company', $value, 'public'); // Get the storage link if it's a string.
            } else {
                return storageLink('company', $value['image_name'], $value['storage']); // Handle array case for images.
            }
        } else {
            return $value; // Return the raw value if it's not an image setting.
        }
    }

    /**
     * Processes the path for an image based on the given data and path.
     * Converts the image data to a string or array and constructs the storage link.
     *
     * @param mixed $imageData // The image data (can be a string or array).
     * @param string $path // The folder path where the image is stored.
     * @return string|null // Returns the storage link or null if no image data is provided.
     */
    function imagePathProcessing($imageData, $path)
    {
        if ($imageData) {
            // Convert image data to array if necessary.
            $imageData = is_string($imageData) ? $imageData : (array)$imageData;
            $imageArray = [
                'image_name' => is_array($imageData) ? $imageData['image_name'] : $imageData,
                'storage' => $imageData['storage'] ?? 'public',
            ];

            // Generate and return the storage link.
            return storageLink($path, $imageArray['image_name'], $imageArray['storage']);
        }
        return null;
    }

    /**
     * Constructs the storage link for a file.
     * Supports both local and S3 (Amazon Web Services) storage.
     *
     * @param string $path // The path to the file.
     * @param string $data // The file name.
     * @param string $type // The type of storage (e.g., 's3' or 'public').
     * @return string|array // Returns an array with the file's key, path, and status.
     */
    function storageLink($path, $data, $type): string|array
    {
        // Check if the file is stored on S3.
        if ($type == 's3' && config('filesystems.disks.default') == 's3') {
            $fullPath = ltrim($path . '/' . $data, '/');
            if (fileCheck(disk: 's3', path: $fullPath) && !empty($data)) {
                return [
                    'key' => $data,
                    'path' => Storage::disk('s3')->url($fullPath), // Return the URL for the S3 file.
                    'status' => 200,
                ];
            }
        } else {
            // Check if the file is stored locally (public storage).
            if (fileCheck(disk: 'public', path: $path . '/' . $data) && !empty($data)) {
                $resultPath = asset('storage/app/public/' . $path . '/' . $data);
                // Adjust the path if the domain is pointing to the 'public' directory.
                if (DOMAIN_POINTED_DIRECTORY == 'public') {
                    $resultPath = asset('storage/' . $path . '/' . $data);
                }
                return [
                    'key' => $data,
                    'path' => $resultPath,
                    'status' => 200,
                ];
            }
        }

        // If the file is not found, return a 404 status.
        return [
            'key' => $data,
            'path' => null,
            'status' => 404,
        ];
    }

    /**
     * Generates the storage link for a gallery image.
     * Supports both S3 and local storage.
     *
     * @param string $path // The path to the gallery image.
     * @param string $type // The type of storage (e.g., 's3' or 'public').
     * @return string|null // Returns the storage URL or null if the file doesn't exist.
     */
    function storageLinkForGallery($path, $type): string|null
    {
        // Check if the gallery image is stored on S3.
        if ($type == 's3' && config('filesystems.disks.default') == 's3') {
            $fullPath = ltrim($path, '/');
            if (fileCheck(disk: 's3', path: $fullPath)) {
                return Storage::disk('s3')->url($fullPath); // Return the S3 URL.
            }
        } else {
            // Check if the gallery image is stored locally.
            if (fileCheck(disk: 'public', path: $path)) {
                return asset('storage/app/public') . '/' . $path; // Return the local URL.
            }
        }
        return null;
    }

    /**
     * Checks if a file exists on a given disk (S3 or public).
     *
     * @param string $disk // The disk type (e.g., 's3' or 'public').
     * @param string $path // The file path to check.
     * @return bool // Returns true if the file exists, false otherwise.
     */
    function fileCheck($disk, $path): bool
    {
        return Storage::disk($disk)->exists($path); // Check if the file exists on the specified disk.
    }
}
