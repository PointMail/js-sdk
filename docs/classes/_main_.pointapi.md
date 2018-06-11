[point-api](../README.md) > ["main"](../modules/_main_.md) > [PointApi](../classes/_main_.pointapi.md)

# Class: PointApi

Point Websockets Api Instance

## Hierarchy

**PointApi**

## Index

### Constructors

* [constructor](_main_.pointapi.md#constructor)

### Properties

* [apiKey](_main_.pointapi.md#apikey)
* [emailAddress](_main_.pointapi.md#emailaddress)
* [socket](_main_.pointapi.md#socket)
* [suggestions](_main_.pointapi.md#suggestions)

### Methods

* [searchSuggestions](_main_.pointapi.md#searchsuggestions)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new PointApi**(emailAddress: *`string`*, apiKey: *`string`*): [PointApi](_main_.pointapi.md)

*Defined in main.ts:31*

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

*Defined in main.ts:27*

API key of Point client

___
<a id="emailaddress"></a>

###  emailAddress

**● emailAddress**: *`string`*

*Defined in main.ts:25*

Email address of Point user

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`Socket`*

*Defined in main.ts:31*

___
<a id="suggestions"></a>

###  suggestions

**● suggestions**: *`Array`<[SuggestionMeta](../modules/_main_.md#suggestionmeta)>*

*Defined in main.ts:29*

List of suggestions recieved from last query

___

## Methods

<a id="searchsuggestions"></a>

###  searchSuggestions

▸ **searchSuggestions**(seedText: *`string`*): `Promise`< `Array`<[SuggestionMeta](../modules/_main_.md#suggestionmeta)> &#124; `null`>

*Defined in main.ts:67*

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| seedText | `string` |  The text to base suggestion predictions off of |

**Returns:** `Promise`< `Array`<[SuggestionMeta](../modules/_main_.md#suggestionmeta)> &#124; `null`>
A list of the predicted suggestion objects

___

