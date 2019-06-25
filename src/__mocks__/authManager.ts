export const mockOnJwtChange = jest.fn();
export const mockOffJwtChange = jest.fn();
export const mockIsActive = () => true;
export const mockGetJwt = jest.fn();
const AuthManager = jest.fn().mockImplementation(() => {
  return {
    onJwtChange: mockOnJwtChange,
    offJwtChange: mockOffJwtChange,
    isActive: mockIsActive,
    getJwt: mockGetJwt
  };
});

export default AuthManager
