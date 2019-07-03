export const mockOnJwtChange = jest.fn();
export const mockOffJwtChange = jest.fn();
export const mockGetJwt = jest.fn();
const AuthManager = jest.fn().mockImplementation(() => {
  return {
    onJwtChange: mockOnJwtChange,
    offJwtChange: mockOffJwtChange,
    getJwt: mockGetJwt
  };
});

export default AuthManager
