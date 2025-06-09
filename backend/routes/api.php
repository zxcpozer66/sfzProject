<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ReactionTypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotationController;
use App\Http\Controllers\VacationController;


Route::middleware(['windows.auth'])->group(function () {
  Route::get('/applications', [ApplicationController::class, 'index']);
  Route::post('/applications', [ApplicationController::class, 'store']);
  Route::patch('/applications/{id}', [ApplicationController::class, 'update']);
  Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);

  Route::get('/reactions', [ReactionTypeController::class, 'index']);

  Route::get('/notations', [NotationController::class, 'index']);

  Route::get('/departments', [DepartmentController::class, 'index']);

  Route::get('/users/get-users', [UserController::class, 'getUsers']);
  Route::get('/users', [UserController::class, 'index']);
  Route::get('/users/vacation-interval', [UserController::class, 'getVacationInterval']);
  Route::post('/users', [UserController::class, 'store']);
  Route::put('/users/{id}', [UserController::class, 'update']);
  Route::delete('/users/{id}', [UserController::class, 'destroy']);

  Route::get('/vacations', [VacationController::class, 'index']);
  Route::post('/vacations', [VacationController::class, 'store']);
  Route::patch('/vacations/{id}', [VacationController::class, 'update']);

  Route::get('/vacations/vacation-statuses', [VacationController::class, 'statuses']);
});
