# task-004-loggong

This task is to implement the empty methods in /modules/logging/logger.js.
There is a lot of other logging functionality already implemented.  You can read the
jsdocs and try to implement any of the other logging files.

For a simpler task, don't worry about any of the other logging features and
just write to the browser console.  This should write 6 messages to the console

```javascript
import {createLogger} from '/modules/logging.js';
const log = createLogger("moduleName",LOGLEVEL.DEBUG);
log.debug("this is a debug message");
log.info("this is", "an information","message");
log.warn("a warning message",{a:1,b:2});
log.error("an error.");
log.assert("message that an assertion failed",ex);
log.always("this will always be logged.");
log.never("this will never be logged");
```

You can test the implementation with the "Logging" button at

<http://localhost:4263/app/test.html>
