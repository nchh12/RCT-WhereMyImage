const fs = require('fs');
const path = process.argv[1];
const rootPath = path.slice(0, path.lastIndexOf('/') + 1);

fs.readFile(rootPath + 'labels.txt', 'utf8', (error, res) => {
    if (error) {
        console.log('Error', error);
        return;
    }
    const lines = res.split('\n');
    const obj = {};
    obj.list = lines.map(item => {
        const elements = item.split('\t');
        return elements[1];
    });
    fs.writeFile(rootPath + 'labels.json', JSON.stringify(obj), 'utf8', error => {
        if (error) {
            console.log('Error', error);
            return;
        }
    });
});
