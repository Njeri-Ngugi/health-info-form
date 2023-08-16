<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id_fk');
            $table->string('AddressName')->nullable();
            $table->string('AddressStreet');
            $table->string('AddressCity');
            $table->string('AddressCounty');
            $table->string('AddressState');
            $table->foreign('user_id_fk')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
