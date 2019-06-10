const onJwtChange = jest.fn();
const offJwtChange = jest.fn();

const MockAuthManager = {
  onJwtChange,
  offJwtChange,
}

const constructor = () => MockAuthManager;

export default constructor;
// console.log(AuthManager);
// AuthManager.default.mockImplementation(() => MockAuthManager);
