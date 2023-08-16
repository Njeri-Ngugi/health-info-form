<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Facility extends Model
{
    use HasFactory;
    protected $table = 'facilities';


    protected $fillable = [
        'FacilityName',
        'FacilityCity',
        'FacilityCounty',
        'FacilityState',
        'FacilityTelNo',
        'FacilityMedicalRec',
    ];

    public function Facility()
    {
        return $this->hasMany(User::class);
    }
}
