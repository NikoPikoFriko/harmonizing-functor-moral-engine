/**
 * Remote MCP endpoint — POST/GET/DELETE https://<host>/api/mcp. Point a
 * connector (Gemini Enterprise's "Add MCP Server", Claude, etc.) at this URL
 * to reach the moral-engine tools in `src/lib/mcp/server.ts`.
 *
 * A fresh McpServer + WebStandardStreamableHTTPServerTransport is created per
 * request (stateless mode — no `sessionIdGenerator`): every tool is a pure
 * function, there is nothing to keep alive across requests, and serverless
 * hosting gives no guarantee two requests land on the same instance anyway.
 */
import { createFileRoute } from "@tanstack/react-router";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "@/lib/mcp/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, mcp-session-id, mcp-protocol-version, Last-Event-ID",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
};

function withCors(response: Response): Response {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

async function handleMcpRequest({ request }: { request: Request }): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport();
  const server = createMcpServer();
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  return withCors(response);
}

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      GET: handleMcpRequest,
      POST: handleMcpRequest,
      DELETE: handleMcpRequest,
      OPTIONS: async () => withCors(new Response(null, { status: 204 })),
    },
  },
});
