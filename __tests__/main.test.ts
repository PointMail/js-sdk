import PointApi from "../src/main";
import {
  snippets,
  testResponse,
  mockfeedback,
  mockSnippets,
} from "../__mocks__/socket-mock";
import AuthManager, { mockOnJwtChange, mockOffJwtChange, mockGetJwt } from '../src/__mocks__/authManager';
const { snippetsResponse } = testResponse;
const emailAddress = "aiansiti@college.harvard.edu";
const apiKey = "authcode1234";

jest.mock('../src/authManager');
jest.mock(
  "socket.io-client",
  () => require.requireActual("../__mocks__/socket-mock").default
);
process.env.REACT_APP_BASE_URI = "localhost:5000";
const api = new PointApi(emailAddress, apiKey);
const apiSessionPromise = api.initAutocompleteSessionAsync('standard');

beforeEach(() => {
  AuthManager.mockClear();
  mockOnJwtChange.mockClear();
  mockOffJwtChange.mockClear();
  mockGetJwt.mockClear();
  mockfeedback.mockClear();
  mockSnippets.mockClear();
});

test("Inits PointApi object correctly", () => {
  expect(api.emailAddress).toEqual(emailAddress);
});

describe("Query suggestions", () => {
  test("Returns results correctly", async () => {
    const apiSession = await apiSessionPromise;

    const seedText = "hello123";
    const result = await apiSession.queryByContent(seedText);
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    if (result) {
      expect(result.snippets).toHaveLength(3);
    }
    expect(mockSnippets.mock.calls[0][0]).toHaveProperty(
      "seedText",
      seedText
    );
  });
  test("Bad responses", async () => {
    const apiSession = await apiSessionPromise;

    snippetsResponse.snippets = [];
    expect(await apiSession.queryByContent("hello")).toBeNull();
    delete testResponse.snippetsResponse;
    expect(await apiSession.queryByContent("hello")).toBeNull();
  });
});

test("Chosen suggestions tracking", async () => {
  const apiSession = await apiSessionPromise;

  await expect(
    apiSession.feedback("", snippets[0], "jest-unit-tests")
  ).resolves.toBeUndefined();
  expect(mockfeedback).toBeCalled();
  await expect(
    apiSession.feedback("", snippets[0], "jest-unit-tests")
  ).rejects.toThrow();
  await expect(
    apiSession.feedback("", snippets[0], "jest-unit-tests")
  ).rejects.toThrow();
});
