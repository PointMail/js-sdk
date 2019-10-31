import { Snippet } from "../src/ApiModules/autocompleteSession";

export const snippets: Snippet[] = [
  {
    id_: '1',
    content: "Hello, how are you?",
    name: "snip_1",
    labels: []
  },
  {
    id_: '2',
    content: "Hello, how was your day?",
    name: "snip_2",
    labels: []
  },
  {
    id_: '3',
    content: "Hello, my name jeff",
    name: "snip_3",
    labels: []
  }
];

export const testResponse = {
  snippetsResponse: {
    snippets,
    seedText: null,
    timestamp: null
  }
};

export const mockSnippetsByContent = jest
  .fn()
  .mockImplementation((data, callback) => {
    if (!testResponse.snippetsResponse) {
      callback(null);
    }
    const filteredSnippets = testResponse.snippetsResponse.snippets.filter(snippet => 
      snippet.content.toLowerCase().startsWith(data.seedText.toLowerCase())
    );
    callback({snippets: filteredSnippets, seedText: testResponse.snippetsResponse.seedText, timestamp: testResponse.snippetsResponse.timestamp});
  });

  export const mockSnippetsByName = jest
  .fn()
  .mockImplementation((data, callback) => {
    if (!testResponse.snippetsResponse) {
      callback(null);
    }
    const filteredSnippets = testResponse.snippetsResponse.snippets.filter(snippet => 
      snippet.name.toLowerCase().startsWith(data.query.toLowerCase())
    );
    callback({snippets: filteredSnippets, seedText: testResponse.snippetsResponse.seedText, timestamp: testResponse.snippetsResponse.timestamp});
  });

export const mockfeedback = jest
  .fn()
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "success" })
  )
  .mockImplementationOnce(callback =>
    callback({ timestamp: "foo", status: "failure" })
  )
  .mockImplementationOnce(callback => callback());


const emit = jest.fn().mockImplementation((channel: string, data, callback) => {
  if (channel === "querySnippetContents") {
    mockSnippetsByContent(data, callback);
  } else if (channel === "querySnippetNames") {
    return mockSnippetsByName(data, callback);
  } else if (channel === "feedback") {
    return mockfeedback(callback);
  }
});
const connect = jest.fn();
const on = jest.fn();

const mockIo = jest.fn().mockReturnValue({
  on,
  connect,
  emit,
  disconnected: false,
  connected: true,
});

export default mockIo;
