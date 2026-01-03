import { NotificationService } from "utils/notifications/notifications.service";
import { TelegramService } from "utils/notifications/telegram.service";

export default async function () {
	if (!process.env.CI) return;

	const notificationService = new NotificationService(new TelegramService());

	const reportPath = process.env.REPORT_PATH || "allure-report";
	const reportUrl = `https://konstabe.github.io/final-boss-aqa-karpovich/${reportPath}`;

	await notificationService.postNotification(`Test run finished!
    
Link to deployed report:

${reportUrl}`);
}
