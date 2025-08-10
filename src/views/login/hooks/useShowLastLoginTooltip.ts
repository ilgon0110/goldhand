export const useShowLastLoginTooltip = () => {
  const getLastLoginTooltip = () => {
    if ('last-login-tooltip' in localStorage) {
      return localStorage.getItem('last-login-tooltip');
    }

    return null;
  };

  const setLastLoginTooltip = (provider: string) => {
    localStorage.setItem('last-login-tooltip', provider);
  };

  return {
    getLastLoginTooltip,
    setLastLoginTooltip,
  };
};
