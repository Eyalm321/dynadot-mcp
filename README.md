# Dynadot MCP

Model Context Protocol server for the [Dynadot RESTful API v2](https://www.dynadot.com/domain/api-document). Lets Claude (or any MCP client) manage your Dynadot domains, DNS, contacts, nameservers, folders, marketplace listings, auctions, site builder, and email hosting.

## Tools

The server exposes tools across the following Dynadot API surface areas:

- **Domains** — search, bulk-search, suggestions, register, renew, transfer-in, delete (grace / post-grace), restore, list, get info, appraisal, TLD price, forwarding (regular / stealth / email), renew option, contacts, folder, lock, transfer status / auth code, nameservers, hosting, parking, privacy, DNSSEC, DNS records, push / accept-push, notes
- **Contacts** — CRUD plus TLD-specific settings (.AERO, .CA, .EU, .FR, .HK, .IE, .IT, .LT, .LV, .MUSIC, .NO, .PT, .RO, .US) and the .CN audit flow
- **Nameservers** — register glue / external NS, set IP, list, delete
- **Orders** — get status, history, cancel transfer, authorize transfer-away, set transfer auth code
- **Account** — get info, default nameservers / forwarding / email-forwarding / contacts / parking / hosting / renew option / DNS, clear defaults, account lock, list coupons
- **Folders** — list, create, delete, rename, apply DNS / nameservers / contacts / parking / forwarding (regular / stealth / email) / hosting / renew option, clear settings
- **Aftermarket / Marketplace** — list for sale, Buy-It-Now, expired closeout, backorders, open / closed auctions, place bid, bid history, installment plans, express-pay links, list on Afternic / Sedo, listings, WHOIS stats
- **TLDs** — get TLD pricing
- **Services** — site builder (get / list / create / upgrade), email hosting (create / list / upgrade / delete)

All tool names are prefixed `dynadot_`.

## Install

### From npm

```bash
npm install -g dynadot-mcp
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
      "args": ["-y", "dynadot-mcp"],
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
