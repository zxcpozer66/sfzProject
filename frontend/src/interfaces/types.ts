export interface UserData {
	id: number;
	username: string;
	name: string;
	surname: string;
	patronymic: string;
	department: string;
	department_id: number;
	total_work_minutes: number;
	available_minutes: number;
}

export interface Department {
	id: number;
	title: string;
}

export type HeadCell = {
	id: keyof UserData;
	label: string;
	align: "left" | "center" | "right" | "justify";
};
