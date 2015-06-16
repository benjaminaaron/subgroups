var prompt = require('prompt');


  prompt.start();
  

  prompt.get(['this', 'that'], function (err, result) {

    console.log('this: ' + result.this);
    console.log('that: ' + result.that);

  });