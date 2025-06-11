<?php

namespace App\Http\Controllers\Payment_Methods;

use App\Models\PaymentRequest;
use App\Models\User;
use App\Models\Transaction;
use App\Traits\Processor;
use App\Services\PayWayService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;


class AbaPayController extends Controller
{
    use Processor;

    private PaymentRequest $paymentRequest;
    private $config;
    private $user;
    private $trans_id;
    private $hash;
    protected $payWayService;

    public function __construct(PayWayService $payWayService, PaymentRequest $paymentRequest, User $user)
    {
        $config = $this->payment_config('abapay', 'payment_config');

        if (!is_null($config)) {
            if ($config->mode == 'live') {
                $this->config = json_decode($config->live_values);
            } elseif ($config->mode == 'test') {
                $this->config = json_decode($config->test_values);
            }


            $this->paymentRequest = $paymentRequest;
            $this->user = $user;
        }


    }
    function getReturnDeepLink() {
        $deeplink = [
            "android_scheme" => "https://justtenh.com/",
            "ios_scheme" => "https://justtenh.com/"
        ];

        // Encode the deeplink array as JSON
        $jsonEncodedDeeplink = json_encode($deeplink);

        // Base64 encode the JSON string
        $base64EncodedDeeplink = base64_encode($jsonEncodedDeeplink);

        return $base64EncodedDeeplink;
    }

    function generatePaymentData($req_time,$config, $data, $request) {
        $payerInformation = json_decode($data->payer_information, true);

        $merchant_id = $config->merchant_id;
        $apikey = $config->api_key;
        $apiurl = $config->api_url;
        $tran_id = $req_time;
        $amount = $data->payment_amount;
        $firstname = $payerInformation['name'];
        $email = $payerInformation['email'];
        $phone = $payerInformation['phone'];
        $type = 'purchase';
        $payment_option = $request->ajax() ? $config->payment_option : 'abapay_khqr_deeplink';
        $return_url = base64_encode(url("payment/abapay/postsuccess"));
        $cancel_url = ''; // Example: url("payment/abapay/cancel/?payment_id={$data->id}");
        $continue_success_url = url("payment/abapay/success/?payment_id={$data->id}&trans_id={$req_time}");
        $return_deeplink = $this->getReturnDeepLink(); // Ensure this function exists and is accessible
        //$currency = 'USD';

        $hashdata = $req_time . $merchant_id . $tran_id . $amount . $firstname . $email . $phone . $type . $payment_option . $return_url . $cancel_url . $continue_success_url . $return_deeplink ;
        $hash = base64_encode(hash_hmac('sha512', $hashdata, $apikey, true));

        return [
            'trans_id' => $req_time,
            'merchant_id' =>$merchant_id,
            'hash' => $hash,
            'amount' => $amount,
            'firstname' => $firstname,
            'email' => $email,
            'phone' => $phone,
            'type' => $type,
            'payment_option' => $payment_option,
            'return_url' => $return_url,
            'cancel_url' => $cancel_url,
            'continue_success_url' => $continue_success_url,
            'return_deeplink' => $return_deeplink,
            //'currency' => $currency,
            'api_url' => $apiurl
        ];
    }




public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|uuid'
        ]);

        if ($validator->fails()) {
            return response()->json($this->response_formatter(GATEWAYS_DEFAULT_400, null, $this->error_processor($validator)), 400);
        }

        $data = $this->paymentRequest::where(['id' => $request['payment_id']])->where(['is_paid' => 0])->first();
        if (!isset($data)) {
            return response()->json($this->response_formatter(GATEWAYS_DEFAULT_204), 200);
        }

        $config = $this->config;
        $req_time = Carbon::now()->format('YmdHis');

        // Use the generatePaymentData function to generate payment-related data
        $paymentData = $this->generatePaymentData($req_time,$config, $data, $request);


        // Assign values to necessary properties or use them directly
        $this->trans_id = $paymentData['trans_id'];
        $this->hash = $paymentData['hash'];

        $apiurl = $config->api_url;
        $merchant_id = $config->merchant_id;


        if ($request->ajax()) {
            return response()->json([
                'req_time' => $paymentData['trans_id'], // Equivalent to $req_time
                'merchant_id' => $paymentData['merchant_id'],
                'tran_id' => $paymentData['trans_id'], // Equivalent to $tran_id
                'amount' => $paymentData['amount'],
                'firstname' => $paymentData['firstname'],
                'email' => $paymentData['email'],
                'phone' => $paymentData['phone'],
                'type' => $paymentData['type'],
                'payment_option' => $paymentData['payment_option'],
                'return_url' => $paymentData['return_url'],
                'cancel_url' => $paymentData['cancel_url'],
                'continue_success_url' => $paymentData['continue_success_url'],
                'return_deeplink' => $paymentData['return_deeplink'],
                //'currency' => $paymentData['currency'],
                'hash' => $paymentData['hash'],
                'apiurl' => $paymentData['api_url']
            ]);
        }
        $paymentData1 = $this->generatePaymentData($req_time+1, $config, $data, $request);
    $postdata = [
            'req_time' => $paymentData['trans_id'], // Equivalent to $req_time
            'merchant_id' => $paymentData['merchant_id'],
            'tran_id' => $paymentData['trans_id'], // Equivalent to $tran_id
            'amount' => $paymentData['amount'],
            'firstname' => $paymentData['firstname'],
            'email' => $paymentData['email'],
            'phone' => $paymentData['phone'],
            'type' => $paymentData['type'],
            'payment_option' => $paymentData['payment_option'],
            'return_url' => $paymentData['return_url'],
            'cancel_url' => $paymentData['cancel_url'],
            'continue_success_url' => $paymentData['continue_success_url'],
            'return_deeplink' => $paymentData['return_deeplink'],
            //'currency' => $paymentData['currency'],
            'hash' => $paymentData['hash'],
            'apiurl' => $paymentData['api_url']
        ];
        $postdata1 = [
            'req_time' => $paymentData1['trans_id'], // Equivalent to $req_time
            'merchant_id' => $paymentData1['merchant_id'],
            'tran_id' => $paymentData1['trans_id'], // Equivalent to $tran_id
            'amount' => $paymentData1['amount'],
            'firstname' => $paymentData1['firstname'],
            'email' => $paymentData1['email'],
            'phone' => $paymentData1['phone'],
            'type' => $paymentData1['type'],
            'payment_option' => $paymentData1['payment_option'],
            'return_url' => $paymentData1['return_url'],
            'cancel_url' => $paymentData1['cancel_url'],
            'continue_success_url' => $paymentData1['continue_success_url'],
            'return_deeplink' => $paymentData1['return_deeplink'],
            //'currency' => $paymentData1['currency'],
            'hash' => $paymentData1['hash'],
            'apiurl' => $paymentData1['api_url']
        ];

        Log::error('Response', [
            'Data' => $postdata,
            //'Data1' => $postdata1
        ]);

        // Post the data to the API URL

        $response = Http::post($apiurl, $postdata);
        //$response1 = Http::post($apiurl, $postdata1);

        // Handle the API response
        if ($response->successful() ) {
            $responseBody = $response->json();
            //$responseBody1 = $response1->json();

            $checkoutQrUrl = isset($responseBody['checkout_qr_url']) ? $responseBody['checkout_qr_url'] : null;
            //$checkoutQrUrl1 = isset($responseBody1['checkout_qr_url']) ? $responseBody1['checkout_qr_url'] : null;


            if ($checkoutQrUrl ) {
                Log::error('Response', [
                    'responseBody' => $responseBody,
                    //'responseBody1' => $responseBody1
                ]);
                //$responseBody['checkout_qr_url'] = $checkoutQrUrl1;
                Log::error('Response', [
                    'responseBody After change: ' => $responseBody,
                ]);
                // Return both QR URLs in the JSON response
                return response() -> json($responseBody,200);
            } else {
                return response()->json(['error' => 'QR URL(s) not found in the response'], 500);
            }
        } else {
            // Handle failed responses
            return response()->json(['error' => 'Failed to post data to payment gateway'], 500);
        }
    }





    public function postsuccess(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Transaction completed successfully',
        ], 200);
    }

    public function success(Request $request): JsonResponse|Redirector|RedirectResponse|Application
    {
        $req_time = Carbon::now()->format('YmdHis');
        $checkUrl = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction-2';
        $merchant_id = $this->config->merchant_id;
        $apikey = $this->config->api_key;
        $tran_id = $request['trans_id'];

        $dataToHash = $req_time . $merchant_id . $tran_id;

        $data = $this->paymentRequest::where(['id' => $request['payment_id']])->first();
        $hash = base64_encode(hash_hmac('sha512', $dataToHash, $apikey, true));;



        $response = Http::post($checkUrl, [
            'req_time' => $req_time,
            'merchant_id' => $merchant_id,
            'tran_id' => $tran_id,
            'hash' => $hash
        ]);

        $responseData = $response->json();


        if ($response->successful()) {

            // Check if the transaction status is successful (code 00)
            if (isset($responseData['status']['code']) && $responseData['status']['code'] == '00') {


                Log::info('Aba payment Successful!');
                $this->paymentRequest::where(['id' => $request['payment_id']])->update([
                    'payment_method' => 'abapay',
                    'is_paid' => 1,
                    'transaction_id' => $request['payment_id'],
                    'additional_data->order_note' => $this->trans_id
                ]);
                $data = $this->paymentRequest::where(['id' => $request['payment_id']])->first();

                if (isset($data) && function_exists($data->success_hook)) {
                    call_user_func($data->success_hook, $data);
                    return $this->payment_response($data, 'success');
                }
            }
        }


        if (isset($data) && function_exists($data->failure_hook)) {
            call_user_func($data->failure_hook, $data);
        }
        return $this->payment_response($data, 'fail');

    }

    public function failed(Request $request): JsonResponse|Redirector|RedirectResponse|Application
    {
        $payment_data = $this->paymentRequest::where(['id' => $request['payment_id']])->first();
        if (isset($payment_data) && function_exists($payment_data->failure_hook)) {
            call_user_func($payment_data->failure_hook, $payment_data);
        }
        return $this->payment_response($payment_data, 'fail');
    }

    public function cancel(Request $request): JsonResponse|Redirector|RedirectResponse|Application
    {
        $payment_data = $this->paymentRequest::where(['id' => $request['payment_id']])->first();
        if (isset($payment_data) && function_exists($payment_data->failure_hook)) {
            call_user_func($payment_data->failure_hook, $payment_data);
        }
        return $this->payment_response($payment_data, 'cancel');
    }

}
