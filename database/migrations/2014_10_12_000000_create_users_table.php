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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('Firstname', 50);
            $table->string('MiddleInit', 1);
            $table->string('Lastname', 50);
            $table->string('Gender', 6);
            $table->integer('Age');
            $table->string('AgeUnits', 9);
            $table->date('DOB');
            $table->string('Race', 50);
            $table->string('OtherDescription', 100)->nullable();
            $table->string('Hispanic', 7);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
