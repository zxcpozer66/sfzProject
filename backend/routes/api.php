<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ReactionTypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotationController;
use App\Http\Controllers\VacationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


// Route::apiResource('applications', ApplicationController::class);
// Route::apiResource('users', UserController::class);


Route::middleware(['windows.auth'])->group(function () {
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::put('/applications/{id}', [ApplicationController::class, 'update']);
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);

    Route::get('/reactions', [ReactionTypeController::class, 'index']);

    Route::get('/notations', [NotationController::class, 'index']);

    Route::get('/departments', [DepartmentController::class, 'index']);

    Route::get('/users/get-users', [UserController::class, 'getUsers']);
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/vacations/available/{user_id}', [VacationController::class, 'availableMinutes']);
    Route::get('/vacations/worked/{user_id}', [VacationController::class, 'workedMinutes']);
    Route::post('/vacations', [VacationController::class, 'store']);
    Route::put('/vacations/{vacationId}', [VacationController::class, 'update']);
    Route::get('/users/with-minutes', [VacationController::class, 'getUsersWithMinutes']);

      Route::get('/vacations/get-users-and-available-vacation-minutes', [VacationController::class, 'getUsersAndAvailableVacationMinutes']);
});
