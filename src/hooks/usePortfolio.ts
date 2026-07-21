import { usePortfolioStore } from '../stores/portfolioStore';

export const usePortfolio = () => {
  return usePortfolioStore();
};
