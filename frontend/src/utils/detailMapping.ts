import type { RequestData } from '../interfaces/api/response/request/requestData'
import type { Detail } from '../interfaces/componentTypes/details'

export type DetailKeys = keyof Detail

export const mapDetailToRequest: Record<DetailKeys, keyof RequestData> = {
	startTime: 'start_time',
	endTime: 'end_time',
	descriptionProblem: 'description_problem',
	descriptionTask: 'description_task',
	answer: 'answer',
	notation: 'notation_id',
	typeReaction: 'type_reaction_id',
	order_apllication: 'order_apllication',
}

export const labelMap: Record<DetailKeys, string> = {
	startTime: 'Начала',
	endTime: 'Конец',
	descriptionProblem: 'Описание проблемы или задачи пользователем',
	descriptionTask: 'Описание задачи специалистом',
	answer: 'Решение задачи специалистом',
	notation: 'Примечание',
	order_apllication: 'Поручение',
	typeReaction: 'Тип реакции',
}

export const detailFields: DetailKeys[] = [
	'startTime',
	'endTime',
	'descriptionProblem',
	'descriptionTask',
	'answer',
	'notation',
	'order_apllication',
	'typeReaction',
]
