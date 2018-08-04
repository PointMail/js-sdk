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
const response = await fetch("v1.pointapi.com/auth?emailAddress=<EMAIL_ADDRESS>", {
  headers: {
    Authorization: "Basic <API_KEY>"
  },
  method: "POST"
});
// returns {"jwt":"<AUTH_CODE>"}

// Parse the json response and extract the JWT into a variable
const authCode = (await response.json()).jwt
```

To query suggestions given some seed text:
```js
const api = new PointApi("<EMAIL_ADDRESS>", "<AUTH_CODE>");
// A websockets connection is automatically established on api init

api.searchSuggestions("Hey");
// {{suggestion: "Hey, how are you?", "type": "suggestion", "userAdded": false}, ...}

// You can also set the past context to augment recieved suggestions 
api.setContext("Hey Alex, when can you send me the slide deck?", "plaintext");
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

## Documentation

### Class: PointApi

Point Websockets Api Instance

* [constructor](README.md#constructor)

#### Properties

* [apiKey](README.md#apikey)
* [emailAddress](README.md#emailaddress)
* [socket](README.md#socket)
* [suggestions](README.md#suggestions)

#### Methods

* [searchSuggestions](README.md#searchsuggestions)

---

#### constructor
<a id="constructor"></a>

**new PointApi**(emailAddress: *`string`*, apiKey: *`string`*, keywordSearch?: *`boolean`*): [PointApi](README.md)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| emailAddress | `string` |  Email address of Point user |
| apiKey | `string` |  API key of Point client |
| `Default value` keywordSearch | `boolean` | false |


**Returns:** [PointApi](README.md)

___

### Properties

<a id="apikey"></a>

####  apiKey

**● apiKey**: *`string`*

Api key of Point client

___
<a id="emailaddress"></a>

####  emailAddress

**● emailAddress**: *`string`*

Email address of Point user

___

### Methods

<a id="searchsuggestions"></a>

####  searchSuggestions

▸ **searchSuggestions**(seedText: *`string`*): `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)> &#124; `null`>

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| seedText | `string` |  The text to base suggestion predictions off of |

**Returns:** `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)> &#124; `null`>
A list of the predicted suggestion objects

___
<a id="reportchosensuggestion"></a>

####  reportChosenSuggestion

▸ **reportChosenSuggestion**(seedText: *`string`*, displayedSuggestions: *[SuggestionMeta](../interfaces/_main_.suggestionmeta.md)[]*, chosenSuggestion: *[SuggestionMeta](../interfaces/_main_.suggestionmeta.md)*, currentContext: *`string`*): `Promise`<`void`>

*Defined in [main.ts:83](https://github.com/PointMail/point-api/blob/1073414/src/main.ts#L83)*

Tell the PointApi what suggestion was chosen to improve its model

**Parameters:**

| Param | Type |
| ------ | ------ |
| seedText | `string` |
| displayedSuggestions | [SuggestionMeta](../interfaces/_main_.suggestionmeta.md)[] |
| chosenSuggestion | [SuggestionMeta](../interfaces/_main_.suggestionmeta.md) |
| currentContext | `string` |

**Returns:** `Promise`<`void`>
___
<a id="setcontext"></a>

####  setContext

▸ **setContext**(pastContext: *`string`*, contextType: *`string`*): `Promise`<`string`>

*Defined in [main.ts:102](https://github.com/PointMail/point-api/blob/1073414/src/main.ts#L102)*

Set the context of the autocomplete session

**Parameters:**

| Param | Type |
| ------ | ------ |
| pastContext | `string` |
| contextType | `string` |

**Returns:** `Promise`<`string`>

___

<a id="suggestionmeta"></a>

### Object: SuggestionMeta

Suggestion with metadata recieved from Point

##### Type declaration

 suggestion: `string` The suggestion text

 type: `string` What kind of a suggestion it is (ie. `"suggestion"` is just text or `"calendar"` would be interactive)

 userAdded: `boolean` Whether a user manually added the suggestion to their profile

___


