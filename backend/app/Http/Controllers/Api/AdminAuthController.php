<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = config('admin.email');
        $password = config('admin.password');

        if ($request->input('email') !== $email || $request->input('password') !== $password) {
            return response()->json([
                'message' => 'Credenciales inválidas.',
            ], 401);
        }

        return response()->json([
            'token' => config('admin.token'),
            'message' => 'Inicio de sesión correcto.',
        ]);
    }
}
