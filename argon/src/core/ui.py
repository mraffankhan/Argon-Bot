from __future__ import annotations

import discord
from discord import ui
import typing as T
from contextlib import suppress
from utils import emote
import config

if T.TYPE_CHECKING:
    from core import Context

class ArgonView(ui.View):
    """Enhanced base view for Argon with modern defaults and utilities."""
    message: T.Union[discord.Message, discord.InteractionMessage]
    
    def __init__(self, ctx: Context, *, timeout: T.Optional[float] = 60, delete_on_timeout: bool = False):
        super().__init__(timeout=timeout)
        self.ctx = ctx
        self.bot = ctx.bot
        self.delete_on_timeout = delete_on_timeout

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        if interaction.user.id != self.ctx.author.id:
            await interaction.response.send_message(
                "Sorry, this interaction is reserved for the command invoker.",
                ephemeral=True,
            )
            return False
        return True

    async def on_timeout(self) -> None:
        if self.delete_on_timeout:
            with suppress(discord.HTTPException):
                await self.message.delete()
            return

        for child in self.children:
            if isinstance(child, (ui.Button, ui.Select)):
                child.disabled = True
        
        with suppress(discord.HTTPException):
            await self.message.edit(view=self)

    async def loading_state(self, interaction: discord.Interaction, text: str = "Processing..."):
        """Show a modern loading state."""
        embed = discord.Embed(
            description=f"{emote.loading} **{text}**",
            color=self.bot.color
        )
        if interaction.response.is_done():
            await interaction.edit_original_response(embed=embed, view=None)
        else:
            await interaction.response.edit_message(embed=embed, view=None)

class Confirmation(ArgonView):
    """Standardized premium confirmation dialog."""
    def __init__(self, ctx: Context, *, timeout: float = 30):
        super().__init__(ctx, timeout=timeout)
        self.value: T.Optional[bool] = None

    @ui.button(label="Confirm", style=discord.ButtonStyle.success, emoji=emote.check)
    async def confirm(self, interaction: discord.Interaction, button: ui.Button):
        self.value = True
        await interaction.response.defer()
        self.stop()

    @ui.button(label="Cancel", style=discord.ButtonStyle.danger, emoji=emote.xmark)
    async def cancel(self, interaction: discord.Interaction, button: ui.Button):
        self.value = False
        await interaction.response.defer()
        self.stop()

class Paginator(ArgonView):
    """Modern pagination system with numerical page indicators."""
    def __init__(self, ctx: Context, pages: T.List[discord.Embed], *, timeout: float = 120):
        super().__init__(ctx, timeout=timeout)
        self.pages = pages
        self.current_page = 0
        self.update_buttons()

    def update_buttons(self):
        self.clear_items()
        
        # Previous button
        prev_btn = ui.Button(emoji=emote.pprevious, style=discord.ButtonStyle.secondary, disabled=self.current_page == 0)
        prev_btn.callback = self.previous_page
        self.add_item(prev_btn)
        
        # Page indicator
        indicator = ui.Button(label=f"Page {self.current_page + 1} / {len(self.pages)}", disabled=True, style=discord.ButtonStyle.primary)
        self.add_item(indicator)
        
        # Next button
        next_btn = ui.Button(emoji=emote.pnext, style=discord.ButtonStyle.secondary, disabled=self.current_page == len(self.pages) - 1)
        next_btn.callback = self.next_page
        self.add_item(next_btn)
        
        # Close button
        exit_btn = ui.Button(emoji=emote.exit, style=discord.ButtonStyle.danger)
        exit_btn.callback = self.close_paginator
        self.add_item(exit_btn)

    async def previous_page(self, interaction: discord.Interaction):
        self.current_page -= 1
        self.update_buttons()
        await interaction.response.edit_message(embed=self.pages[self.current_page], view=self)

    async def next_page(self, interaction: discord.Interaction):
        self.current_page += 1
        self.update_buttons()
        await interaction.response.edit_message(embed=self.pages[self.current_page], view=self)

    async def close_paginator(self, interaction: discord.Interaction):
        await interaction.response.defer()
        await self.message.delete()
        self.stop()

class NavigationButton(ui.Button):
    def __init__(self, label: str, emoji: T.Optional[str] = None, style: discord.ButtonStyle = discord.ButtonStyle.secondary, row: T.Optional[int] = None, target_view: T.Optional[T.Callable] = None):
        super().__init__(label=label, emoji=emoji, style=style, row=row)
        self.target_view = target_view

    async def callback(self, interaction: discord.Interaction):
        if self.target_view:
            new_view = self.target_view(self.view.ctx)
            # This logic assumes the new view has a rendering method or we just edit here
            embed = await new_view.get_embed() if hasattr(new_view, 'get_embed') else interaction.message.embeds[0]
            await interaction.response.edit_message(embed=embed, view=new_view)
            new_view.message = interaction.message
        else:
            await interaction.response.send_message("No target view defined.", ephemeral=True)

class GuidedModal(ui.Modal):
    """Standardized premium modal for forms."""
    def __init__(self, title: str, *, timeout: float = 180):
        super().__init__(title=title, timeout=timeout)
        self.values: T.Dict[str, str] = {}

    async def on_submit(self, interaction: discord.Interaction):
        for child in self.children:
            if isinstance(child, ui.TextInput):
                self.values[child.label] = child.value
        await interaction.response.defer()
        self.stop()

class HelpSelect(ui.Select):
    """Category select for the premium help menu."""
    def __init__(self, categories: T.Dict[str, T.List[commands.Command]]):
        options = [
            discord.SelectOption(
                label=cat, 
                description=f"Commands for {cat}", 
                emoji="📂" if cat != "Home" else "🏠",
                value=cat
            ) for cat in categories.keys()
        ]
        super().__init__(placeholder="Explore Command Categories...", options=options)
        self.categories = categories

    async def callback(self, interaction: discord.Interaction):
        view: T.Any = self.view
        selected = self.values[0]
        
        if selected == "Home":
            embed = view.get_main_embed()
        else:
            embed = view.get_category_embed(selected)
            
        await interaction.response.edit_message(embed=embed, view=view)

class HelpView(ArgonView):
    """Modern integrated help view with navigation."""
    def __init__(self, ctx: Context, mapping: T.Dict[T.Optional[commands.Cog], T.List[commands.Command]]):
        super().__init__(ctx, timeout=180)
        self.mapping = mapping
        self.categories = self._process_mapping()
        self.add_item(HelpSelect(self.categories))
        
        # Navigation buttons
        self.add_item(ui.Button(label="Support Server", url=config.SERVER_LINK, emoji=emote.info))
        self.add_item(ui.Button(label="Invite Me", url=ctx.bot.invite_url, emoji=emote.add))

    def _process_mapping(self):
        cats = {"Home": []}
        hidden = ("HelpCog", "Dev", "NoPrefixCmd", "ArgonAlerts", "Jishaku", "Bug Reporting", "JishakuCog")
        for cog, cmds in self.mapping.items():
            if not cmds: continue
            name = cog.qualified_name if cog else "General"
            if name in hidden: continue
            cats[name] = [c for c in cmds if not c.hidden]
        return cats

    def get_main_embed(self) -> discord.Embed:
        embed = discord.Embed(
            title=f"{self.bot.user.name} Help Center",
            description=(
                f"Welcome to the **Argon** dashboard. Use the dropdown below to navigate categories.\n\n"
                f"{emote.arrow} **Prefix:** `{config.PREFIX}`\n"
                f"{emote.arrow} **Total Commands:** `{len(self.bot.commands)}`"
            ),
            color=self.bot.color
        )
        embed.set_thumbnail(url=self.bot.user.display_avatar.url)
        embed.add_field(
            name="Getting Started",
            value="Select a category from the menu below to see available commands and their usage.",
            inline=False
        )
        embed.set_footer(text=f"Requested by {self.ctx.author}", icon_url=self.ctx.author.display_avatar.url)
        return embed

    def get_category_embed(self, category_name: str) -> discord.Embed:
        cmds = self.categories[category_name]
        embed = discord.Embed(
            title=f"{category_name} - Command List",
            description=f"Browse all commands available in the `{category_name}` category.",
            color=self.bot.color
        )
        
        val = ""
        for cmd in cmds:
            val += f"`{cmd.name}` - {cmd.short_doc or 'No description'}\n"
            
        embed.add_field(name="Commands", value=val or "No commands found.", inline=False)
        embed.set_footer(text="Use the dropdown to switch categories.")
        return embed
