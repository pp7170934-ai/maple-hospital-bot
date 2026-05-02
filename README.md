# Maple Hospital Discord Bot

A Discord bot for Maple Hospital with Roblox moderation commands.

---

## Commands

| Command | Who Can Use | Description |
|---|---|---|
| `/ban [robloxuser] [reason]` | Admin, Owner, Highest Rank | Bans user from the game |
| `/kick [robloxuser] [reason]` | Admin, Owner, Highest Rank | Kicks user from the game |
| `/warn [robloxuser] [reason]` | Admin, Owner, Highest Rank | Warns a user |
| `/assign [robloxuser] [role]` | Admin, Owner, Highest Rank | Assigns a Roblox group rank |
| `/admin add [robloxuser] [discorduser]` | Owner, Highest Rank | Adds an admin |
| `/owner add [robloxuser] [discorduser]` | Highest Rank only | Adds an owner |
| `/moderation` | Admin, Owner, Highest Rank | Shows recent warns/kicks/bans |
| `/logs` | Owner, Highest Rank | Shows full action log |

---

## Setup

### Step 1 — Create a Discord Bot

1. Go to https://discord.com/developers/applications
2. Click **New Application** → name it "Maple Hospital"
3. Go to **Bot** tab → click **Add Bot**
4. Under **Token**, click **Reset Token** and copy it (this is your `DISCORD_BOT_TOKEN`)
5. Enable **Server Members Intent** under Privileged Gateway Intents
6. Go to **OAuth2 → URL Generator**
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Manage Roles`, `Kick Members`, `Ban Members`
   - Copy the URL and invite the bot to your server

### Step 2 — Get Your IDs

- **DISCORD_CLIENT_ID**: Found on the **General Information** page of your app
- **DISCORD_GUILD_ID**: Right-click your Discord server → **Copy Server ID** (enable Developer Mode in Discord settings first)
- **ROBLOX_UNIVERSE_ID**: Go to your game on Roblox → click the three dots → **Copy Universe ID**

### Step 3 — Set Up Roblox API Key

1. Go to https://create.roblox.com/credentials
2. Create a new API key with these permissions:
   - **Messaging Service API** — Universe Messaging Service: Publish
   - **User Restrictions API** — Universe User Restrictions: Read, Write
   - **DataStore API** (optional) — if you use DataStores
3. Add your Universe ID to the allowed experiences

### Step 4 — Add Roblox Script

1. Open Roblox Studio for your game
2. In **ServerScriptService**, create a new Script
3. Paste the contents of `roblox-scripts/BotHandler.lua`
4. Make sure **HTTP Requests** and **Messaging Service** are enabled in Game Settings → Security

---

## Deploying to Render

### Step 1 — Push to GitHub

Push this `discord-bot/` folder to a GitHub repository.

### Step 2 — Create a Render Service

1. Go to https://render.com and sign in
2. Click **New → Background Worker**
3. Connect your GitHub repo
4. Set:
   - **Root Directory**: `discord-bot` (if using the full repo)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Starter for 24/7 uptime — free tier sleeps)

### Step 3 — Add Environment Variables on Render

In your Render service, go to **Environment** and add:

| Key | Value |
|---|---|
| `DISCORD_BOT_TOKEN` | Your bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | Your application's client ID |
| `DISCORD_GUILD_ID` | Your Discord server ID |
| `ROBLOX_API_KEY` | `42ef6b23-e18c-4e1c-9d03-bc6ea14c0b3a` |
| `ROBLOX_UNIVERSE_ID` | Your Roblox universe/experience ID |

### Step 4 — Register Slash Commands

Once deployed, open the Render shell (or run locally with a `.env` file) and run:

```bash
npm run deploy
```

This registers all slash commands with your Discord server. You only need to do this once (or when you add new commands).

---

## Running Locally (for testing)

1. Copy `.env.example` to `.env` and fill in your values
2. Run `npm install`
3. Run `npm run deploy` to register commands
4. Run `npm start` to start the bot

---

## Notes

- The `/kick` command uses Roblox **MessagingService** — the player must currently be in-game for it to work
- The `/ban` command uses Roblox **OpenCloud User Restrictions API** — it permanently restricts the user from joining
- Warnings are stored in a local SQLite database (`data.db`)
- On Render free tier, the service may sleep after inactivity — upgrade to Starter ($7/mo) for 24/7 uptime
