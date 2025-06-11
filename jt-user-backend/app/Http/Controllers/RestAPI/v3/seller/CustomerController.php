<?php

namespace App\Http\Controllers\RestAPI\v3\seller;

use App\Contracts\Repositories\DigitalProductVariationRepositoryInterface;
use App\Contracts\Repositories\PasswordResetRepositoryInterface;
use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Contracts\Repositories\StorageRepositoryInterface;
use App\Events\CustomerRegistrationEvent;
use App\Events\DigitalProductDownloadEvent;
use App\Http\Controllers\Controller;
use App\Models\BusinessSetting;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Services\PasswordResetService;
use App\Models\User;
use App\Utils\BackEndHelper;
use App\Utils\Helpers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    /**
     * @param PasswordResetRepositoryInterface $passwordResetRepo
     * @param DigitalProductVariationRepositoryInterface $digitalProductVariationRepo
     * @param ProductRepositoryInterface $productRepo
     * @param StorageRepositoryInterface $storageRepo
     * @param PasswordResetService $passwordResetService
     */

     
     public function __construct(
        private readonly PasswordResetRepositoryInterface           $passwordResetRepo,
        private readonly DigitalProductVariationRepositoryInterface $digitalProductVariationRepo,
        private readonly ProductRepositoryInterface                 $productRepo,
        private readonly StorageRepositoryInterface                 $storageRepo,
        private readonly PasswordResetService                       $passwordResetService,
    )
    {
    }

    /*
    public function customers(Request $request)
    {
        $seller = $request->seller;
        $limit = $request->has('limit') ? $request->limit : 10;
        $offset = $request->has('offset') ? $request->offset : 1;
        $search = $request->has('search') ? $request->search : '';
        
        $customerQuery = User::whereNotNull(['f_name']);
        
        if (!empty($search)) {
            $key = explode(' ', $search);
            $customerQuery->where(function($query) use ($key) {
                foreach ($key as $value) {
                    $query->orWhere('name', 'like', "%{$value}%")
                          ->orWhere('email', 'like', "%{$value}%");
                }
            });
        }
        
        $customerQuery->latest();
        
        $total = $customerQuery->count();
        
        $customers = $customerQuery
            ->paginate($limit, ['*'], 'page', $offset)
            ->items();
        
        $data = [
            'total' => $total,
            'search' => $search,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'customers' => $customers
        ];

        return response()->json($data, 200);
    }
    */

    public function customers(Request $request): JsonResponse
    {
        $seller = $request->seller;
        $limit = $request->has('limit') ? $request->limit : 10;
        $offset = $request->has('offset') ? $request->offset : 1;
        $search = $request->has('search') ? $request->search : '';
        
        // Query to get customers who have placed at least one order
        $customerQuery = User::whereNotNull(['f_name'])
            ->whereIn('id', function($query) use ($seller) {
                $query->select('customer_id')
                    ->from('orders')
                    ->distinct();
                
                // If seller is provided, filter orders by seller ID
                if ($seller) {
                    $query->where('seller_id', $seller->id);
                }
            });
        
        if (!empty($search)) {
            $key = explode(' ', $search);
            $customerQuery->where(function($query) use ($key) {
                foreach ($key as $value) {
                    $query->orWhere('f_name', 'like', "%{$value}%")
                          ->orWhere('l_name', 'like', "%{$value}%")
                          ->orWhere('email', 'like', "%{$value}%")
                          ->orWhere('phone', 'like', "%{$value}%");
                }
            });
        }
        
        $customerQuery->latest();
        
        $total = $customerQuery->count();
        
        $customers = $customerQuery
            ->paginate($limit, ['*'], 'page', $offset)
            ->items();
        
        $data = [
            'total' => $total,
            'search' => $search,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'customers' => $customers
        ];

        return response()->json($data, 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'f_name' => 'required',
            'l_name' => 'required',
            'email' => 'required|email|unique:users',
            'phone' => 'unique:users',
            'country' => 'required',
            'city' => 'required',
            'zip_code' => 'required',
            'address' => 'required',
        ], [
            'f_name.required' => 'First name is required!',
            'l_name.required' => 'Last name is required!'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }
        User::create([
            'f_name' => $request['f_name'],
            'l_name' => $request['l_name'],
            'email' => $request['email'],
            'phone' => $request['phone'],
            'country' => $request['country'],
            'city' => $request['city'],
            'zip' => $request['zip_code'],
            'street_address' => $request['address'],
            'is_active' => 1,
            'password' => bcrypt('password')
        ]);

        $token = Str::random(120);
        $this->passwordResetRepo->add($this->passwordResetService->getAddData(identity: getWebConfig('forgot_password_verification') == 'email' ? $request['email'] : $request['phone'], token: $token, userType: 'customer'));
        $resetRoute = getWebConfig('forgot_password_verification') == 'email' ? url('/') . '/customer/auth/reset-password?token=' . $token : route('customer.auth.recover-password');
        $data = [
            'userName' => $request['f_name'],
            'userType' => 'customer',
            'templateName' => 'registration-from-pos',
            'subject' => translate('Customer_Registration_Successfully_Completed'),
            'title' => translate('welcome_to') . ' ' . getWebConfig('company_name') . '!',
            'resetPassword' => $resetRoute,
            //'message' => translate('thank_you_for_joining') . ' ' . getWebConfig('company_name') . '.' . translate('if_you_want_to_become_a_registered_customer_then_reset_your_password_below_by_using_this_') . getWebConfig('forgot_password_verification') . ' ' . (getWebConfig('forgot_password_verification') == 'email' ? $request['email'] : $request['phone']) . '.' . translate('then_you'll_be_able_to_explore_the_website_and_app_as_a_registered_customer') . '.',
        ];
        event(new CustomerRegistrationEvent(email: $request['email'], data: $data));
        return response()->json(['message' => translate('customer added successfully!')], 200);
    }

    public function details(Request $request, $id): JsonResponse
    {
        $customer = User::find($id);
        if (!$customer) {
            return response()->json(['message' => 'Customer not found!'], 404);
        }
        return response()->json(['customer' => $customer], 200);
    }

    public function orders(Request $request, $id): JsonResponse
    {
        $seller = $request->seller;
        $limit = $request->has('limit') ? $request->limit : 10;
        $offset = $request->has('offset') ? $request->offset : 1;
        
        $orderQuery = Order::where('customer_id', $id)
                          ->where('seller_id', $seller->id)
                          ->latest();
        
        $total = $orderQuery->count();
        
        $orders = $orderQuery
            ->paginate($limit, ['*'], 'page', $offset)
            ->items();
        
        $data = [
            'total' => $total,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'orders' => $orders
        ];
        
        return response()->json($data, 200);
    }
}