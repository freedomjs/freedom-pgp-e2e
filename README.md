uproxy-end-to-end
=================

Wrapping up end-to-end code and provide in freedom custom API.


#### Build
- Grab all node modules necessary for the build
  npm install

- Grab end-to-end code

  git clone https://code.google.com/p/end-to-end.build/

- Perform end-to-end build. In case of difficulty, please refer to https://code.google.com/p/end-to-end/.

  cd end-to-end.build/

  ./do.sh install_deps

  ./do.sh build_library  

  The above process will install all necessary dependency, and build the compiled js binary (don't be fooled by the term if you are new to Closure, it is still js code). 

- Perform normal Grunt build

  grunt


#### Test

A sample chrome app is prepared to show the usage of end-to-end api. After build, just load "build/samples/chrome-app" to chrome.


