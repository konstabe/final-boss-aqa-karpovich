export interface ID {
	_id: string;
}

export interface ICreatedOn {
	createdOn: string;
}

export interface IResponseFields {
	IsSuccess: boolean;
	ErrorMessage: string | null;
}

export interface IResponse<T extends object | null> {
	status: number;
	headers: Record<string, string>;
	body: T;
}

export type SortOrder = "asc" | "desc";
