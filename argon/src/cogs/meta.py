from __future__ import annotations

import platform
import time
from datetime import datetime
import typing as T

import discord
import psutil
from discord import app_commands
from discord.ext import commands

import config
import constants as csts
from core.ui import ArgonView, NavigationButton
from utils import discord_timestamp, human_timedelta, emote
from models import Commands

if T.TYPE_CHECKING:
    from core import Context

class StatsView(ArgonView):
    def __init__(self, ctx: Context, bot_stats_embed: discord.Embed):
        super().__init__(ctx, timeout=60)
        self.bot_stats_embed = bot_stats_embed

    @discord.ui.button(label="System Resources", style=discord.ButtonStyle.primary, emoji="💻")
    async def system_resources(self, interaction: discord.Interaction, button: discord.ui.Button):
        await self.loading_state(interaction, "Gathering System Metrics...")
        embed = await self.get_system_stats_embed()
        await interaction.edit_original_response(embed=embed, view=self)

    @discord.ui.button(label="Server Stats", style=discord.ButtonStyle.primary, emoji="📊")
    async def server_stats(self, interaction: discord.Interaction, button: discord.ui.Button):
        await self.loading_state(interaction, "Calculating Server Data...")
        embed = await self.get_server_stats_embed()
        await interaction.edit_original_response(embed=embed, view=self)

    @discord.ui.button(label="Home", style=discord.ButtonStyle.secondary, emoji="🏠")
    async def home(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.edit_message(embed=self.bot_stats_embed, view=self)

    async def get_system_stats_embed(self) -> discord.Embed:
        cpu_usage = psutil.cpu_percent()
        cpu_count = psutil.cpu_count()
        process = psutil.Process()
        proc_mem = process.memory_info().rss / (1024 * 1024)
        sys_mem = psutil.virtual_memory()
        uptime = human_timedelta(datetime.fromtimestamp(psutil.boot_time(), tz=csts.IST), accuracy=None)
        
        embed = discord.Embed(
            title=f"{emote.server} System Diagnostics",
            description="Real-time hardware and environment analysis.",
            color=self.bot.color
        )
        
        embed.add_field(
            name="CPU Architecture",
            value=f"```\nCores: {cpu_count}\nUsage: {cpu_usage}%\nLoad: {platform.processor() or 'N/A'}\n```",
            inline=False
        )
        
        mem_val = (
            f"Process: {proc_mem:.2f} MB\n"
            f"System: {sys_mem.total / (1024**3):.2f} GB\n"
            f"Available: {sys_mem.available / (1024**3):.2f} GB"
        )
        embed.add_field(name="Memory Allocation", value=f"```\n{mem_val}\n```", inline=True)
        
        env_val = (
            f"OS: {platform.system()} {platform.release()}\n"
            f"Uptime: {uptime}"
        )
        embed.add_field(name="Environment", value=f"```\n{env_val}\n```", inline=True)
        
        embed.set_footer(text=config.FOOTER)
        return embed

    async def get_server_stats_embed(self) -> discord.Embed:
        total_guilds = len(self.bot.guilds)
        total_shards = self.bot.shard_count
        uptime = human_timedelta(self.bot.start_time, accuracy=None)
        total_members = sum(g.member_count or 0 for g in self.bot.guilds)
        cached_members = len(self.bot.users)
        
        # Command metrics
        global_cmds = await Commands.all().count()
        
        # Latency calculations
        ws_ping = round(self.bot.latency * 1000)
        try:
            db_ping = await self.bot.db_latency
        except Exception:
            db_ping = "N/A"
            
        embed = discord.Embed(
            title=f"{emote.privacy} Network Overview",
            description="Argon's global reach and performance metrics.",
            color=self.bot.color
        )
        
        network_val = (
            f"Servers: {total_guilds:,}\n"
            f"Shards: {total_shards}\n"
            f"Uptime: {uptime}"
        )
        embed.add_field(name=f"{emote.server} Registry", value=f"```\n{network_val}\n```", inline=True)
        
        lat_val = (
            f"WebSocket: {ws_ping}ms\n"
            f"Database: {db_ping}"
        )
        embed.add_field(name=f"{emote.loading} Latency", value=f"```\n{lat_val}\n```", inline=True)
        
        member_val = (
            f"Total: {total_members:,}\n"
            f"Cached: {cached_members:,}\n"
            f"Commands: {global_cmds:,}"
        )
        embed.add_field(name="Population", value=f"```\n{member_val}\n```", inline=False)
        
        embed.set_footer(text=config.FOOTER)
        return embed


class Meta(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.hybrid_command(name="stats", description="Premium statistics dashboard for Argon")
    async def stats(self, ctx: Context):
        """Display a modern, interactive dashboard of Argon's performance."""
        
        await ctx.typing()
        
        # Latency calculations
        ws_ping = round(self.bot.latency * 1000)
        try:
            db_ping = await self.bot.db_latency
        except Exception:
            db_ping = "N/A"
            
        embed = discord.Embed(
            title="Argon Application Overview",
            description=(
                "Modern esports management, complete tournament automation, and advanced "
                "ticket support. Explore the tabs below for detailed analytics."
            ),
            color=self.bot.color
        )
        
        # Premium Information
        embed.add_field(
            name="Bot Core",
            value=f"```\nVersion: 1.0.0\nRuntime: Python {platform.python_version()}\nLibrary: Discord.py {discord.__version__}\n```",
            inline=False
        )
        
        # Latency & Status
        status_val = (
            f"Online since {discord_timestamp(self.bot.start_time, mode='R')}\n"
            f"WebSocket: `{ws_ping}ms` • Database: `{db_ping}`"
        )
        embed.add_field(name="Connection Status", value=status_val, inline=False)
        
        embed.set_thumbnail(url=self.bot.user.display_avatar.url)
        embed.set_footer(text=config.FOOTER)
        
        view = StatsView(ctx, embed)
        view.message = await ctx.send(embed=embed, view=view)


async def setup(bot):
    await bot.add_cog(Meta(bot))
