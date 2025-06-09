<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\Vacation;
use App\Models\Application;
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

     public function getVacationInterval(Request $request)
    {
        $validated = $request->validate([
            'per_page' => 'nullable|integer',
        ]);

        $user = auth()->user();
        $departmentId = $user->department_id;

        $perPage = $validated['per_page'] ?? 10;

        // ID статус одобрен
        $approvedStatusId = 2;

        $workMinutesSubquery = Application::query()
            ->whereNotNull('start_time')
            ->whereNotNull('end_time')
            ->whereNull('deleted_at')
            ->select(
                'master_id as user_id',
                DB::raw('SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)) as total_work_minutes')
            )
            ->groupBy('master_id');

        //480 минут = число рабочих минут в день
        $vacationMinutesSubquery = Vacation::query()
            ->where('vacation_status_id', $approvedStatusId)
            ->whereNull('deleted_at')
            ->select(
                'user_id',
                DB::raw('SUM((DATEDIFF(end_date, start_date) + 1) * 480) as total_vacation_minutes')
            )
            ->groupBy('user_id');

        $query = User::query()
            ->select([
                'users.id',
                'users.username',
                'users.name',
                'users.surname',
                'users.patronymic',
                'users.department_id',
                DB::raw('COALESCE(work.total_work_minutes, 0) as total_work_minutes'),
                DB::raw('COALESCE(vacation.total_vacation_minutes, 0) as total_vacation_minutes'),
                DB::raw('COALESCE(work.total_work_minutes, 0) - COALESCE(vacation.total_vacation_minutes, 0) as available_minutes')
            ])
            ->leftJoinSub($workMinutesSubquery, 'work', function ($join) {
                $join->on('users.id', '=', 'work.user_id');
            })
            ->leftJoinSub($vacationMinutesSubquery, 'vacation', function ($join) {
                $join->on('users.id', '=', 'vacation.user_id');
            })
            ->where('users.department_id', $departmentId)
            ->with('department')
            ->orderBy('users.id', 'desc');

        $users = $query->paginate($perPage);

        $users->appends($request->query());

        return response()->json($users);
    }
}
