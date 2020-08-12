package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Database;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import java.awt.*;

public class Status {

    private static Color getRoleColor(Member member) {
        return member.getColor();
    }

    private static String msToTime(long millis) {
        long seconds = millis / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;
        return days+" days, "+hours%24+"h, "+minutes%60+"m";
    }

    public static void run(GuildMessageReceivedEvent message) {
        int totalUsers = (int) Database.userdata.countDocuments();
        int allHuntbot = (int) Database.huntbot.countDocuments();
        String currentUptime = msToTime(System.currentTimeMillis() - Bot.startUpTime);

        EmbedBuilder statusEmbed = new EmbedBuilder()
                .setTitle("Atlantis Status")
                .setColor(getRoleColor(message.getGuild().getSelfMember()))
                .setThumbnail(Bot.bot.getSelfUser().getAvatarUrl())
                .addField("Total Guilds", "`"+Bot.bot.getGuilds().size()+"`", true)
                .addField("Total Users", "`"+totalUsers+"`", true)
                .addField("Current HuntBots", "`"+allHuntbot+"`", true)
                .addField("Uptime", "`"+currentUptime+"`", true)
                .addField("Version", "`"+Bot.version+"`", true);
        message.getChannel().sendMessage(statusEmbed.build()).queue();
    }
}
