let ghPages = require('gh-pages');

ghPages.publish('build', function (err) {
  if (!err) console.log('Published!');
  else console.error(err);
});