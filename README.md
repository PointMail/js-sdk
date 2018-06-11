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

* [apiKey](_main_.pointapi.md#apikey)
* [emailAddress](_main_.pointapi.md#emailaddress)
* [socket](_main_.pointapi.md#socket)
* [suggestions](_main_.pointapi.md#suggestions)

### Methods

* [searchSuggestions](_main_.pointapi.md#searchsuggestions)

---

###  constructor
<a id="constructor"></a>

**new PointApi**(emailAddress: *`string`*, apiKey: *`string`*): [PointApi](_main_.pointapi.md)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| emailAddress | `string` |  Email address of Point user |
| apiKey | `string` |  API key of Point client |

**Returns:** [PointApi](_main_.pointapi.md)

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

**● suggestions**: *`Array`<[SuggestionMeta](../modules/_main_.md#suggestionmeta)>*

List of suggestions recieved from last query

___

## Methods

<a id="searchsuggestions"></a>

###  searchSuggestions

▸ **searchSuggestions**(seedText: *`string`*): `Promise`< `Array`<[SuggestionMeta](../modules/_main_.md#suggestionmeta)> &#124; `null`>

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| seedText | `string` |  The text to base suggestion predictions off of |

**Returns:** `Promise`< `Array`<[SuggestionMeta](../modules/_main_.md#suggestionmeta)> &#124; `null`>
A list of the predicted suggestion objects

___


