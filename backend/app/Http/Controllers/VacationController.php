<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\User;
use App\Models\Vacation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VacationController extends Controller
{

    

    public function workedMinutes(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $minutes = Application::where('user_id', $user->id)
            ->whereNotNull('end_time')
            ->sum(DB::raw('TIMESTAMPDIFF(MINUTE, start_time, end_time)'));

        return response()->json(['worked_minutes' => $minutes]);
    }

    public function availableMinutes(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $workedMinutes = Application::where('user_id', $user->id)
            ->whereNotNull('end_time')
            ->sum(DB::raw('TIMESTAMPDIFF(MINUTE, start_time, end_time)'));

        $vacationMinutes = Vacation::where('user_id', $user->id)
            ->where('vacation_status_id', 2)
            ->get()
            ->sum(fn($vac) => $this->calculateVacationMinutes($vac));

        $available = max(0, $workedMinutes - $vacationMinutes);

        return response()->json([
            'available_minutes' => $available,
            'worked_minutes' => $workedMinutes,
            'used_vacation_minutes' => $vacationMinutes
        ]);
    }

    //Add vacation post http://localhost:8000/api/vacations
    //{
    //   "user_id": 1,
    //   "start_date": "2026-05-07",
    //   "end_date": "2026-06-11"
    // }
    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'start_date' => 'required|date|after_or_equal:' . now()->toDateString(),
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $data['user_id'] = $user->id;
        $vacation = Vacation::create($data);
        return response()->json($vacation, 201);
    }


    //Edit put  http://localhost:8000/api/vacations/8
    // {
    //   "vacation_status_id": 1
    // }
    public function update(Request $request, $vacationId)
    {
        $vacation = Vacation::findOrFail($vacationId);

        $validator = Validator::make($request->all(), [
            'start_date' => 'date|after_or_equal:' . now()->toDateString(),
            'end_date' => 'date|after_or_equal:start_date',
            'vacation_status_id' => 'sometimes|exists:vacations_status,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if ($request->has('vacation_status_id') && $vacation->vacation_status_id != $request->vacation_status_id) {
            $vacation->approved_by = Auth::id();
        }

        $vacation->fill($request->only(['start_date', 'end_date', 'vacation_status_id']))->save();

        return response()->json($vacation);
    }

    public function getUsersWithMinutes(Request $request)
    {
        $users = User::all();

        $result = $users->map(function ($user) {
            $workedMinutes = Application::where('user_id', $user->id)
                ->whereNotNull('end_time')
                ->sum(DB::raw('TIMESTAMPDIFF(MINUTE, start_time, end_time)'));

            $vacationMinutes = Vacation::where('user_id', $user->id)
                ->where('vacation_status_id', 2)
                ->get()
                ->sum(fn($vac) => $this->calculateVacationMinutes($vac));

            $availableMinutes = max(0, $workedMinutes - $vacationMinutes);

            return [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'surname' => $user->surname,
                'patronymic' => $user->patronymic,
                'department' => optional($user->department)->title,
                'minutesWorked' => $workedMinutes,
                'minutesEarned' => $availableMinutes,
            ];
        });

        return response()->json($result);
    }

    //10 - число рабочиз часов в день
    private function calculateVacationMinutes(Vacation $vacation): int
    {
        $start = Carbon::parse($vacation->start_date);
        $end = Carbon::parse($vacation->end_date);

        $days = 0;
        $current = $start->copy();
        while ($current->lte($end)) {
            if (!$current->isWeekend()) {
                $days++;
            }
            $current->addDay();
        }
        return $days * 10 * 60;
    }

    public function getUsersAndAvailableVacationMinutes(Request $request)
    {
        $validated = $request->validate([
            'per_page' => 'nullable|integer',
        ]);

        $user = auth()->user();
        $departmentId = $user->department_id;

        $perPage = $validated['per_page'] ?? 10;

        // ID статуса "утвержден" для отпусков
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
