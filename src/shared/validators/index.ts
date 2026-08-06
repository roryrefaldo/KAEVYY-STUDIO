export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidRobloxUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;
  return url.toLowerCase().includes('roblox.com') || url.toLowerCase().includes('github.com');
};

export const isValidOrderPrice = (priceUSD: number): boolean => {
  return typeof priceUSD === 'number' && !isNaN(priceUSD) && priceUSD > 0;
};

export const isValidNonEmptyString = (str: string, minLength: number = 1): boolean => {
  return typeof str === 'string' && str.trim().length >= minLength;
};
