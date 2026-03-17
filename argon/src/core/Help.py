from __future__ import annotations

import typing as T
import discord
from discord.ext import commands

import config
from .ui import HelpView
from utils import truncate_string, emote

class HelpCommand(commands.HelpCommand):
    def __init__(self) -> None:
        super().__init__(
            verify_checks=False,
            command_attrs={
                "cooldown": commands.CooldownMapping.from_cooldown(1, 8.0, commands.BucketType.member),
                "help": "Shows help about the bot, a command, or a category",
            },
        )

    def get_command_signature(self, command: commands.Command) -> str:
        return f"{self.context.clean_prefix}{command.qualified_name} {command.signature}"

    async def send_bot_help(self, mapping: Mapping[Optional[commands.Cog], List[commands.Command]]):
        ctx = self.context
        view = HelpView(ctx, mapping)
        embed = view.get_main_embed()
        view.message = await ctx.send(embed=embed, view=view)

    async def send_cog_help(self, cog: commands.Cog):
        ctx = self.context
        # Create a mapping that only contains the requested cog
        view = HelpView(ctx, {cog: cog.get_commands()})
        embed = view.get_category_embed(cog.qualified_name)
        view.message = await ctx.send(embed=embed, view=view)

    async def send_group_help(self, group: commands.Group):
        prefix = self.context.clean_prefix
        embed = discord.Embed(
            title=f"Group: {group.qualified_name.title()}",
            description=group.help or "No description provided.",
            color=self.context.bot.color
        )
        
        # Format subcommands
        subcmds = "\n".join(
            f"`{prefix}{c.qualified_name}` - {truncate_string(c.short_doc or 'No description', 60)}" 
            for c in group.commands if not c.hidden
        )
        
        embed.add_field(name="Subcommands", value=subcmds or "No subcommands found.", inline=False)
        embed.set_footer(text=f"Usage: {prefix}help {group.qualified_name} <subcommand>")
        
        await self.context.send(embed=embed)

    async def send_command_help(self, command: commands.Command):
        embed = discord.Embed(
            title=f"Command: {command.qualified_name.title()}",
            description=command.help or "No description provided.",
            color=self.context.bot.color
        )
        
        embed.add_field(name="Usage", value=f"`{self.get_command_signature(command)}`", inline=False)
        
        if command.aliases:
            embed.add_field(name="Aliases", value=", ".join(f"`{a}`" for a in command.aliases), inline=False)
            
        if command.extras and (examples := command.extras.get("examples")):
             ex_text = "\n".join(f"{self.context.clean_prefix}{ex}" for ex in examples)
             embed.add_field(name="Examples", value=f"```\n{ex_text}\n```", inline=False)

        await self.context.send(embed=embed)

    async def command_not_found(self, string: str):
        from difflib import get_close_matches
        message = f"{emote.xmark} Could not find the `{string}` command. "
        commands_list = [str(cmd) for cmd in self.context.bot.walk_commands()]
        
        if dym := get_close_matches(string, commands_list):
            message += f"\nDid you mean: " + ", ".join(f"`{d}`" for d in dym)
            
        return message
