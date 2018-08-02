
✍ Point AutoSuggest JS API
==========================

> The Point AutoSuggest package provides an easy client and serverside frontend for the Point API

Setup:
------

*   Clone repo
*   `cd point-api`
*   `npm install`
*   For development, you might need to `npm link` too so you can access the package from other projects
*   You're done! (`npm test` should pass all tests)

Usage:
------

To query suggestions given some seed text:

```js
const api = new PointApi("<user_email>", "<api_key>");
// A websockets connection is automatically established on api init

api.searchSuggestions("Hey")
// {{suggestion: "Hey, how are you?", "type": "suggestion", "userAdded": false}, ...}
```

A reference autocomplete dropdown implementation can be found [here](https://github.com/PointMail/point-dropdown-react)

Documentation
-------------

### Class: PointApi

Point Websockets Api Instance

*   [constructor](README.md#constructor)

#### Properties

*   [apiKey](README.md#apikey)
*   [emailAddress](README.md#emailaddress)
*   [socket](README.md#socket)
*   [suggestions](README.md#suggestions)

#### Methods

*   [searchSuggestions](README.md#searchsuggestions)

* * *

#### constructor

**new PointApi**(emailAddress: _`string`_, apiKey: _`string`_): [PointApi](README.md)

**Parameters:**

Param

Type

Description

emailAddress

`string`

Email address of Point user

apiKey

`string`

API key of Point client

**Returns:** [PointApi](README.md)

* * *

### Properties

#### apiKey

**● apiKey**: _`string`_

API key of Point client

* * *

#### emailAddress

**● emailAddress**: _`string`_

Email address of Point user

* * *

#### suggestions

**● suggestions**: _`Array`<[SuggestionMeta](README.md#suggestionmeta)>_

List of suggestions recieved from last query

* * *

### Methods

#### searchSuggestions

▸ **searchSuggestions**(seedText: _`string`_): `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)\> | `null`>

Query PointApi with seed text to get predicted suggestions

**Parameters:**

Param

Type

Description

seedText

`string`

The text to base suggestion predictions off of

**Returns:** `Promise`< `Array`<[SuggestionMeta](README.md#suggestionmeta)\> | `null`\> A list of the predicted suggestion objects

* * *

### Object: SuggestionMeta

Suggestion with metadata recieved from Point

##### Type declaration

suggestion: `string` The suggestion text

type: `string` What kind of a suggestion it is (ie. `"suggestion"` is just text or `"calendar"` would be interactive)

userAdded: `boolean` Whether a user manually added the suggestion to their profile

* * *

## Index

### External modules

* ["index"](modules/_index_.md)
* ["main"](modules/_main_.md)

---

