const assert = require('node:assert/strict');
const { test } = require('node:test');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { InMemoryTransport } = require('@modelcontextprotocol/sdk/inMemory.js');
const setupServer = require('../dist/transports/setup_server.js').default;

// Test the wire response, rather than a copy of the registration source.
// No tools are called: no API key, browser session, or paid credits are needed.
test('tools/list exposes explicit safety hints for every registered tool', async () => {
  const server = new McpServer({ name: 'annotation-test', version: '1' }, { capabilities: { resources: {} } });
  setupServer(server);
  const client = new Client({ name: 'annotation-test-client', version: '1' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    const { tools } = await client.listTools();
    assert.equal(tools.length, 10);
    const readers = new Set(['scrape_webpage', 'crawl_webpages', 'extract_structured_data', 'search_with_bing', 'list_profiles']);
    const agents = new Set(['browser_use_agent', 'openai_computer_use_agent', 'claude_computer_use_agent']);
    const known = new Set([...readers, ...agents, 'create_profile', 'delete_profile']);
    for (const tool of tools) {
      assert.ok(known.has(tool.name), `Classify new tool ${tool.name} explicitly`);
      const hints = tool.annotations;
      assert.ok(hints, `${tool.name} has no annotations`);
      assert.ok(typeof hints.title === 'string' && hints.title.trim().length, `${tool.name} needs a title`);
      for (const key of ['readOnlyHint', 'destructiveHint', 'openWorldHint', 'idempotentHint']) {
        assert.equal(typeof hints[key], 'boolean', `${tool.name}.${key} must be explicit`);
      }
      assert.equal(hints.readOnlyHint, readers.has(tool.name), tool.name);
      assert.equal(hints.destructiveHint, agents.has(tool.name) || tool.name === 'delete_profile', tool.name);
      assert.equal(hints.openWorldHint, tool.name !== 'list_profiles' && tool.name !== 'create_profile' && tool.name !== 'delete_profile', tool.name);
      assert.equal(hints.idempotentHint, readers.has(tool.name), tool.name);
    }
  } finally {
    await client.close();
    await server.close();
  }
});
