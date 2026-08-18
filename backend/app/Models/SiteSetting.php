<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'phone_display',
        'linkedin',
        'hero_subtitle',
        'hero_description',
        'about_heading',
        'about_subtitle',
        'about_paragraph_1',
        'about_paragraph_2',
    ];
}
