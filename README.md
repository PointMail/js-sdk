# ✍ Point API Javascript SDK

> The Point API SDK provides an easy client and serverside interface for the Point API

[![npm](https://img.shields.io/npm/l/@point-api/js-sdk.svg)](https://www.npmjs.com/package/@point-api/js-sdk) [![Build Status](https://travis-ci.com/PointMail/js-sdk.svg?branch=master)](https://travis-ci.com/PointMail/js-sdk)  
[![forthebadge](https://forthebadge.com/images/badges/fo-shizzle.svg)](https://forthebadge.com)

## Setup:

`npm install @point-api/js-sdk`

## Usage:

To use the Point API, you must first use your API key to retrieve a valid auth code.
_Make sure to substitute your API_KEY and your user's EMAIL_ADDRESS_

```js
// Request an auth code from the Point API /auth endpoint
const response = await fetch(
  "v1.pointapi.com/auth?emailAddress=<EMAIL_ADDRESS>",
  {
    headers: {
      Authorization: "Basic <API_KEY>"
    },
    method: "POST"
  }
);
// returns {"jwt":"<AUTH_CODE>"}

// Parse the json response and extract the JWT into a variable
const authCode = (await response.json()).jwt;
```

To query suggestions given some seed text:

```js
const api = new PointApi("<EMAIL_ADDRESS>", "<AUTH_CODE>");
// A websockets connection is automatically established on api init

api.searchSuggestions("Hey");
// {{suggestion: "Hey, how are you?", "type": "suggestion", "userAdded": false}, ...}

// You can also set the past context to augment recieved suggestions
api.setContext("Hey Alex, when can you send me the slide deck?", "text");
api.searchSuggestions("i can");
// {{suggestion: "I can get it to you this afternoon.", ...}}
```

You can also help us train our models by reporting a user's chosen suggestions ([Reference](#reportchosensuggestion))

```js
api.reportChosenSuggestion(
    "I can",
    {{suggestion: "I can do whatever's best for you.", ...}},
    {suggestion: "I can make it tonight.", ...},
    "Hey Lambert. Nice to hear from you! I can"
  )
```

We also have a beta smart reply feature:

```js
/*
  This function call sets the past context of the session
  as well as returns a list of quick response suggestions
*/
api.getReplies("How are you?", "text");
/*
{
  prompt: "How are you?",
  replies: ["Great!", "Alright!", "Stupendously awesome!"],
  type: "HowAreYou"
}
*/
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
