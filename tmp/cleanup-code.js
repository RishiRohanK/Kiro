const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const DIRECTORIES = ['app', 'lib', 'prisma', 'chat-server'];
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.prisma'];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else {
            if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
                results.push(file);
            }
        }
    });
    return results;
}

function removeCommentsFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    try {
        let stripped;
        if (filePath.endsWith('.prisma')) {
            stripped = content.replace(/\/\/\/.*|\/\/.*$/gm, '');
        } else {
            stripped = strip(content, { preserveNewlines: true });
        }
        
        if (content !== stripped) {
           fs.writeFileSync(filePath, stripped, 'utf8');
           console.log(`Cleaned: ${path.relative(process.cwd(), filePath)}`);
        }
    } catch (err) {
        console.error(`Error stripping ${filePath}:`, err.message);
    }
}

// Check root files too
const rootFiles = fs.readdirSync(process.cwd())
    .filter(f => FILE_EXTENSIONS.some(ext => f.endsWith(ext)))
    .map(f => path.resolve(process.cwd(), f));

const allFiles = [...rootFiles, ...DIRECTORIES.flatMap(d => {
    const dirPath = path.resolve(process.cwd(), d);
    return fs.existsSync(dirPath) ? walk(dirPath) : [];
})];

console.log(`Files to process: ${allFiles.length}`);
allFiles.forEach(removeCommentsFromFile);
console.log('--- Operation Complete ---');
