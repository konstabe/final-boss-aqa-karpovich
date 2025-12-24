import { Page } from "@playwright/test";
// import { HomeModuleButton } from "data/types/home.types";
import { HomePage } from "pages/home.page";
// import { ProductsListPage } from "../products/productsList.page";
// import { HomeModuleButton, HomePage } from "../home.page";
import { logStep } from "utils/report/logStep.utils";

export class HomeUIService {
	homePage: HomePage;
	// productsListPage: ProductsListPage;
	constructor(private page: Page) {
		this.homePage = new HomePage(page);
		// this.productsListPage = new ProductsListPage(page);
	}

	// async openModule(moduleName: HomeModuleButton) {
	//     await this.homePage.clickOnViewModule(moduleName);

	//     if (moduleName === "Products") {
	//         await this.productsListPage.waitForOpened();
	//     }

	//     if (moduleName === "Customers") {
	//         await this.productsListPage.waitForOpened();
	//     }
	// }

	@logStep("Open Home List Page")
	async open() {
		await this.homePage.open("home");
		await this.homePage.waitForOpened();
	}
}
