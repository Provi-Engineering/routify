import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';
import { dirname, resolve, sep } from "path";
import { fileURLToPath } from 'url';
import { createNodesFromFiles } from '../../../middleware/filemapper/lib/middlewares/createNodesFromFiles.js';
import { moveModuleToParentNode } from '../../../middleware/filemapper/lib/middlewares/fileToModule.js';
import { filenameToOptions } from '../../../middleware/filemapper/lib/middlewares/filenameToOptions.js';
import { readFileSync, writeFileSync } from 'fs';
import { setComponent } from '../../../middleware/filemapper/lib/middlewares/setComponent.js';
import filemapper from '../../../middleware/filemapper/lib/index.js';
import { Routify } from '../../../lib/Routify.js';



const __dirname = dirname(fileURLToPath(import.meta.url))

const options = {
    filemapper: {
        moduleFiles: ['_module.svelte', '_reset.svelte'],
        resetFiles: ['_reset.svelte'],
        routesDir: { default: `${__dirname}/example` }
    }
}


const instance = new Routify(options)

let rootNode = instance.createNode()
rootNode.rootName = 'default'

test('files are mapped', async () => {
    await createNodesFromFiles(rootNode, options.filemapper.routesDir.default)
    assert.equal(instance.nodeIndex.length, 13)
    assertSnapshot('1.filemap-only', rootNode.map, 0)
})

test('modules are merged with parent node', async () => {
    moveModuleToParentNode(rootNode)
    assert.equal(instance.nodeIndex.length, 11)
    assertSnapshot('2.filemap-with-modules', rootNode.map, 0)
})

test('options get added', async () => {
    filenameToOptions(rootNode)
    assertSnapshot('3.filemap-with-resets', rootNode.map, 0)
})

test('components get added', async () => {
    setComponent(rootNode)
    assertSnapshot('4.filemap-with-components', rootNode.map, 0)
})

test('filemapper', async () => {
    const instance = new Routify(options)
    await filemapper({ instance })
    assertSnapshot('4.filemap-with-components', instance.rootNode.children[0].map, 0)
})

test.run()

function assertSnapshot(name, content, update) {
    content = JSON.parse(JSON.stringify(content))
    const filepath = `${__dirname}/fixtures/${name}.json`
    if (update)
        writeFileSync(filepath, JSON.stringify(content, null, 2))
    const expect = JSON.parse(readFileSync(filepath, 'utf-8'))
    assert.equal(content, expect)
}