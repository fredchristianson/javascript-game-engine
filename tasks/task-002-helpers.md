# task-002-helpers

This task is to implement some helper functions. They are mostly
implemented as functions inside of primitive type namespaces.
For example:

- STRING.isEqualNoCase("abc","AbC")
- BOOLEAN.isTrue(booleanStringOrNumberValue)

Most are to be consistent about things are done. isObject returns false for Arrays even though their type is 'object'. And 'true' is considered a boolean true value while 0 is false.

A few are more complicated

- UTIL.join
- OBJECT.addNewProperties

These are used by importing the namespace from /modules/helpers.js

```text
import {STRING, TYPE} from '/modules/helpers.js'
if (STRING.isEqualNoCase("abc","aBC") && BOOLEAN.isTrue(test)) {
    //...
}
```
