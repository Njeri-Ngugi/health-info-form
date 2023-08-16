<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Address extends Model
{
    use HasFactory;
    protected $table = 'addresses';

    protected $fillable = [
        'AddressName',
        'AddressStreet',
        'AddressCity',
        'AddressCounty',
        'AddressState',
    ];

    public function User()
    {
        return $this->hasMany(User::class);
    }
}
