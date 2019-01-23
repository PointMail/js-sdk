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

⊕ **new PointApi**(emailAddress: *`string`*, authCode: *`string`*, searchType?: *`boolean`*): [PointApi](_main_.pointapi.md)

*Defined in [main.ts:49](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L49)*

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| emailAddress | `string` | - |  Email address of Point user |
| authCode | `string` | - |  Auth code of Point client |
| `Default value` searchType | `boolean` | false |

**Returns:** [PointApi](_main_.pointapi.md)

___

## Properties

<a id="authcode"></a>

###  authCode

**● authCode**: *`string`*

*Defined in [main.ts:47](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L47)*

Auth Code key of Point client

___
<a id="emailaddress"></a>

###  emailAddress

**● emailAddress**: *`string`*

*Defined in [main.ts:45](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L45)*

Email address of Point user

___
<a id="socket"></a>

### `<Private>` socket

**● socket**: *`Socket`*

*Defined in [main.ts:49](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L49)*

___

## Methods

<a id="autocomplete"></a>

###  autocomplete

▸ **autocomplete**(seedText: *`string`*, currentContext?: * `undefined` &#124; `string`*): `Promise`< [SuggestionsResponse](../interfaces/_main_.suggestionsresponse.md) &#124; `null`>

*Defined in [main.ts:77](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L77)*

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

▸ **feedback**(responseId: *`string`*, suggestion: * `string` &#124; `string`[]*, type: * "positive" &#124; "negative"*): `Promise`<`void`>

*Defined in [main.ts:102](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L102)*

Give feedback on Point Api's suggestions

**Parameters:**

| Param | Type |
| ------ | ------ |
| responseId | `string` |
| suggestion |  `string` &#124; `string`[]|
| type |  "positive" &#124; "negative"|

**Returns:** `Promise`<`void`>

___
<a id="reply"></a>

###  reply

▸ **reply**(previousMessage: *`string`*, contextType?: *[ContextType](../modules/_main_.md#contexttype)*): `Promise`< [ReplyResponse](../interfaces/_main_.replyresponse.md) &#124; `null`>

*Defined in [main.ts:137](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L137)*

Get reply suggestions given some recieved text

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| previousMessage | `string` | - |
| `Default value` contextType | [ContextType](../modules/_main_.md#contexttype) | &quot;text&quot; |

**Returns:** `Promise`< [ReplyResponse](../interfaces/_main_.replyresponse.md) &#124; `null`>

___
<a id="setcontext"></a>

###  setContext

▸ **setContext**(previousMessage: *`string`*, contextType?: *[ContextType](../modules/_main_.md#contexttype)*): `Promise`<`string`>

*Defined in [main.ts:120](https://github.com/PointMail/point-api/blob/d8bea08/src/main.ts#L120)*

Set the context of the autocomplete session

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| previousMessage | `string` | - |
| `Default value` contextType | [ContextType](../modules/_main_.md#contexttype) | &quot;text&quot; |

**Returns:** `Promise`<`string`>

___

