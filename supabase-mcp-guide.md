# Supabase MCP Configuration Guide (Comments-Store)

This project is a clone with its own independent Supabase backend.

## 1. Project Identity
- **Project ID**: `vkpwvzkefsfbnfozdorx`
- **Region**: US-East

## 2. Local MCP Setup
To enable AI management for this specific store, add this to your MCP configuration:

```json
{
  "mcpServers": {
    "supabase-clone": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_1fcbeb876d9b5e3309f115a78ae2a8b6e4d3e09a"
      }
    }
  }
}
```

## 3. Capability
This allows the AI to manage the independent `comments` table and RLS policies specific to the `Comments-Store` project.
