import { faker } from "@faker-js/faker";
import { IMetrics } from "../types/metrics.types";

export function generateMetricData(params?: Partial<IMetrics>): IMetrics {
  return {
    orders: {
      totalRevenue: faker.number.int({ min: 0, max: 999 }),
      totalOrders: faker.number.int({ min: 0, max: 999 }),
      averageOrderValue: faker.number.int({ min: 0, max: 999 }),
      totalCanceledOrders: faker.number.int({ min: 0, max: 999 }),
      recentOrders: [],
      ordersCountPerDay: [],
      ...params?.orders,
    },
    customers: {
      totalNewCustomers: faker.number.int({ min: 0, max: 999 }),
      topCustomers: [],
      customerGrowth: [],
      ...params?.customers,
    },
    products: {
      topProducts: [],
      ...params?.products,
    },
  };
}
