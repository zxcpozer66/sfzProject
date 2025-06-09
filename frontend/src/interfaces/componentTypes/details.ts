import type { Notation } from '../modelsTypes/notation'

export interface Detail {
	descriptionProblem: string
	descriptionTask?: string
	answer?: string
	notation?: Notation | string
	order_apllication?: string
	startTime?: Date
	endTime?: Date
	typeReaction: string
}
