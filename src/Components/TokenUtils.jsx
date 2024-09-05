export const isTokenExpired = (token) => {
    if (!token) {
      return true;
    }
    
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return true;
    }
  
    try {
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      const exp = decodedToken.exp * 1000; 
    
      return Date.now() > exp;
    } catch (e) {
      console.error('Error decoding token:', e);
      return true;
    }
  };