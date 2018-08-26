# ✍ Point API Javascript SDK

> Point API's _js-sdk_ provides an easy server-side and client-side interface for Point API.

[![npm](https://img.shields.io/npm/dt/@point-api/js-sdk.svg)](https://www.npmjs.com/package/@point-api/js-sdk)
 [![Build Status](https://travis-ci.com/PointMail/js-sdk.svg?branch=master)](https://travis-ci.com/PointMail/js-sdk)  
[![forthebadge](https://forthebadge.com/images/badges/fo-shizzle.svg)](https://forthebadge.com)

[Getting Started](https://docs.pointapi.com/docs/getting-started)  

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

#### `autocomplete`
Use the `autocomplete` function to get a list of Autocomplete suggestions. You can pass in _seed text_ to filter for suggestions that include specific words:

```js
const api = new PointApi("<EMAIL_ADDRESS>", "<AUTH_CODE>");
// A websockets connection is automatically established on api init

// Get Autocomplete suggestions with the seed text "I can"
api.autocomplete("I can");
// { responseId: "12345", suggestions: [{suggestion: "I can call you later today.", "type": "suggestion", "userAdded": false}, ...]}
```

#### `setContext`
You can also set the _context_ to refine Autocomplete suggestions. The _context_ refers to a message that you're responding to, such as an email that you have received. Once the _context_ has been set, `searchSuggestions` may return an entirely different list of suggestions:

```js
// Set context
api.setContext("Hey Alex, when can you send me the slide deck?");
api.autocomplete("I can");
// { responseId: "12345", suggestions: [{suggestion: "I can get it to you this afternoon.", "type": "suggestion", "userAdded": false}, ...]}
```

#### `reply`
Point API also provides Reply suggestions for responding to entire messages (currently in beta). Use the `getReplies` function to receive Reply suggestions. You can play around with this feature [here](https://jsfiddle.net/thesiti92/1v736cpt/6/).  
_Note: this function will also set the past `context` for the whole session_

```js
// Get replies just as you would set the past context:
api.reply("How are you?");
```

Point finds "prompts" in your context and suggest up to 3 replies for each prompt. It also includes a "confidence" field in each reply suggestion, ranging from a score of 1 (possibly correct) to 3 (very likely correct). This reveals how certain we are about the accuracy of our suggestions.

Example:
```js
// If multiple prompts are detected, replies will be generated for all of them and returned in a list
{
  responseId: "response_id",
  replies: [
  {
    prompt: "How are you?",
    suggestions: [
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
]};
```

#### `feedback`
You can also help us train our models by reporting user feedback such as chosen suggestions

```js
api.feedback("response_id", "I'm doing okay, what about you?", "positive");
```

## Documentation
### Class: PointApi

Point Websockets Api Instance

- [constructor](#constructor)

#### Properties

- [apiKey](#apikey)
- [emailAddress](#emailaddress)
- [socket](#socket)
- [suggestions](#suggestions)

#### Methods

- [autocomplete](#autocomplete)

---

#### constructor

<a id="constructor"></a>

**new PointApi**(emailAddress: _`string`_, apiKey: _`string`_, keywordSearch?: _`boolean`_): PointApi

**Parameters:**

| Param                         | Type      | Description                 |
| ----------------------------- | --------- | --------------------------- |
| emailAddress                  | `string`  | Email address of Point user |
| apiKey                        | `string`  | API key of Point client     |
| `Default value` keywordSearch | `boolean` | false                       |

**Returns:** PointApi

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

<a id="autocomplete"></a>

#### autocomplete

▸ **autocomplete**(seedText: _`string`_): `Promise`< [AutocompleteResponse](#autocomplete-response) &#124; `null`>

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param                     | Type                        | Description                                    |
| ------------------------- | --------------------------- | ---------------------------------------------- |
| seedText                  | `string`                    | The text to base suggestion predictions off of |
| `Optional` currentContext | `undefined` &#124; `string` |

**Returns:** `Promise`< [AutocompleteResponse](#autocomplete-response) | `null`>

---

<a id="feedback"></a>

### feedback

▸ **feedback**(responseId: _`string`_, suggestion: _ `string` &#124; `string`[]_, type: _ "positive" &#124; "negative"_): `Promise`<`void`>

Give feedback on Point Api's suggestions

**Parameters:**

| Param      | Type                         |
| ---------- | ---------------------------- |
| responseId | `string`                     |
| suggestion | `string` &#124; `string`[]   |
| type       | "positive" &#124; "negative" |

**Returns:** `Promise`<`void`>

---

<a id="setcontext"></a>

#### setContext

▸ **setContext**(pastContext: _`string`_, contextType: _`string`_): `Promise`<`string`>

Set the context of the autocomplete session

**Parameters:**

| Param       | Type     |
| ----------- | -------- |
| pastContext | `string` |
| contextType | `string` |

**Returns:** `Promise`<`string`>

---

<a id="reply"></a>

#### reply

▸ **reply**(pastContext: _`string`_, contextType: _`string`_): `Promise`< [ReplyResponse](#reply-response) &#124; `null`>

Get reply suggestions given some recieved text

**Parameters:**

| Param                       | Type                                            | Default value    |
| --------------------------- | ----------------------------------------------- | ---------------- |
| pastContext                 | `string`                                        | -                |
| `Default value` contextType | [ContextType](../modules/_main_.md#contexttype) | &quot;text&quot; |

**Returns:** `Promise`< [ReplyResponse](#reply-response) &#124; `null`>

### Types:

<a id="reply-type"></a>

**Reply**

#### Properties:

**● confidence**: _`number`_  
**● text**: _`string`_

<a id="reply-meta"></a>

**ReplyMeta**

#### Properties:

**● prompt**: _`string`_  
**● suggestions**: _Reply[]_  
**● type**: _`string`_

<a id="reply-response"></a>

**ReplyResponse**

#### Properties:

**● replies**: _ReplyMeta[]_  
**● responseId**: _`string`_

<a id="suggestion-meta"></a>

**SuggestionMeta**

#### Properties:

**● suggestion**: _`string`_  
**● type**: _`string`_  
**● userAdded**: _`boolean`_

<a id="autocomplete-response"></a>

**AutocompleteResponse**

**● responseId**: _`string`_  
**● seedText**: _`string`_  
**● suggestions**: _SuggestionMeta[]_

---

## Additional resources

Point API is the engine that powers autocompletion, which means you can customize the frontend implementation to fit your production needs. If you want to include a frontend solution that works out-of-the-box, we have a sample autocomplete dropdown (implemented as a React component) that automatically integrates with the API. You can plug in our autocomplete dropdown to have a fully-functional autocomplete on your platform, app, or website.
_A sample implementation can be found [here](https://github.com/PointMail/dropdown-react-demo)_
