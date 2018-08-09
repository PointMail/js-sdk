[@point-api/js-sdk](../README.md) > ["main"](../modules/_main_.md) > [PointApi](../classes/_main_.pointapi.md)

# Class: PointApi

Point Websockets Api Instance

## Hierarchy

**PointApi**

## Index

### Constructors

* [constructor](_main_.pointapi.md#constructor)

### Properties

* [authCode](_main_.pointapi.md#authcode)
* [emailAddress](_main_.pointapi.md#emailaddress)
* [socket](_main_.pointapi.md#socket)

### Methods

* [getReplies](_main_.pointapi.md#getreplies)
* [reportChosenSuggestion](_main_.pointapi.md#reportchosensuggestion)
* [searchSuggestions](_main_.pointapi.md#searchsuggestions)
* [setContext](_main_.pointapi.md#setcontext)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new PointApi**(emailAddress: *`string`*, authCode: *`string`*, keywordSearch?: *`boolean`*): [PointApi](_main_.pointapi.md)

*Defined in [main.ts:40](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L40)*

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| emailAddress | `string` | - |  Email address of Point user |
| authCode | `string` | - |  Auth code of Point client |
| `Default value` keywordSearch | `boolean` | false |

**Returns:** [PointApi](_main_.pointapi.md)

___

## Properties

<a id="authcode"></a>

###  authCode

**● authCode**: *`string`*

*Defined in [main.ts:38](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L38)*

Auth Code key of Point client

___
<a id="emailaddress"></a>

###  emailAddress

**● emailAddress**: *`string`*

*Defined in [main.ts:36](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L36)*

Email address of Point user

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`Socket`*

*Defined in [main.ts:40](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L40)*

___

## Methods

<a id="getreplies"></a>

###  getReplies

▸ **getReplies**(pastContext: *`string`*, contextType: *`string`*): `Promise`< [ReplyMeta](../interfaces/_main_.replymeta.md)[] &#124; `null`>

*Defined in [main.ts:126](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L126)*

Get reply suggestions given some recieved text

**Parameters:**

| Param | Type |
| ------ | ------ |
| pastContext | `string` |
| contextType | `string` |

**Returns:** `Promise`< [ReplyMeta](../interfaces/_main_.replymeta.md)[] &#124; `null`>

___
<a id="reportchosensuggestion"></a>

###  reportChosenSuggestion

▸ **reportChosenSuggestion**(seedText: *`string`*, displayedSuggestions: *[SuggestionMeta](../interfaces/_main_.suggestionmeta.md)[]*, chosenSuggestion: *[SuggestionMeta](../interfaces/_main_.suggestionmeta.md)*, currentContext: *`string`*): `Promise`<`void`>

*Defined in [main.ts:93](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L93)*

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
<a id="searchsuggestions"></a>

###  searchSuggestions

▸ **searchSuggestions**(seedText: *`string`*, currentContext?: * `undefined` &#124; `string`*): `Promise`< [SuggestionMeta](../interfaces/_main_.suggestionmeta.md)[] &#124; `null`>

*Defined in [main.ts:68](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L68)*

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| seedText | `string` |  The text to base suggestion predictions off of |
| `Optional` currentContext |  `undefined` &#124; `string`|

**Returns:** `Promise`< [SuggestionMeta](../interfaces/_main_.suggestionmeta.md)[] &#124; `null`>
A list of the predicted suggestion objects

___
<a id="setcontext"></a>

###  setContext

▸ **setContext**(pastContext: *`string`*, contextType: *`string`*): `Promise`<`string`>

*Defined in [main.ts:112](https://github.com/PointMail/point-api/blob/91b8ebf/src/main.ts#L112)*

Set the context of the autocomplete session

**Parameters:**

| Param | Type |
| ------ | ------ |
| pastContext | `string` |
| contextType | `string` |

**Returns:** `Promise`<`string`>

___

