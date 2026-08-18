<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminTokenMiddleware
{
    public function handle(Request $request, Closure $next): JsonResponse
    {
        $token = config('admin.token');
        $bearer = $request->bearerToken();
        $header = $request->header('X-Admin-Token');

        if (! $token || (! $bearer && ! $header)) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        if (! hash_equals($token, $bearer ?: $header)) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return $next($request);
    }
}
