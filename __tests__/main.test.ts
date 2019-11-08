import PointApi from "../src/main";
import {
  snippets,
  testResponse,
  mockfeedback,
  mockSnippetsByContent,
  mockSnippetsByName
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
  mockSnippetsByContent.mockClear();
  mockSnippetsByName.mockClear();
});

test("Inits PointApi object correctly", () => {
  expect(api.emailAddress).toEqual(emailAddress);
});

describe("Query snippets by content", () => {
  test("Returns results correctly", async () => {
    const apiSession = await apiSessionPromise;

    const seedText = "hello";
    const result = await apiSession.queryByContent(seedText);
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    if (result) {
      expect(result.snippets).toHaveLength(3);
    }
    expect(mockSnippetsByContent.mock.calls[0][0]).toHaveProperty(
      "seedText",
      seedText
    );
  });
});

describe("Query snippets by name", () => {
  test("Returns results correctly", async () => {
    const apiSession = await apiSessionPromise;

    const query = "snip";
    const result = await apiSession.queryByName(query);
    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    if (result) {
      expect(result.snippets).toHaveLength(3);
    }
    expect(mockSnippetsByName.mock.calls[0][0]).toHaveProperty(
      "query",
      query
    );
  });
});

test("Bad responses", async () => {
  const apiSession = await apiSessionPromise;

  snippetsResponse.snippets = [];
  expect(await apiSession.queryByContent("hello123")).toBeNull();
  delete testResponse.snippetsResponse;
  expect(await apiSession.queryByContent("hello123")).toBeNull();
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
