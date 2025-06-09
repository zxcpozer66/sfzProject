export interface Vacation {
    id: number
    user: {
        name: string
        surname: string
        patronymic: string
        department: {
            name: string
        }
    }
    status: {
        id: number
        title: string
    }
    start_date: string
    end_date: string
}