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

* [autocomplete](_main_.pointapi.md#autocomplete)
* [feedback](_main_.pointapi.md#feedback)
* [reply](_main_.pointapi.md#reply)
* [setContext](_main_.pointapi.md#setcontext)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new PointApi**(emailAddress: *`string`*, authCode: *`string`*, keywordSearch?: *`boolean`*): [PointApi](_main_.pointapi.md)

*Defined in [main.ts:44](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L44)*

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

*Defined in [main.ts:42](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L42)*

Auth Code key of Point client

___
<a id="emailaddress"></a>

###  emailAddress

**● emailAddress**: *`string`*

*Defined in [main.ts:40](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L40)*

Email address of Point user

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`Socket`*

*Defined in [main.ts:44](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L44)*

___

## Methods

<a id="autocomplete"></a>

###  autocomplete

▸ **autocomplete**(seedText: *`string`*, currentContext?: * `undefined` &#124; `string`*): `Promise`< [SuggestionsResponse](../interfaces/_main_.suggestionsresponse.md) &#124; `null`>

*Defined in [main.ts:72](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L72)*

Query PointApi with seed text to get predicted suggestions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| seedText | `string` |  The text to base suggestion predictions off of |
| `Optional` currentContext |  `undefined` &#124; `string`|

**Returns:** `Promise`< [SuggestionsResponse](../interfaces/_main_.suggestionsresponse.md) &#124; `null`>
A list of the predicted suggestion objects

___
<a id="feedback"></a>

###  feedback

▸ **feedback**(responseId: *`string`*, suggestion: *[SuggestionMeta](../interfaces/_main_.suggestionmeta.md)*, type: * "positive" &#124; "negative"*): `Promise`<`void`>

*Defined in [main.ts:97](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L97)*

Give feedback on Point Api's suggestions

**Parameters:**

| Param | Type |
| ------ | ------ |
| responseId | `string` |
| suggestion | [SuggestionMeta](../interfaces/_main_.suggestionmeta.md) |
| type |  "positive" &#124; "negative"|

**Returns:** `Promise`<`void`>

___
<a id="reply"></a>

###  reply

▸ **reply**(pastContext: *`string`*, contextType?: *[ContextTypes](../modules/_main_.md#contexttypes)*): `Promise`< [ReplyResponse](../interfaces/_main_.replyresponse.md) &#124; `null`>

*Defined in [main.ts:132](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L132)*

Get reply suggestions given some recieved text

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| pastContext | `string` | - |
| `Default value` contextType | [ContextTypes](../modules/_main_.md#contexttypes) | &quot;text&quot; |

**Returns:** `Promise`< [ReplyResponse](../interfaces/_main_.replyresponse.md) &#124; `null`>

___
<a id="setcontext"></a>

###  setContext

▸ **setContext**(pastContext: *`string`*, contextType?: *[ContextTypes](../modules/_main_.md#contexttypes)*): `Promise`<`string`>

*Defined in [main.ts:115](https://github.com/PointMail/point-api/blob/d0fa166/src/main.ts#L115)*

Set the context of the autocomplete session

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| pastContext | `string` | - |
| `Default value` contextType | [ContextTypes](../modules/_main_.md#contexttypes) | &quot;text&quot; |

**Returns:** `Promise`<`string`>

___

