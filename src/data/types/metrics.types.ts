import { IResponseFields } from "./core.types";

export interface IHomePageMetrics extends IResponseFields {
    Metrics: IMetrics;
}

export interface IMetrics {
  orders: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCanceledOrders: number;
    recentOrders: [];
    ordersCountPerDay: [];
  };
  customers: {
    totalNewCustomers: number;
    topCustomers: [];
    customerGrowth: [];
  };
  products: {
    topProducts: [];
  };
}