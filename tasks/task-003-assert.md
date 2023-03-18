# task-003-assert

This task is to implement 2 namespaces

- ASSERT - logs a message and throws an exception if an unexpected state happens
- ENSURE - logs a message and corrects a value if something unexpected happens

These are both exported from the interface module /modules/assert.js.  We will start
with a few tests and will add more ass needed.

A couple of tests are implemented in

<http://localhost:4263/app/test.html>

You can write more tests there.  Or wait for
a testing module coming in a few more tasks.

ASSERT is usually used to validate aguments

```text
import {ASSERT} from '/modules/assert.js'

function createPerson(name, age, address) {
    ASSERT.isType(name,'string', "createPerson requires a name");
    ASSERT.inRange(age,13,100,`createPerson age is invalid`, age);
    ASSERT.isType(address,Address,'createPerson address argument is not an Address');
    ASSERT.isTrue(address.isValid(),'createPerson address is not valid',address);
    //...
}
```

Note that inRange and isTrue pass a message string and age value as 2 parameters.
We don't want to combine these unless the assertion failes.  The assert methods
will combine message arguments if needed.  The last argument of assert functions should b "...message"
and a displayable message is created from it if needed.

ENSURE implements most of the same tests as ASSERT, but returns a valid value instead of throwing an exception.
There are 2 uses for ENSURE

- prototypes/demos:  it needs to work even though something is wrong.  Usually you should have a test on ENV.isDebug and ENSURE in debug mode but ASSERT in prod.
- production: even though something is wrong, there is a way to continue.  For example a percent value that should be 0-100 is 101 or a color value is null.  

```text
import {ENSURE} from '/modules/assert.js'

function createPerson(name, age, address) {
    name = ENSURE.isType(name,'string','fred', 'createPerson requires a name');
    age = ENSURE.inRange(age,13,100,50,`createPerson age is invalid`, age);
    address = ENSURE.isType(address,Address,()=>createEmptyAddress(),
                    'createPerson address argument is not an Address');
    address = ENSURE.isTrue(address.isValid(),()=>createEmptyAddress(),
                    'createPerson address argument is not valid',address);
    //...
}
```
