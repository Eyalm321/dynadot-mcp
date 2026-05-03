# Dynadot MCP

Model Context Protocol server for the [Dynadot v3 API](https://www.dynadot.com/domain/api-document) (`api3.json`). Lets Claude (or any MCP client) manage your Dynadot domains, DNS, contacts, nameservers, folders, and the aftermarket.

## Tools

The server exposes tools across the following Dynadot API surface areas:

- **Domains** — search (single / bulk), register (single / bulk), renew, transfer-in, delete (grace), restore, list, get info, appraisal, lock, forwarding (HTTP / stealth / email), renew option, WHOIS contacts, folder, nameservers, hosting, parking, privacy, DNSSEC, DNS records (set/get/clear), push (request / send), notes, transfer status / auth code
- **Contacts** — CRUD plus EU / LT / LV TLD-specific settings, and the .CN audit flow
- **Nameservers** — register, add, set IP, list, delete (single / by-domain)
- **Orders** — list, get status, processing check, cancel transfer, authorize transfer-away, set transfer auth code
- **Account** — info, balance, default WHOIS / nameservers / parking / forwarding / stealth / hosting / renew option / DNS / email-forward, clear defaults, list coupons
- **Folders** — list, create, delete, rename, apply WHOIS / nameservers / parking / forwarding / stealth / hosting / DNS / email-forward / renew option, clear settings
- **Aftermarket** — backorders (add / delete / list), expired-domain auctions (open / closed / details / bids / place bid), backorder auctions, expired closeout (list / buy), public marketplace listings (browse / get item / Buy-It-Now), set-for-sale, Afternic / Sedo confirmations
- **TLDs** — pricing

All tool names are prefixed `dynadot_`. Domain names passed to any tool are automatically punycoded for IDN support (`krämer.ai` → `xn--krmer-hra.ai`).

> **Note on auctions**: The auction-related endpoints (`get_open_auctions`, `place_auction_bid`, etc.) require Dynadot to grant your account auction-API access. Without it, those calls return 403 — contact Dynadot support to enable.

## Install

### From npm

```bash
npm install -g dynadot-mcp-server
```

### From GitHub Packages

```bash
npm install -g @eyalm321/dynadot-mcp --registry=https://npm.pkg.github.com
```

## Configuration

Set the API key as an environment variable:

```bash
export DYNADOT_API_KEY=your_api_key_here
```

Get an API key from the [Dynadot API Settings](https://www.dynadot.com/account/domain/setting/api.html) page.

## Use with Claude Desktop / Claude Code

Add to your MCP client config:

```json
{
  "mcpServers": {
    "dynadot": {
      "command": "npx",
      "args": ["-y", "dynadot-mcp-server"],
      "env": {
        "DYNADOT_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Development

```bash
npm install
npm run build
npm test
```

Run the server against your local build:

```bash
DYNADOT_API_KEY=your_key node dist/index.js
```

## Releasing

Pushing to `main` runs CI (tests + build on Node 20 and 22). Publishing to npm and GitHub Packages happens when a GitHub Release is published — bump the version in `package.json`, tag, and create a release; the `Publish` workflow takes it from there.

## License

MIT
