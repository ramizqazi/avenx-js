const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execSync } = require('child_process');

const TEST_DIR = path.join(__dirname, 'test-project');
const BIN_PATH = path.join(__dirname, '../../bin/avenx.js');

function setup() {
    if (fs.existsSync(TEST_DIR)) {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIR);
}

function cleanup() {
    if (fs.existsSync(TEST_DIR)) {
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
}

function runTest() {
    console.log('🧪 Testing avenx init...');

    try {
        setup();

        // Run the init command in the test directory
        execSync(`node ${BIN_PATH} init`, { cwd: TEST_DIR });

        // Assertions
        const expectedPaths = [
            'src/components',
            'src/global',
            'dist',
            '.vscode',
            '.vscode/jsconfig.json',
            '.vscode/settings.json',
            'index.html',
            'src/main.app.js'
        ];

        expectedPaths.forEach(p => {
            const fullPath = path.join(TEST_DIR, p);
            assert.ok(fs.existsSync(fullPath), `Missing expected path: ${p}`);
            console.log(`  ✅ Found: ${p}`);
        });

        // Verify content of a template file
        const settings = JSON.parse(fs.readFileSync(path.join(TEST_DIR, '.vscode/settings.json'), 'utf-8'));
        assert.ok(settings['files.associations'], 'settings.json should have files.associations');
        assert.strictEqual(settings['files.associations']['*.component.js'], 'html', 'Association for *.component.js should be html');

        console.log('✅ All init tests passed!');

        console.log('🧪 Testing avenx build...');
        execSync(`node ${BIN_PATH} build`, { cwd: TEST_DIR });
        
        const bundleJsPath = path.join(TEST_DIR, 'dist/bundle.js');
        const bundleCssPath = path.join(TEST_DIR, 'dist/bundle.css');
        assert.ok(fs.existsSync(bundleJsPath), 'Missing bundle.js');
        assert.ok(fs.existsSync(bundleCssPath), 'Missing bundle.css');
        
        const bundleContent = fs.readFileSync(bundleJsPath, 'utf-8');
        assert.ok(bundleContent.includes('class HtmlEscaper'), 'bundle.js should contain HtmlEscaper');
        assert.ok(bundleContent.includes('class SafeHtml'), 'bundle.js should contain SafeHtml');
        assert.ok(bundleContent.includes('function html('), 'bundle.js should contain html function');
        
        console.log('✅ All build tests passed!');

    } catch (error) {
        console.error('❌ Test failed!');
        console.error(error);
        process.exit(1);
    } finally {
        cleanup();
    }
}

runTest();
