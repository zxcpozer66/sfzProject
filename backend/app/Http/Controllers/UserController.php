<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function getUsers()
    {
        $users = User::with(['department'])->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'surname' => $user->surname,
                'patronymic' => $user->patronymic,
                'department' => $user->department->title ?? null,
            ];
        });

        return response()->json($users);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'username'      => 'string',
            'name'          => 'string',
            'surname'       => 'string',
            'patronymic'    => 'string',
            'role_id'       => 'integer',
            'department_id' => 'integer',
        ]);

        $data['role_id'] = 5;
        $user            = User::create($data);

        return response()->json([
            'message' => 'Пользователь успешно создан',
            'user'    => $user,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'username' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'surname' => 'nullable|string|max:255',
            'patronymic' => 'nullable|string|max:255',
            'department_id' => 'nullable|integer|exists:departments,id'
        ]);

        $user->update($data);
        return response()->json($user);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
