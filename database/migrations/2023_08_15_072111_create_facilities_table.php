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
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id_fk');
            $table->string('FacilityName', 100)->nullable();
            $table->string('FacilityCity', 100)->nullable();
            $table->string('FacilityCounty', 100)->nullable();
            $table->string('FacilityState', 100)->nullable();
            $table->string('FacilityTelNo', 12)->nullable();
            $table->string('FacilityMedicalRec', 30)->nullable();
            $table->foreign('user_id_fk')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
