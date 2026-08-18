<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = SiteSetting::query()->first();

        if (! $settings) {
            $settings = SiteSetting::query()->create([
                'name' => env('APP_NAME', 'Nikenver Pulgar'),
                'email' => env('ADMIN_EMAIL', 'admin@portfolio.local'),
                'phone' => env('APP_PHONE', '+584120736425'),
                'phone_display' => env('APP_PHONE_DISPLAY', '(+58) 412-0736425'),
                'linkedin' => env('APP_LINKEDIN', 'https://linkedin.com/in/nikenver-pulgar'),
                'hero_subtitle' => 'Angular y Laravel en producción',
                'hero_description' => 'Más de 10 años construyendo aplicaciones web para empresas en Venezuela.',
                'about_heading' => 'Sobre mi',
                'about_subtitle' => 'Desarrollador Full Stack Angular y Laravel - Maracaibo, Venezuela',
                'about_paragraph_1' => 'Soy Nikenver Pulgar, Ingeniero de Sistemas egresado de la Universidad Dr. Jose Gregorio Hernandez en Maracaibo, Venezuela. Durante más de 10 años he desarrollado aplicaciones web full stack para empresas como Grupo Cobeca, C.A. Diario Panorama, Metro IT Service e Iconos Consultores, utilizando tecnologías como Angular, Laravel, React, Vue.js y PHP.',
                'about_paragraph_2' => 'Soy el fundador de Sublimax, una plataforma de e-commerce para la que construí desde cero el sistema de inventario y ventas. Mi especialización es el desarrollo front-end moderno con Angular y React, complementado con back-end sólido en Laravel y PHP.',
            ]);
        }

        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $settings = SiteSetting::query()->first();

        if (! $settings) {
            return response()->json(['message' => 'Settings not found.'], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'phone_display' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:1024'],
            'hero_subtitle' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string'],
            'about_heading' => ['nullable', 'string', 'max:255'],
            'about_subtitle' => ['nullable', 'string', 'max:255'],
            'about_paragraph_1' => ['nullable', 'string'],
            'about_paragraph_2' => ['nullable', 'string'],
        ]);

        $settings->update($validated);

        return response()->json($settings);
    }
}
