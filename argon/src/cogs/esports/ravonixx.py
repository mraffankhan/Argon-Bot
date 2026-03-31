import asyncio
import json
import discord
from discord.ext import commands
from core import Argon
from tortoise import Tortoise

class RavonixxIntegration(commands.Cog, name="RavonixxIntegration"):
    def __init__(self, bot: Argon):
        self.bot = bot
        self._listener_task = None
        
    async def cog_load(self):
        self._listener_task = self.bot.loop.create_task(self.setup_postgres_listener())
        
    async def cog_unload(self):
        if self._listener_task:
            self._listener_task.cancel()

    async def setup_postgres_listener(self):
        print("[Ravonixx] Initializing PostgreSQL NOTIFY listener loop...", flush=True)
        # We need an independent asyncpg connection to listen, 
        # because tortoise pool releases connection after query
        
        while True:
            try:
                import asyncpg
                import config as cfg
                db_opts = cfg.TORTOISE["connections"]["default"]["credentials"]
                conn = await asyncpg.connect(
                    user=db_opts["user"],
                    password=db_opts["password"],
                    database=db_opts["database"],
                    host=db_opts["host"],
                    port=db_opts["port"],
                    ssl=db_opts.get("ssl", True)
                )
                
                await conn.add_listener('tournament_created', self.on_tournament_created)
                await conn.add_listener('group_created', self.on_group_created)
                
                print("[Ravonixx] PostgreSQL NOTIFY listener ACTIVE", flush=True)
                
                # keep alive until connection breaks
                while not conn.is_closed():
                    await asyncio.sleep(60)
            except Exception as e:
                print(f"[Ravonixx] Postgres Listener encountered error: {e}. Retrying in 10s...")
                await asyncio.sleep(10)

    async def on_tournament_created(self, connection, pid, channel, payload):
        print(f"[Ravonixx] Received Webhook [tournament_created]: {payload}", flush=True)
        try:
            data = json.loads(payload)
            tournament_id = data.get("tournamentId")
            guild_id = int(data.get("guildId"))
            tournament_name = data.get("name")
            
            guild = self.bot.get_guild(guild_id)
            if not guild:
                print(f"[Ravonixx] Guild {guild_id} not found.")
                return

            print(f"[Ravonixx] Provisioning Discord setup for Tournament: {tournament_name}")
            category = await guild.create_category(name=f"🏆 {tournament_name}")
            
            announcements = await category.create_text_channel(name="announcements")
            
            how_to_reg = await category.create_text_channel(name="how-to-register")
            embed = discord.Embed(
                title=f"Welcome to {tournament_name}!",
                description="Please register your team on the [Ravonixx Website](https://ravonixx.xyz).",
                color=self.bot.color
            )
            await how_to_reg.send(embed=embed)
            
            from models.ravonixx import WebsiteTournament
            await WebsiteTournament.filter(id=tournament_id).update(
                categoryId=str(category.id),
                announcementsChannelId=str(announcements.id),
                howToRegisterChannelId=str(how_to_reg.id)
            )
            print("[Ravonixx] Tournament Discord setup complete!", flush=True)
            
        except Exception as e:
            print(f"[Ravonixx] Error parsing webhook: {e}")

    async def on_group_created(self, connection, pid, channel, payload):
        try:
            data = json.loads(payload)
            tournament_id = data.get("tournamentId")
            group_id = data.get("groupId")
            guild_id = int(data.get("guildId"))
            group_name = data.get("groupName")
            
            guild = self.bot.get_guild(guild_id)
            if not guild:
                return
                
            from models.ravonixx import WebsiteTournament, WebsiteGroup
            t = await WebsiteTournament.get_or_none(id=tournament_id)
            if not t:
                return
            
            role = await guild.create_role(name=f"{group_name} ({t.name})", reason="Ravonixx Group")
            category = guild.get_channel(int(t.categoryId)) if t.categoryId else None
            
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(read_messages=False),
                guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True),
                role: discord.PermissionOverwrite(read_messages=True)
            }
            if category:
                group_channel = await category.create_text_channel(name=group_name.replace(" ", "-"), overwrites=overwrites)
            else:
                group_channel = await guild.create_text_channel(name=group_name.replace(" ", "-"), overwrites=overwrites)
                
            await WebsiteGroup.filter(id=group_id).update(roleId=str(role.id), channelId=str(group_channel.id))
            print(f"[Ravonixx] Group provisioned: {group_name}", flush=True)
        except Exception as e:
            print(f"[Ravonixx] Error parsing group webhook: {e}")

async def setup(bot):
    await bot.add_cog(RavonixxIntegration(bot))
