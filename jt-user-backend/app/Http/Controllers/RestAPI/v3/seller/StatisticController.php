<?php

namespace App\Http\Controllers\RestAPI\v3\seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\User;
use App\Models\Shop;
use App\Models\Review;
use App\Models\ShippingType;
use App\Traits\CommonTrait;
use App\Utils\BackEndHelper;
use App\Utils\Convert;
use App\Utils\Helpers;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StatisticController extends Controller
{
    use CommonTrait;

    /**
     * Get sales chart data for the specified months
     */
    public function salesChartData(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'months' => 'nullable|array',
            'months.*' => 'integer|min:1|max:12',
            'year' => 'nullable|integer',
            'type' => 'nullable|string|in:sales,customers,orders,products'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $year = $request->year ?? date('Y');
        $type = $request->type ?? 'sales';
        $months = $request->months ?? range(1, 12);
        sort($months);

        $monthsData = [];
        $monthNames = [];
        
        foreach ($months as $month) {
            $monthNames[] = date('F', mktime(0, 0, 0, $month, 10));
            
            switch ($type) {
                case 'sales':
                    $amount = Order::where('seller_id', $seller['id'])
                        ->whereYear('created_at', $year)
                        ->whereMonth('created_at', $month)
                        ->where('order_status', 'delivered')
                        ->where('payment_status', 'paid')
                        ->sum('order_amount');
                    $monthsData[] = (float)$amount;
                    break;
                
                case 'customers':
                    $count = Order::where('seller_id', $seller['id'])
                        ->whereYear('created_at', $year)
                        ->whereMonth('created_at', $month)
                        ->distinct('customer_id')
                        ->count('customer_id');
                    $monthsData[] = (int)$count;
                    break;
                
                case 'orders':
                    $count = Order::where('seller_id', $seller['id'])
                        ->whereYear('created_at', $year)
                        ->whereMonth('created_at', $month)
                        ->count();
                    $monthsData[] = (int)$count;
                    break;
                
                case 'products':
                    $count = OrderDetail::whereHas('order', function($query) use ($seller, $year, $month) {
                        $query->where('seller_id', $seller['id'])
                            ->whereYear('created_at', $year)
                            ->whereMonth('created_at', $month);
                    })->sum('qty');
                    $monthsData[] = (int)$count;
                    break;
            }
        }

        return response()->json([
            'months' => $months,
            'month_names' => $monthNames,
            'data' => $monthsData
        ], 200);
    }

    /**
     * Get list of customer orders with pagination
     */
    public function customerOrdersList(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'nullable|integer',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $customer_id = $request->customer_id;
        $limit = $request->limit ?? 10;
        $offset = $request->offset ?? 1;

        $query = DB::table('users')
            ->select(
                'users.id',
                'users.f_name',
                'users.l_name',
                'users.email',
                'users.phone',
                'users.is_active',
                'users.created_at as date_joined',
                DB::raw('COUNT(DISTINCT orders.id) as no_orders'),
                DB::raw('SUM(order_details.qty) as no_products'),
                DB::raw('SUM(orders.order_amount) as total')
            )
            ->join('orders', 'users.id', '=', 'orders.customer_id')
            ->join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->where('orders.seller_id', $seller['id'])
            ->where('orders.seller_is', 'seller')
            ->groupBy('users.id', 'users.f_name', 'users.l_name', 'users.email', 'users.phone', 'users.is_active', 'users.created_at');

        if ($customer_id) {
            $query->where('users.id', $customer_id);
        }

        $total = $query->get()->count();
        $customers = $query->skip(($offset - 1) * $limit)->take($limit)->get();

        $formattedCustomers = $customers->map(function($customer) {
            return [
                'customer_name' => $customer->f_name . ' ' . $customer->l_name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'status' => $customer->is_active ? 'Active' : 'Inactive',
                'date_joined' => Carbon::parse($customer->date_joined)->format('Y-m-d H:i:s'),
                'no_orders' => (int)$customer->no_orders,
                'no_products' => (int)$customer->no_products,
                'total' => Convert::default((float)$customer->total)
            ];
        });

        return response()->json([
            'total_size' => $total,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'customers' => $formattedCustomers
        ], 200);
    }

    /**
     * Get orders per day within date range
     */
    public function ordersPerDay(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'required|date',
            'to_date' => 'required|date',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $from_date = $request->from_date;
        $to_date = $request->to_date;
        $limit = $request->limit ?? 10;
        $offset = $request->offset ?? 1;

        $query = DB::table('orders')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(id) as no_orders'),
                DB::raw('(
                    SELECT SUM(qty) FROM order_details 
                    WHERE order_details.order_id IN (
                        SELECT id FROM orders o 
                        WHERE o.seller_id = orders.seller_id 
                        AND DATE(o.created_at) = DATE(orders.created_at)
                    )
                ) as products_sold'),
                DB::raw('(
                    SELECT SUM(tax) FROM order_details 
                    WHERE order_details.order_id IN (
                        SELECT id FROM orders o 
                        WHERE o.seller_id = orders.seller_id 
                        AND DATE(o.created_at) = DATE(orders.created_at)
                    )
                ) as tax'),
                DB::raw('SUM(order_amount) as total')
            )
            ->where('seller_id', $seller['id'])
            ->where('seller_is', 'seller')
            ->whereDate('created_at', '>=', $from_date)
            ->whereDate('created_at', '<=', $to_date)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'desc');

        $total = $query->get()->count();
        $orders = $query->skip(($offset - 1) * $limit)->take($limit)->get();

        $formattedOrders = $orders->map(function($order) {
            return [
                'date' => Carbon::parse($order->date)->format('Y-m-d'),
                'no_orders' => (int)$order->no_orders,
                'products_sold' => (int)$order->products_sold,
                'tax' => Convert::default((float)$order->tax),
                'total' => Convert::default((float)$order->total)
            ];
        });

        return response()->json([
            'total_size' => $total,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'orders' => $formattedOrders
        ], 200);
    }

    /**
     * Get shipping cost by shipping method
     */
    public function shippingCostByMethod(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'shipping_method_id' => 'nullable|string',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $shipping_method_id = $request->shipping_method_id;
        $limit = $request->limit ?? 10;
        $offset = $request->offset ?? 1;

        $query = DB::table('orders')
            ->select(
                DB::raw('DATE(created_at) as date'),
                'delivery_service_name as shipping_type',
                DB::raw('CONCAT("SHP-", id) as shipping_id'),
                'order_status as status',
                DB::raw('COUNT(id) as no_orders'),
                'shipping_cost as total'
            )
            ->where('seller_id', $seller['id'])
            ->where('seller_is', 'seller')
            ->where('delivery_type', 'third_party_delivery')
            ->whereNotNull('delivery_service_name')
            ->orderBy('date', 'desc');

        if ($shipping_method_id) {
            $query->where('delivery_service_name', $shipping_method_id);
        }

        $total = $query->count();
        $shipping = $query->skip(($offset - 1) * $limit)->take($limit)->get();

        $formattedShipping = $shipping->map(function($ship) {
            return [
                'date' => Carbon::parse($ship->date)->format('Y-m-d'),
                'shipping_type' => $ship->shipping_type,
                'shipping_id' => $ship->shipping_id,
                'status' => ucfirst($ship->status),
                'no_orders' => (int)$ship->no_orders,
                'total' => Convert::default((float)$ship->total)
            ];
        });

        return response()->json([
            'total_size' => $total,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'shipping' => $formattedShipping
        ], 200);
    }

    /**
     * Get return order stats per day within date range
     */
    public function returnOrdersPerDay(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'from_date' => 'required|date',
            'to_date' => 'required|date',
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $from_date = $request->from_date;
        $to_date = $request->to_date;
        $limit = $request->limit ?? 10;
        $offset = $request->offset ?? 1;

        $query = DB::table('orders')
            ->select(
                DB::raw('DATE(updated_at) as date'),
                DB::raw('COUNT(CASE WHEN order_status = "returned" THEN 1 END) as orders_returned'),
                DB::raw('COUNT(CASE WHEN order_status = "refunded" THEN 1 END) as orders_refunded'),
                DB::raw('COUNT(CASE WHEN order_status = "replaced" THEN 1 END) as orders_replaced'),
                DB::raw('SUM(CASE WHEN order_status = "refunded" THEN order_amount ELSE 0 END) as total_refunded'),
                DB::raw('SUM(CASE WHEN order_status = "replaced" THEN order_amount ELSE 0 END) as total_replaced')
            )
            ->where('seller_id', $seller['id'])
            ->where('seller_is', 'seller')
            ->whereIn('order_status', ['returned', 'refunded', 'replaced'])
            ->whereDate('updated_at', '>=', $from_date)
            ->whereDate('updated_at', '<=', $to_date)
            ->groupBy(DB::raw('DATE(updated_at)'))
            ->orderBy('date', 'desc');

        $total = $query->get()->count();
        $returns = $query->skip(($offset - 1) * $limit)->take($limit)->get();

        $formattedReturns = $returns->map(function($return) {
            return [
                'date' => Carbon::parse($return->date)->format('Y-m-d'),
                'orders_returned' => (int)$return->orders_returned,
                'orders_refunded' => (int)$return->orders_refunded,
                'orders_replaced' => (int)$return->orders_replaced, 
                'total_refunded' => Convert::default((float)$return->total_refunded),
                'total_replaced' => Convert::default((float)$return->total_replaced)
            ];
        });

        return response()->json([
            'total_size' => $total,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'returns' => $formattedReturns
        ], 200);
    }

    /**
     * Get product performance statistics
     */
    public function productPerformance(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'limit' => 'nullable|integer',
            'offset' => 'nullable|integer',
            'sort_by' => 'nullable|string|in:most_sold,highest_rating,most_revenue',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => Helpers::error_processor($validator)], 403);
        }

        $seller = $request->seller;
        $limit = $request->limit ?? 10;
        $offset = $request->offset ?? 1;
        $sort_by = $request->sort_by ?? 'most_sold';

        $products = Product::where('user_id', $seller['id'])
            ->where('added_by', 'seller')
            ->with(['reviews'])
            ->withCount(['reviews', 'orderDetails as times_sold' => function($query) {
                $query->whereHas('order', function($q) {
                    $q->where('order_status', 'delivered');
                });
            }])
            ->withSum(['orderDetails as total_revenue' => function($query) {
                $query->whereHas('order', function($q) {
                    $q->where('order_status', 'delivered');
                });
            }], 'price');

        if ($sort_by == 'most_sold') {
            $products->orderBy('times_sold', 'desc');
        } elseif ($sort_by == 'highest_rating') {
            $products->orderBy(DB::raw('IFNULL((SELECT AVG(rating) FROM reviews WHERE product_id = products.id), 0)'), 'desc');
        } elseif ($sort_by == 'most_revenue') {
            $products->orderBy('total_revenue', 'desc');
        }

        $total = $products->count();
        $productList = $products->skip(($offset - 1) * $limit)->take($limit)->get();

        $productList = $productList->map(function($product) {
            $avgRating = $product->reviews->avg('rating') ?? 0;
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $product->thumbnail,
                'thumbnail_full_url' => $product->getThumbnailFullUrlAttribute(),
                'rating' => round($avgRating, 1),
                'rating_count' => $product->reviews_count,
                'times_sold' => $product->times_sold,
                'total_revenue' => Convert::default($product->total_revenue ?? 0),
                'price' => Convert::default($product->unit_price),
            ];
        });

        return response()->json([
            'total_size' => $total,
            'limit' => (int)$limit,
            'offset' => (int)$offset,
            'products' => $productList
        ], 200);
    }
} 