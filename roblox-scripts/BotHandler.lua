--[[
  Maple Hospital — Bot Handler (Roblox Server Script)
  Place this in ServerScriptService

  Handles:
  - Kick messages from the Discord bot (via MessagingService)
  - Warn popups from the Discord bot (via MessagingService)
  - Role assignment from the Discord bot (via DataStore "BotRoles")
]]

local MessagingService = game:GetService("MessagingService")
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")

local RolesDataStore = DataStoreService:GetDataStore("BotRoles")

-- Apply a role to a player in this custom server
local function applyRole(player, role)
  -- Fire your custom role logic here.
  -- For example, set a StringValue in the character or leaderstats:
  local roleValue = player:FindFirstChild("AssignedRole")
  if not roleValue then
    roleValue = Instance.new("StringValue")
    roleValue.Name = "AssignedRole"
    roleValue.Parent = player
  end
  roleValue.Value = role
  print("[BotHandler] Applied role '" .. role .. "' to " .. player.Name)
  -- Add any additional logic here (e.g. give tools, change uniform, etc.)
end

-- When a player joins, check if they have a bot-assigned role
Players.PlayerAdded:Connect(function(player)
  task.wait(2) -- wait for character to load
  local success, role = pcall(function()
    return RolesDataStore:GetAsync(tostring(player.UserId))
  end)
  if success and role then
    applyRole(player, role)
  end
end)

-- Listen for kick messages
MessagingService:SubscribeAsync("BotKick", function(message)
  local data = HttpService:JSONDecode(message.Data)
  local userId = tonumber(data.userId)
  local reason = data.reason or "Kicked by staff"

  for _, player in ipairs(Players:GetPlayers()) do
    if player.UserId == userId then
      player:Kick("You have been kicked by staff: " .. reason)
    end
  end
end)

-- Listen for warn messages
MessagingService:SubscribeAsync("BotWarn", function(message)
  local data = HttpService:JSONDecode(message.Data)
  local userId = tonumber(data.userId)
  local reason = data.reason or "Warned by staff"

  for _, player in ipairs(Players:GetPlayers()) do
    if player.UserId == userId then
      local screenGui = Instance.new("ScreenGui")
      screenGui.Name = "WarnGui"
      screenGui.ResetOnSpawn = false

      local frame = Instance.new("Frame", screenGui)
      frame.Size = UDim2.new(0, 420, 0, 110)
      frame.Position = UDim2.new(0.5, -210, 0, 20)
      frame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
      frame.BorderSizePixel = 0
      Instance.new("UICorner", frame).CornerRadius = UDim.new(0, 10)

      local stripe = Instance.new("Frame", frame)
      stripe.Size = UDim2.new(0, 6, 1, 0)
      stripe.BackgroundColor3 = Color3.fromRGB(241, 196, 15)
      stripe.BorderSizePixel = 0
      Instance.new("UICorner", stripe).CornerRadius = UDim.new(0, 10)

      local title = Instance.new("TextLabel", frame)
      title.Size = UDim2.new(1, -20, 0, 32)
      title.Position = UDim2.new(0, 16, 0, 8)
      title.Text = "⚠  You have been warned"
      title.TextColor3 = Color3.fromRGB(241, 196, 15)
      title.BackgroundTransparency = 1
      title.Font = Enum.Font.GothamBold
      title.TextSize = 15
      title.TextXAlignment = Enum.TextXAlignment.Left

      local body = Instance.new("TextLabel", frame)
      body.Size = UDim2.new(1, -20, 0, 48)
      body.Position = UDim2.new(0, 16, 0, 44)
      body.Text = "Reason: " .. reason
      body.TextColor3 = Color3.fromRGB(220, 220, 220)
      body.BackgroundTransparency = 1
      body.Font = Enum.Font.Gotham
      body.TextSize = 13
      body.TextWrapped = true
      body.TextXAlignment = Enum.TextXAlignment.Left

      screenGui.Parent = player.PlayerGui

      task.delay(8, function()
        if screenGui and screenGui.Parent then
          screenGui:Destroy()
        end
      end)
    end
  end
end)

print("[BotHandler] Maple Hospital bot handler loaded.")
