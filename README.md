# ✍ Point AutoSuggest JS API
> The Point AutoSuggest package provides an easy client and serverside frontend for the Point API

## Setup:

* Clone repo
* `cd point-api`
* `npm install` 
* For development, you might need to `npm link` too so you can access the package from other projects
* You're done! (`npm test` should pass all tests)

## Usage:
To query suggestions given some seed text:
```js
const api = new PointApi("<user_email>", "<auth_code>");
// A websockets connection is automatically established on api init

api.searchSuggestions("Hey");
// {{suggestion: "Hey, how are you?", "type": "suggestion", "userAdded": false}, ...}

// You can also set the past context to augment recieved suggestions 
api.setContext("Hey Alex, when can you send me the slide deck?", "plaintext");
api.searchSuggestions("i can");
// {{suggestion: "I can get it to you this afternoon.", ...}}

```
*A reference autocomplete dropdown implementation can be found [here](https://github.com/PointMail/point-dropdown-react)*  
  
  
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

Auth Code key of Point client

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


