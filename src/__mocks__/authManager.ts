export const mockOnJwtChange = jest.fn();
export const mockOffJwtChange = jest.fn();
export const mockGetJwt = jest.fn();
export const mockIsUserActive = jest.fn();
const AuthManager = jest.fn().mockImplementation(() => {
  return {
    onJwtChange: mockOnJwtChange,
    offJwtChange: mockOffJwtChange,
    getJwt: mockGetJwt,
    isUserActive: mockIsUserActive
  };
});

export default AuthManager;
