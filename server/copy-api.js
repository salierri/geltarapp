const fs = require('fs');

if(fs.existsSync('../client/src/')) {
  fs.copyFile('lib/api.d.ts', '../client/src/api.ts', (err) => {
    if (err) {
      throw err;
    }
  });
}
