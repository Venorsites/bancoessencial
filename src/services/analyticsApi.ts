export interface AnalyticsOverview {
  totalUsers: number;
  totalOils: number;
  totalWebhooks: number;
  totalPurchases: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newOilsThisMonth: number;
  purchaseSuccessRate: number;
}

export interface UserAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  usersByRole: { role: string; count: number }[];
  usersByMonth: { month: string; count: number }[];
}

export interface OilAnalytics {
  totalOils: number;
  newOilsThisMonth: number;
  oilsByFamily: { family: string; count: number }[];
  oilsByChemicalFamily: { family: string; count: number }[];
  oilsByExtractionMethod: { method: string; count: number }[];
  oilsByMonth: { month: string; count: number }[];
}

export interface PurchaseAnalytics {
  totalPurchases: number;
  totalRevenue: number;
  successfulPurchases: number;
  failedPurchases: number;
  successRate: number;
  purchasesByMonth: { month: string; count: number; revenue: number }[];
  averageOrderValue: number;
  topProducts: { product: string; sales: number; revenue: number }[];
}

export interface WebhookAnalytics {
  totalWebhooks: number;
  webhooksByEvent: { event: string; count: number }[];
  webhooksByStatus: { status: string; count: number }[];
  webhooksByMonth: { month: string; count: number }[];
  successRate: number;
  errorRate: number;
}

export interface DashboardData {
  overview: AnalyticsOverview;
  users: UserAnalytics;
  oils: OilAnalytics;
  purchases: PurchaseAnalytics;
  webhooks: WebhookAnalytics;
  lastUpdated: string;
}

class AnalyticsApi {
  private baseUrl = 'http://localhost:3000';

  private async makeRequest<T>(endpoint: string, token: string): Promise<T> {
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getOverview(token: string): Promise<AnalyticsOverview> {
    return this.makeRequest<AnalyticsOverview>('/analytics/overview', token);
  }

  async getUserAnalytics(token: string): Promise<UserAnalytics> {
    return this.makeRequest<UserAnalytics>('/analytics/users', token);
  }

  async getOilAnalytics(token: string): Promise<OilAnalytics> {
    return this.makeRequest<OilAnalytics>('/analytics/oils', token);
  }

  async getPurchaseAnalytics(token: string): Promise<PurchaseAnalytics> {
    return this.makeRequest<PurchaseAnalytics>('/analytics/purchases', token);
  }

  async getWebhookAnalytics(token: string): Promise<WebhookAnalytics> {
    return this.makeRequest<WebhookAnalytics>('/analytics/webhooks', token);
  }

  async getDashboard(token: string): Promise<DashboardData> {
    return this.makeRequest<DashboardData>('/analytics/dashboard', token);
  }
}

export const analyticsApi = new AnalyticsApi();
