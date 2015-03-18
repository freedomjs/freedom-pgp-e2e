freedom-pgp-e2e
=================
[![Build Status](https://travis-ci.org/freedomjs/freedom-pgp-e2e.svg?branch=master)](https://travis-ci.org/freedomjs/freedom-pgp-e2e)[![Build Status](https://api.shippable.com/projects/54c823bf5ab6cc135289fbec/badge?branchName=master)](https://app.shippable.com/projects/54c823bf5ab6cc135289fbec/builds/latest)

Wrapping up [end-to-end code](https://github.com/google/end-to-end)
and providing PGP crypto functionality in a freedom custom API.

#### Build
The normal flow is just npm install, and then the
following grunt options:

- grunt (default, will lint, copy, and run phantom tests)

- grunt test (will lint, copy, and run all tests)

- grunt demo (will lint, copy, and open a browser pointed at the demo
app)
