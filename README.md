# Maple Hospital Discord Bot

A moderation and role management bot for Maple Hospital.

## Setup

### 1. Create a Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application → Add a Bot
3. Copy the **Bot Token** and **Application/Client ID**
4. Enable **applications.commands** scope and **bot** scope
5. Invite the bot to your server

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id
RAILWAY_PUBLIC_DOMAIN=your-app.railway.app
```

### 3. Register Slash Commands

```bash
npm run deploy
```

### 4. Start the Bot

```bash
npm start
```

---

## Railway Deployment

1. Push this repo to GitHub
2. Connect the GitHub repo to Railway
3. Set the environment variables in Railway:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
   - `RAILWAY_PUBLIC_DOMAIN` (your Railway app domain)
4. Railway will auto-deploy on push

The bot includes a self-ping every 14 minutes to keep the Railway app alive.

---

## Commands

| Command | Description | Who Can Use |
|---|---|---|
| `/warn [user] [reason]` | Warn a Roblox user | Admins & Owners |
| `/kick [user] [reason]` | Kick a Roblox user | Admins & Owners |
| `/ban [user] [reason]` | Ban a Roblox user | Admins & Owners |
| `/assign [user] [role]` | Assign an in-game role | Admins & Owners |
| `/admin-add [user] [discordid]` | Add an admin | Server Owner only |
| `/owner-add [user] [discordid]` | Add an owner | Server Owner only |
| `/logs [limit]` | View recent action logs | Admins & Owners |

## Available Roles (for /assign)
- Community Member
- Patient
- Nurse
- Junior Doctor
- Doctor
- Senior Doctor
- Head of Department
- Administrator
