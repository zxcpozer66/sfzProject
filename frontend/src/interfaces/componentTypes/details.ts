import type { Notation } from '../modelsTypes/notation'

export interface Detail {
	descriptionProblem: string
	descriptionTask?: string
	answer?: string
	notation?: Notation | string
	order_application?: string
	startTime?: Date | string
	endTime?: Date | string
	typeReaction: string
}
