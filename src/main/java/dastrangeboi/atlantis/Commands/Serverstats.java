package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Database;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import org.bson.Document;

public class Serverstats {

    private static String getStats(Document userdata, String statName, String guildID) {
        Document stats = (Document) userdata.get("stats");
        Document guildStats = (Document) stats.get("guilds");
        Document serverStats = (Document) guildStats.get(guildID);
        return "`"+serverStats.getInteger(statName)+"`";
    }

    public static void run(GuildMessageReceivedEvent message) {
        Document userdata = Database.getUserdata(message.getAuthor().getId());
        String guildID = message.getGuild().getId();
        EmbedBuilder statsEmbed = new EmbedBuilder()
                .setAuthor(message.getAuthor().getName()+"'s stats in " + message.getGuild().getName(), null, message.getAuthor().getAvatarUrl())
                .setColor(message.getGuild().getSelfMember().getColor())
                .setThumbnail(message.getGuild().getIconUrl())
                .addField("OwO Count", getStats(userdata, "owoCount", guildID), true)
                .addField("Hunt Count", getStats(userdata, "huntCount", guildID), true)
                .addField("Battle Count", getStats(userdata, "battleCount", guildID), true)
                .addField("Pray/Curse Count", getStats(userdata, "praycurseCount", guildID), true)
                .addBlankField(false)
                .addField("Daily OwO Count", getStats(userdata, "dailyOwoCount", guildID), true)
                .addField("Daily Hunt Count", getStats(userdata, "dailyHuntCount", guildID), true)
                .addField("Daily Battle Count", getStats(userdata, "dailyBattleCount", guildID), true)
                .addField("Daily Pray/Curse Count", getStats(userdata, "dailyPraycurseCount", guildID), true);

        message.getChannel().sendMessage(statsEmbed.build()).queue();
    }
}
