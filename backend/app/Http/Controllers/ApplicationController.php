<?php
namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    // Get applications [GET]
    public function index()
    {
        $user = Auth::user();

        $query = Application::with(['notation', 'master', 'user', 'reactionType', 'department']);

        $tasks = $query->get();

        return response()->json($tasks);
    }

    //Add new application [POST]
    public function store(Request $request)
    {
        $user = Auth::user();

        // if ($user->role->title !== 'master') {
        //     return response()->json(['message' => 'Доступ запрещен'], 403);
        // }

        $data = $request->validate([
            'department_id'       => 'required|exists:departments,id',
            'user_id'             => 'required|exists:users,id',
            'appeal_title'        => 'required|string|max:255',
            'type_reaction_id'    => 'nullable|exists:reactions_type,id',
            'description_problem' => 'required|string',
            'start_time'          => 'nullable|date',
            'end_time'            => 'nullable|date',
            'notation_id'         => 'nullable|exists:notations,id',
            'answer'              => 'nullable|string',
            'order_application'   => 'nullable|string',
            'data'                => 'nullable|string',
            'description_task'    => 'nullable|string',
            'master_id'           => 'nullable|exists:users,id',
        ]);

        $data['master_id'] = $user->id;

        $task = Application::create($data);

        return response()->json($task, 201);
    }

    //Edit application [PUT]
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $task = Application::findOrFail($id);

        // if ($user->role->title !== 'master' || $task->master_id !== $user->id) {
        //     return response()->json(['message' => 'Доступ запрещен'], 403);
        // }

        $data = $request->validate([
            'department_id'       => 'exists:departments,id',
            'user_id'             => 'exists:users,id',
            'master_id'           => 'exists:users,id',
            'appeal_title'        => 'string|max:255',
            'type_reaction_id'    => 'exists:reactions_type,id',
            'description_problem' => 'string',
            'start_time'          => 'nullable|date',
            'end_time'            => 'nullable|date|after_or_equal:start_time',
            'notation_id'         => 'nullable|exists:notations,id',
            'answer'              => 'nullable|string',
            'order_application'   => 'nullable|string',
            'description_task'    => 'string',
        ]);
        
        if ($request->has('end_time') && ! $task->start_time) {
            return response()->json([
                'message' => 'Нельзя установить время окончания без времени начала',
            ], 422);
        }

        $task->update($data);
        return response()->json($task);
    }

    //Delete application [http://127.0.0.1:8000/api/applications/18] [DELETE]
    public function destroy($id)
    {
        Application::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
