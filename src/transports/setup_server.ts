import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  oaiCuaTool,
  oaiCuaToolDescription,
  oaiCuaToolName,
} from "../tools/oai-cua";
import {
  browserUseTool,
  browserUseToolDescription,
  browserUseToolName,
} from "../tools/browser-use";
import {
  crawlWebpagesTool,
  crawlWebpagesToolDescription,
  crawlWebpagesToolName,
} from "../tools/crawl-webpages";
import {
  extractStructuredDataTool,
  extractStructuredDataToolDescription,
  extractStructuredDataToolName,
} from "../tools/extract-structured";
import {
  scrapeWebpageTool,
  scrapeWebpageToolDescription,
  scrapeWebpageToolName,
} from "../tools/scrape-webpage";
import {
  bingSearchToolParamSchemaRaw,
  browserUseToolParamSchemaRaw,
  claudeComputerUseToolParamSchemaRaw,
  crawlWebpagesToolParamSchemaRaw,
  extractStructuredDataToolParamSchemaRaw,
  oaiCuaToolParamSchemaRaw,
  scrapeWebpageToolParamSchemaRaw,
} from "../tools/tool-types";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  listAllResources,
  getResource,
} from "../resources/static/get_resources";
import {
  claudeComputerUseTool,
  claudeComputerUseToolDescription,
  claudeComputerUseToolName,
} from "../tools/claude-computer-use";
import {
  bingSearchTool,
  bingSearchToolDescription,
  bingSearchToolName,
} from "../tools/bing-search";
// Import new profile tools
import {
  createProfileTool,
  createProfileToolDescription,
  createProfileToolName,
} from "../tools/create-profile";
import {
  deleteProfileTool,
  deleteProfileToolDescription,
  deleteProfileToolName,
} from "../tools/delete-profile";
import {
  listProfilesTool,
  listProfilesToolDescription,
  listProfilesToolName,
} from "../tools/list-profiles";
// Import new profile tool schemas (create schema is empty object)
import {
  deleteProfileToolParamSchemaRaw,
  listProfilesToolParamSchemaRaw,
} from "../tools/tool-types";


function setupServer(server: McpServer) {
  // Existing tools
  server.tool(
    scrapeWebpageToolName,
    scrapeWebpageToolDescription,
    scrapeWebpageToolParamSchemaRaw,
    {
      title: "Scrape webpage",
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: true,
      idempotentHint: true
    },
    scrapeWebpageTool
  );
  server.tool(
    crawlWebpagesToolName,
    crawlWebpagesToolDescription,
    crawlWebpagesToolParamSchemaRaw,
    {
      title: "Crawl webpages",
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: true,
      idempotentHint: true
    },
    crawlWebpagesTool
  );
  server.tool(
    extractStructuredDataToolName,
    extractStructuredDataToolDescription,
    extractStructuredDataToolParamSchemaRaw,
    {
      title: "Extract structured data",
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: true,
      idempotentHint: true
    },
    extractStructuredDataTool
  );
  server.tool(
    browserUseToolName,
    browserUseToolDescription,
    browserUseToolParamSchemaRaw,
    {
      title: "Run browser agent",
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: true,
      idempotentHint: false
    },
    browserUseTool
  );
  server.tool(
    oaiCuaToolName,
    oaiCuaToolDescription,
    oaiCuaToolParamSchemaRaw,
    {
      title: "Run OpenAI computer-use agent",
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: true,
      idempotentHint: false
    },
    oaiCuaTool
  );

  server.tool(
    claudeComputerUseToolName,
    claudeComputerUseToolDescription,
    claudeComputerUseToolParamSchemaRaw,
    {
      title: "Run Claude computer-use agent",
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: true,
      idempotentHint: false
    },
    claudeComputerUseTool
  );

  server.tool(
    bingSearchToolName,
    bingSearchToolDescription,
    bingSearchToolParamSchemaRaw,
    {
      title: "Search with Bing",
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: true,
      idempotentHint: true
    },
    bingSearchTool
  );

  // Register new profile tools
  server.tool(
    createProfileToolName,
    createProfileToolDescription,
    {}, // createProfileToolParamSchemaRaw is just an empty object
    {
      title: "Create profile",
      readOnlyHint: false,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: false
    },
    createProfileTool
  );
  server.tool(
    deleteProfileToolName,
    deleteProfileToolDescription,
    deleteProfileToolParamSchemaRaw,
    {
      title: "Delete profile",
      readOnlyHint: false,
      destructiveHint: true,
      openWorldHint: false,
      idempotentHint: false
    },
    deleteProfileTool
  );
  server.tool(
    listProfilesToolName,
    listProfilesToolDescription,
    listProfilesToolParamSchemaRaw,
    {
      title: "List profiles",
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
      idempotentHint: true
    },
    listProfilesTool
  );


  server.server.setRequestHandler(ListResourcesRequestSchema, listAllResources);
  server.server.setRequestHandler(ReadResourceRequestSchema, getResource);
}

export default setupServer;
