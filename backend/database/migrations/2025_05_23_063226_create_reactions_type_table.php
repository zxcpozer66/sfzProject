<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reactions_type', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reactions_type');
    }
};