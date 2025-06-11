<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UpdateController extends Controller
{
    /**
     * Redirect to home page.
     *
     * @return RedirectResponse
     */
    public function index(): RedirectResponse
    {
        return redirect('/');
    }

    /**
     * Redirect to home page.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function updateSoftware(Request $request): RedirectResponse
    {
        return redirect('/');
    }
} 