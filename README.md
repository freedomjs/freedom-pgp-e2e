uproxy-end-to-end
=================

Wrapping up end-to-end code and provide in freedom custom API.


#### Build
If you want to build the full module (including the end-to-end
dependency) from scratch, then:

- Grab all node modules necessary for the build (npm install)

- Ensure you have dependencies for building end-to-end (unzip, svn,
  Python 2.X, Java >= 1.7)

- grunt getEndToEnd

Note - this grunt task will be pulling from various repositories to
build end-to-end. You'll see quite a few things flying by, and may
need to accept certificates for *.googlecode.com. It may also have
warnings on repeated runs as paths/files will already exist - these
shouldn't be an issue, but check tests to be sure.

If you don't want to do a full build (for example, Java 1.7 isn't
available) then the normal flow is just npm install, and then the
following grunt options:

- grunt (default, will lint, copy, and run phantom tests)

- grunt test (will lint, copy, and run all tests)

- grunt demo (will lint, copy, and open a browser pointed at the demo
app)

