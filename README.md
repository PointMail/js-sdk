# point-api
Javascript API for Point autocomplete
***
### To Run:

* Clone repo
* `cd point-api`
* `npm install` 
* You're done! (`npm test` should pass all tests)

## Class: PointApi

Point Websockets Api Instance

* [constructor](README.md#constructor)

### Properties

* [apiKey](README.md#apikey)
* [emailAddress](README.md#emailaddress)
* [socket](README.md#socket)
* [suggestions](README.md#suggestions)

### Methods

* [searchSuggestions](README.md#searchsuggestions)

---

###  constructor
<a id="constructor"></a>

**new PointApi**(emailAddress: *`string`*, apiKey: *`string`*): [PointApi](README.md)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| emailAddress | `string` |  Email address of Point user |
| apiKey | `string` |  API key of Point client |

**Returns:** [PointApi](README.md)

___

## Properties

<a id="apikey"></a>

###  apiKey

**● apiKey**: *`string`*

API key of Point client

___
<a id="emailaddress"></a>

###  emailAddress

**● emailAddress**: *`string`*

Email address of Point user

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`Socket`*

___
<a id="suggestions"></a>

###  suggestions

**● suggestions**: *`Array`<[SuggestionMeta](README.md#suggestionmeta)>*

List of suggestions recieved from last query

___

## Methods

<a id="searchsuggestions"></a>

###  searchSuggestions

▸ **searchSuggestions**(seedText: *`string`*): `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)> &#124; `null`>

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| seedText | `string` |  The text to base suggestion predictions off of |

**Returns:** `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)> &#124; `null`>
A list of the predicted suggestion objects

___

<a id="suggestionmeta"></a>

## Object: SuggestionMeta

Suggestion with metadata recieved from Point

#### Type declaration

 suggestion: `string`

 type: `string`

 userAdded: `boolean`

___


