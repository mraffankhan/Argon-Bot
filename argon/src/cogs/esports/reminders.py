import discord
from discord.ext import commands, tasks
import asyncpg
import datetime

PRISMA_DB_URL = "postgresql://postgres:affan%40805032@db.fwywdcoiudevrssihfuf.supabase.co:5432/postgres?schema=public"

class Reminders(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.pool = None
        self.reminder_loop.start()

    async def cog_load(self):
        self.pool = await asyncpg.create_pool(PRISMA_DB_URL)

    async def cog_unload(self):
        self.reminder_loop.cancel()
        if self.pool:
            await self.pool.close()

    @tasks.loop(minutes=5.0)
    async def reminder_loop(self):
        if not self.pool:
            return
            
        now = datetime.datetime.now(datetime.timezone.utc)
        target_time = now + datetime.timedelta(minutes=15)
        # 15 minute lookup window to account for async delays and loop precision
        lower_bound = now + datetime.timedelta(minutes=10)
        upper_bound = now + datetime.timedelta(minutes=20)

        async with self.pool.acquire() as conn:
            # Query for scheduled matches within 15 minutes that haven't been reminded
            matches = await conn.fetch('''
                SELECT m.id, m."scheduledAt", t1."captainId" as t1_captain, t2."captainId" as t2_captain,
                       t1.name as t1_name, t2.name as t2_name, u1."discordId" as d1, u2."discordId" as d2
                FROM "Match" m
                JOIN "Team" t1 ON m."team1Id" = t1.id
                JOIN "Team" t2 ON m."team2Id" = t2.id
                JOIN "User" u1 ON t1."captainId" = u1.id
                JOIN "User" u2 ON t2."captainId" = u2.id
                WHERE m.status = 'SCHEDULED' 
                  AND m."reminderSent" = false
                  AND m."scheduledAt" >= $1 AND m."scheduledAt" <= $2
            ''', lower_bound, upper_bound)

            for match in matches:
                caption1_id = match['d1']
                caption2_id = match['d2']
                
                # Try sending DMs
                async def send_dm(cap_id, msg):
                    try:
                        user = await self.bot.fetch_user(int(cap_id))
                        await user.send(msg)
                    except:
                        pass # Ignore if DMs are closed
                
                msg_content = f"⏰ Your match starts in 15 minutes! **{match['t1_name']}** vs **{match['t2_name']}**. Good luck! Don't forget to submit scores with `/score {match['id']}`."
                
                self.bot.loop.create_task(send_dm(caption1_id, msg_content))
                self.bot.loop.create_task(send_dm(caption2_id, msg_content))

                # Mark as reminded
                await conn.execute('UPDATE "Match" SET "reminderSent" = true WHERE id = $1', match['id'])

    @reminder_loop.before_loop
    async def before_reminder_loop(self):
        await self.bot.wait_until_ready()

async def setup(bot):
    await bot.add_cog(Reminders(bot))
