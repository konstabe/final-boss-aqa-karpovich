import { IApiClient, IRequestOptions } from "api/core/types";
import { apiConfig } from "config/apiConfig";
import { ICredentials, ILoginResponse } from "data/types/credentials.types";

export class LoginApi {
	constructor(private apiClient: IApiClient) {}

	async login(credentials: ICredentials) {
		const options: IRequestOptions = {
			baseURL: apiConfig.baseUrl!,
			url: apiConfig.endpoints.login,
			method: "post",
			headers: {
				"content-type": "application/json",
			},
			data: credentials,
		};

		return await this.apiClient.send<ILoginResponse>(options);
	}
}
