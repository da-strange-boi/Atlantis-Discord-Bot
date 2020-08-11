package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Database;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import org.bson.Document;

public class Stats {

    private static String getStats(Document userdata, String statName) {
        Document stats = (Document) userdata.get("stats");
        return "`"+stats.getInteger(statName)+"`";
    }

    public static void run(GuildMessageReceivedEvent message) {
        Document userdata = Database.getUserdata(message.getAuthor().getId());
        EmbedBuilder statsEmbed = new EmbedBuilder()
                .setAuthor(message.getAuthor().getName()+"'s stats", null, message.getAuthor().getAvatarUrl())
                .setColor(message.getGuild().getSelfMember().getColor())
                .addField("OwO Count", getStats(userdata, "owoCount"), true)
                .addField("Hunt Count", getStats(userdata, "huntCount"), true)
                .addField("Battle Count", getStats(userdata, "battleCount"), true)
                .addField("Pray/Curse Count", getStats(userdata, "praycurseCount"), true)
                .addField("Completed Huntbots", getStats(userdata, "completedHuntbots"), true)
                .addField("Total Huntbot Time", getStats(userdata, "totalHuntbotTime"), true)
                .addBlankField(false)
                .addField("Daily OwO Count", getStats(userdata, "dailyOwoCount"), true)
                .addField("Daily Hunt Count", getStats(userdata, "dailyHuntCount"), true)
                .addField("Daily Battle Count", getStats(userdata, "dailyBattleCount"), true)
                .addField("Daily Pray/Curse Count", getStats(userdata, "dailyPraycurseCount"), true);

        message.getChannel().sendMessage(statsEmbed.build()).queue();
    }
}
