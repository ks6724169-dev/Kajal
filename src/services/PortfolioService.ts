import { PortfolioProject, AchievementItem } from '../stores/portfolioStore';

export class PortfolioService {
  static async getPortfolioProjects(studentId: string): Promise<PortfolioProject[]> {
    const saved = localStorage.getItem('galaxy_portfolio_projects');
    if (!saved) return [];
    const projs = JSON.parse(saved);
    return projs.filter((p: any) => p.studentId === studentId);
  }

  static async getAchievements(studentId: string): Promise<AchievementItem[]> {
    const saved = localStorage.getItem('galaxy_portfolio_achievements');
    if (!saved) return [];
    const achs = JSON.parse(saved);
    return achs.filter((a: any) => a.studentId === studentId);
  }
}
