from __future__ import annotations

import asyncio
import time
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, Optional, Tuple

import config
from constants import IST


class QueryCache:
    """Ultra-fast in-memory TTL cache for DB query results.
    
    Stores results with timestamps. Expired entries are lazily cleaned.
    All lookups are O(1) dict access — sub-millisecond.
    """

    def __init__(self, default_ttl: float = 30.0):
        self._store: Dict[str, Tuple[Any, float]] = {}  # key -> (value, expire_time)
        self._default_ttl = default_ttl

    def get(self, key: str) -> Optional[Any]:
        """Get a cached value. Returns None if missing or expired."""
        entry = self._store.get(key)
        if entry is None:
            return None
        value, expire_time = entry
        if time.monotonic() > expire_time:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any, ttl: Optional[float] = None):
        """Cache a value with optional custom TTL."""
        self._store[key] = (value, time.monotonic() + (ttl or self._default_ttl))

    def delete(self, key: str):
        """Remove a specific key."""
        self._store.pop(key, None)

    def invalidate_prefix(self, prefix: str):
        """Remove all keys starting with a prefix (e.g., 'guild:123')."""
        to_delete = [k for k in self._store if k.startswith(prefix)]
        for k in to_delete:
            del self._store[k]

    def clear(self):
        """Clear all cached entries."""
        self._store.clear()

    def cleanup(self):
        """Remove all expired entries (call periodically)."""
        now = time.monotonic()
        expired = [k for k, (_, exp) in self._store.items() if now > exp]
        for k in expired:
            del self._store[k]


class CacheManager:
    def __init__(self, bot):
        if TYPE_CHECKING:
            from .Bot import Argon

        self.bot: Argon = bot

        self.guild_data = {}
        self.eztagchannels = set()
        self.tagcheck = set()
        self.scrim_channels = set()
        self.tourney_channels = set()
        self.autopurge_channels = set()
        self.media_partner_channels = set()
        self.ssverify_channels = set()

        self.blocked_ids = set()
        self.noprefix = {}

        # Fast lookup caches
        self.premium_guilds: set = set()  # Guild IDs with active premium
        self.scrim_counts: Dict[int, int] = {}  # guild_id -> scrim count
        self.tourney_counts: Dict[int, int] = {}  # guild_id -> tourney count

        # Generic TTL query cache for arbitrary lookups
        self.query_cache = QueryCache(default_ttl=30.0)

    async def fill_temp_cache(self):
        from models import AutoPurge, BlockList, EasyTag, Guild, Scrim, SSVerify, TagCheck, Tourney, NoPrefix

        async for record in Guild.all():
            self.guild_data[record.guild_id] = {
                "prefix": record.prefix,
                "color": record.embed_color or config.COLOR,
                "footer": record.embed_footer or config.FOOTER,
            }
            if record.is_premium:
                self.premium_guilds.add(record.guild_id)

        async for record in EasyTag.all():
            self.eztagchannels.add(record.channel_id)

        async for record in TagCheck.all():
            self.tagcheck.add(record.channel_id)

        async for record in Scrim.filter(opened_at__lte=datetime.now(tz=IST)).all():
            self.scrim_channels.add(record.registration_channel_id)

        async for record in Tourney.filter(started_at__not_isnull=True):
            self.tourney_channels.add(record.registration_channel_id)

        async for record in AutoPurge.all():
            self.autopurge_channels.add(record.channel_id)

        async for record in Tourney.all():
            async for partner in record.media_partners.all():
                self.media_partner_channels.add(partner.channel_id)

        async for record in SSVerify.all():
            self.ssverify_channels.add(record.channel_id)

        async for record in BlockList.all():
            self.blocked_ids.add(record.block_id)

        async for record in NoPrefix.all():
            self.noprefix[record.user_id] = record.expires_at

        # Pre-cache scrim and tourney counts per guild
        from tortoise.functions import Count
        scrim_counts = await Scrim.all().group_by("guild_id").annotate(cnt=Count("id")).values("guild_id", "cnt")
        for row in scrim_counts:
            self.scrim_counts[row["guild_id"]] = row["cnt"]

        tourney_counts = await Tourney.all().group_by("guild_id").annotate(cnt=Count("id")).values("guild_id", "cnt")
        for row in tourney_counts:
            self.tourney_counts[row["guild_id"]] = row["cnt"]

        print(f"Cache: {len(self.guild_data)} guilds, {len(self.premium_guilds)} premium, "
              f"{len(self.scrim_counts)} scrim guilds, {len(self.tourney_counts)} tourney guilds")

    def guild_color(self, guild_id: int):
        return self.guild_data.get(guild_id, {}).get("color", config.COLOR)

    def guild_footer(self, guild_id: int):
        return self.guild_data.get(guild_id, {}).get("footer", config.FOOTER)

    def is_premium(self, guild_id: int) -> bool:
        """O(1) premium check from memory — no DB hit."""
        return guild_id in self.premium_guilds

    def get_scrim_count(self, guild_id: int) -> int:
        """O(1) scrim count from memory."""
        return self.scrim_counts.get(guild_id, 0)

    def get_tourney_count(self, guild_id: int) -> int:
        """O(1) tourney count from memory."""
        return self.tourney_counts.get(guild_id, 0)

    async def update_guild_cache(self, guild_id: int, *, set_default=False) -> None:
        from models import Guild

        if set_default:
            await Guild.get(pk=guild_id).update(
                prefix=config.PREFIX, embed_color=config.COLOR, embed_footer=config.FOOTER
            )

        _g = await Guild.get(pk=guild_id)
        self.guild_data[guild_id] = {
            "prefix": _g.prefix,
            "color": _g.embed_color or config.COLOR,
            "footer": _g.embed_footer or config.FOOTER,
        }

        # Update premium status
        if _g.is_premium:
            self.premium_guilds.add(guild_id)
        else:
            self.premium_guilds.discard(guild_id)

    async def _periodic_cleanup(self):
        """Background task to clean expired query cache entries."""
        while True:
            await asyncio.sleep(60)
            self.query_cache.cleanup()

