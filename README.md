# ✍ Point API Javascript SDK

> Point API's _js-sdk_ provides an easy server-side and client-side interface for the Point API.

[![npm](https://img.shields.io/npm/l/@point-api/js-sdk.svg)](https://www.npmjs.com/package/@point-api/js-sdk) [![Build Status](https://travis-ci.com/PointMail/js-sdk.svg?branch=master)](https://travis-ci.com/PointMail/js-sdk)  
[![forthebadge](https://forthebadge.com/images/badges/fo-shizzle.svg)](https://forthebadge.com)

## Installation

`npm install @point-api/js-sdk`

## Usage

### Server-side

To use the Point API, you must first use your API key to retrieve an _auth code_. An auth code is a [JWT](https://jwt.io) that authenticates your client with the Point API. To keep your API key private, make a server-side request to retrieve an auth code, which you can then pass to your client for connecting to our API. Each auth code expires in 6 hours, so be sure to obtain a new auth code for your client after expiration.

The following is a code sample for requesting a Point API auth code. _Make sure to substitute your API_KEY and your client's EMAIL_ADDRESS_

```js
// Request an auth code (JWT) from the Point API /auth endpoint
const response = await fetch(
  "https://v1.pointapi.com/auth?emailAddress=<EMAIL_ADDRESS>",
  {
    headers: {
      Authorization: "Bearer <API_KEY>"
    },
    method: "POST"
  }
);
// returns {"jwt":"<AUTH_CODE>"}

// Parse the json response and extract the JWT into a variable
const authCode = (await response.json()).jwt;
```

### Client-side

Your client can start using the Point API once it has a valid auth code.

#### `searchSuggestions`
Use the `searchSuggestions` function to get a list of Autocomplete suggestions. You can pass in _seed text_ to filter for suggestions that include specific words:

```js
const api = new PointApi("<EMAIL_ADDRESS>", "<AUTH_CODE>");
// A websockets connection is automatically established on api init

// Get Autocomplete suggestions with the seed text "I can"
api.searchSuggestions((seedText = "I can"));
// [{suggestion: "I can call you later today.", "type": "suggestion", "userAdded": false}, ...]
```

#### `setContext`
You can also set the _context_ to refine Autocomplete suggestions. The _context_ refers to a message that you're responding to, such as an email that you have received. Once the _context_ has been set, `searchSuggestions` may return an entirely different list of suggestions:

```js
// Set context
api.setContext(
  (pastContext = "Hey Alex, when can you send me the slide deck?"),
  (contextType = "text")
);
api.searchSuggestions((seedText = "I can"));
// [{suggestion: "I can get it to you this afternoon.", "type": "suggestion", "userAdded": false}, ...]
```

#### `getReplies`
Point API also provides Reply suggestions for responding to entire messages (currently in beta). Use the `getReplies` function to receive Reply suggestions. You can play around with this feature [here](https://jsfiddle.net/thesiti92/1v736cpt/6/).  
_Note: this function will also set the past `context` for the whole session_

```js
// Get Reply suggestions just as you would set the past context
api.getReplies(
  (pastContext = "How are you?"), 
  (contextType = "text")
);
```

Point finds "prompts" in your context and suggest up to 3 replies for each prompt. It also includes a "confidence" field in each reply suggestion, ranging from a score of 1 (possibly correct) to 3 (very likely correct). This reveals how certain we are about the accuracy of our suggestions.

Example:
```js
// If multiple prompts are detected, replies will be generated for all of them and returned in a list
[
  {
    prompt: "How are you?",
    replies: [
      {
        confidence: 3,
        text: "I'm doing okay, what about you?"
      },
      {
        confidence: 3,
        text: "I'm doing fantastic."
      },
      {
        confidence: 3,
        text: "I'm great! How are you?"
      }
    ]
  }
];
```

#### `reportChosenSuggestion`
You can also help us train our models by reporting suggestions that you have chosen ([Reference](#reportchosensuggestion))

```js
api.reportChosenSuggestion(
    seedText="I can",
    displayedSuggestions=[
    	{suggestion: "I can do whatever's best for you.", ...},
    	{suggestion: "I can get it to you this afternoon.", ...},
    	...
    ],
    chosenSuggestion={suggestion: "I can get it to you this afternoon.", ...}
  )
```

## Documentation

### Class: PointApi

Point Websockets Api Instance

- [constructor](README.md#constructor)

#### Properties

- [apiKey](README.md#apikey)
- [emailAddress](README.md#emailaddress)
- [socket](README.md#socket)
- [suggestions](README.md#suggestions)

#### Methods

- [searchSuggestions](README.md#searchsuggestions)

---

#### constructor

<a id="constructor"></a>

**new PointApi**(emailAddress: _`string`_, apiKey: _`string`_, keywordSearch?: _`boolean`_): [PointApi](README.md)

**Parameters:**

| Param                         | Type      | Description                 |
| ----------------------------- | --------- | --------------------------- |
| emailAddress                  | `string`  | Email address of Point user |
| apiKey                        | `string`  | API key of Point client     |
| `Default value` keywordSearch | `boolean` | false                       |

**Returns:** [PointApi](README.md)

---

### Properties

<a id="apikey"></a>

#### apiKey

**● apiKey**: _`string`_

Api key of Point client

---

<a id="emailaddress"></a>

#### emailAddress

**● emailAddress**: _`string`_

Email address of Point user

---

### Methods

<a id="searchsuggestions"></a>

#### searchSuggestions

▸ **searchSuggestions**(seedText: _`string`_): `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)> &#124; `null`>

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param    | Type     | Description                                    |
| -------- | -------- | ---------------------------------------------- |
| seedText | `string` | The text to base suggestion predictions off of |

**Returns:** `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)> &#124; `null`>
A list of the predicted suggestion objects

---

<a id="reportchosensuggestion"></a>

#### reportChosenSuggestion

▸ **reportChosenSuggestion**(seedText: _`string`_, displayedSuggestions: _[SuggestionMeta](../interfaces/\_main_.suggestionmeta.md)[]_, chosenSuggestion: _[SuggestionMeta](../interfaces/_main_.suggestionmeta.md)_, currentContext: _`string`\_): `Promise`<`void`>

_Defined in [main.ts:83](https://github.com/PointMail/point-api/blob/1073414/src/main.ts#L83)_

Tell the PointApi what suggestion was chosen to improve its model

**Parameters:**

| Param                | Type                                                       |
| -------------------- | ---------------------------------------------------------- |
| seedText             | `string`                                                   |
| displayedSuggestions | [SuggestionMeta](../interfaces/_main_.suggestionmeta.md)[] |
| chosenSuggestion     | [SuggestionMeta](../interfaces/_main_.suggestionmeta.md)   |
| currentContext       | `string`                                                   |

**Returns:** `Promise`<`void`>

---

<a id="setcontext"></a>

#### setContext

▸ **setContext**(pastContext: _`string`_, contextType: _`string`_): `Promise`<`string`>

_Defined in [main.ts:102](https://github.com/PointMail/point-api/blob/1073414/src/main.ts#L102)_

Set the context of the autocomplete session

**Parameters:**

| Param       | Type     |
| ----------- | -------- |
| pastContext | `string` |
| contextType | `string` |

**Returns:** `Promise`<`string`>

---

<a id="getreplies"></a>

#### getReplies

▸ **getReplies**(pastContext: _`string`_, contextType: _`string`_): `Promise`< [ReplyMeta](../interfaces/_main_.replymeta.md)[] &#124; `null`>

_Defined in [main.ts:126](https://github.com/PointMail/point-api/blob/a8b2956/src/main.ts#L126)_

Get reply suggestions given some recieved text

**Parameters:**

| Param       | Type     |
| ----------- | -------- |
| pastContext | `string` |
| contextType | `string` |

**Returns:** `Promise`< [ReplyMeta](../interfaces/_main_.replymeta.md)[] &#124; `null`>

---

<a id="suggestionmeta"></a>

### Object: SuggestionMeta

Suggestion with metadata recieved from Point API

##### Type declaration

suggestion: `string` The suggestion text

type: `string` What kind of a suggestion it is (ie. `"suggestion"` is just text or `"calendar"` would be interactive)

userAdded: `boolean` Whether a user manually added the suggestion to their profile

---

<a id="replymeta"></a>

### Object: ReplyMeta

All of the replies for a detected prompt

##### Type declaration

prompt: `string` The detected prompt to reply to

type: `string` What kind of prompt we detect (ie. `What is your phone number?` would be a `PhoneNumberRequest` prompt )

replies: `string[]` A list of suggested replies for the prompt

---

## Additional resources

Point API is the engine that powers autocompletion, which means you can customize the frontend implementation to fit your production needs. If you want to include a frontend solution that works out-of-the-box, we have a sample autocomplete dropdown (implemented as a React component) that automatically integrates with the API. You can plug in our autocomplete dropdown to have a fully-functional autocomplete on your platform, app, or website.
_A sample implementation can be found [here](https://github.com/PointMail/dropdown-react-demo)_
