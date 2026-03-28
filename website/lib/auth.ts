export const isAuthorizedDev = (userId: string | null | undefined): boolean => {
    // Array of authorized developer Discord IDs
    const DEVS = ["1449081308616720628"];
    return !!userId && DEVS.includes(userId);
};

import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./prisma";

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png"
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          id: profile.id,
          name: profile.username,
          discordId: profile.id,
          email: profile.email,
          image: profile.image_url,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id;
        
        // Optionally attach Discord ID
        const dbUser = await db.user.findUnique({
          where: { id: user.id }
        });
        if (dbUser?.discordId) {
          session.user.discordId = dbUser.discordId;
        }
      }
      return session;
    }
  }
};
