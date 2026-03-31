from tortoise import fields, models

class WebsiteTournament(models.Model):
    class Meta:
        table = "Tournament"

    id = fields.CharField(max_length=36, pk=True)
    name = fields.CharField(max_length=255)
    game = fields.CharField(max_length=255)
    format = fields.CharField(max_length=255)
    organizerId = fields.CharField(max_length=255)
    guildId = fields.CharField(max_length=255)
    teamSize = fields.IntField()
    status = fields.CharField(max_length=255)
    maxTeams = fields.IntField()
    teamsPerGroup = fields.IntField()
    pingRoleId = fields.CharField(max_length=255, null=True)
    categoryId = fields.CharField(max_length=255, null=True)
    announcementsChannelId = fields.CharField(max_length=255, null=True)
    howToRegisterChannelId = fields.CharField(max_length=255, null=True)
    prize = fields.CharField(max_length=255, null=True)
    rules = fields.TextField(null=True)
    bannerUrl = fields.CharField(max_length=255, null=True)
    discordInvite = fields.CharField(max_length=255, null=True)
    isPublic = fields.BooleanField(default=True)
    isFeatured = fields.BooleanField(default=False)
    featuredUntil = fields.DatetimeField(null=True)
    featuredTier = fields.CharField(max_length=255, null=True)
    totalMatches = fields.IntField()
    createdAt = fields.DatetimeField(auto_now_add=True)
    updatedAt = fields.DatetimeField(auto_now=True)

class WebsiteStage(models.Model):
    class Meta:
        table = "Stage"

    id = fields.CharField(max_length=36, pk=True)
    tournament_id = fields.CharField(max_length=36, source_field="tournamentId")
    name = fields.CharField(max_length=255)
    order = fields.IntField()
    status = fields.CharField(max_length=255, default="PENDING")
    createdAt = fields.DatetimeField(auto_now_add=True)

class WebsiteGroup(models.Model):
    class Meta:
        table = "Group"

    id = fields.CharField(max_length=36, pk=True)
    stage_id = fields.CharField(max_length=36, source_field="stageId")
    name = fields.CharField(max_length=255)
    roleId = fields.CharField(max_length=255, null=True)
    channelId = fields.CharField(max_length=255, null=True)
    createdAt = fields.DatetimeField(auto_now_add=True)

class WebsiteTeam(models.Model):
    class Meta:
        table = "Team"
        
    id = fields.CharField(max_length=36, pk=True)
    name = fields.CharField(max_length=255)
    captainId = fields.CharField(max_length=255)
    tournament_id = fields.CharField(max_length=36, source_field="tournamentId")
    createdAt = fields.DatetimeField(auto_now_add=True)
