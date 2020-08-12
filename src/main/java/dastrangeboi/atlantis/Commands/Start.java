package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Database;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import org.bson.Document;

import java.awt.*;
import java.util.ArrayList;

public class Start {
    public static void run(GuildMessageReceivedEvent message) {
        Document userFound = Database.userdata.find(new Document("userID", message.getAuthor().getId())).first();
        Document guildFound = Database.guilddata.find(new Document("guildID", message.getGuild().getId())).first();

        if (userFound == null) {

            // userdata customs
            ArrayList<Document> customs = new ArrayList<>();
            customs.add(new Document()
                .append("id", 1)
                .append("unlocked", true)
                .append("trigger", "")
                .append("triggerText", "")
                .append("time", 0)
                .append("displayTime", "")
            );
            customs.add(new Document()
                    .append("id", 2)
                    .append("unlocked", false)
                    .append("trigger", "")
                    .append("triggerText", "")
                    .append("time", 0)
                    .append("displayTime", "")
            );
            customs.add(new Document()
                    .append("id", 3)
                    .append("unlocked", false)
                    .append("trigger", "")
                    .append("triggerText", "")
                    .append("time", 0)
                    .append("displayTime", "")
            );

            // userdata database object
            Document newUser = new Document()
                    .append("userID", message.getAuthor().getId())
                    .append("lastVote", 0)
                    .append("hunt", true)
                    .append("battle", false)
                    .append("drop", false)
                    .append("owo", false)
                    .append("praycurse", true)
                    .append("huntbot", true)
                    .append("stats", new Document()
                        .append("owoCount", 0)
                        .append("huntCount", 0)
                        .append("battleCount", 0)
                        .append("praycuese", 0)
                        .append("completedHuntbots", 0)
                        .append("totalHuntbotTime", 0)
                        .append("dailyOwoCount", 0)
                        .append("dailyHuntCount", 0)
                        .append("dailyBattleCount", 0)
                        .append("dailyPraycurseCount", 0)
                        .append("guilds", new Document())
                    )
                    .append("customs", customs);

            Database.userdata.insertOne(newUser);

            EmbedBuilder startUserEmbed = new EmbedBuilder()
                    .setColor(Color.yellow)
                    .setAuthor(null, null, message.getAuthor().getAvatarUrl())
                    .setDescription("Welcome **" + message.getAuthor().getName() + "**, to Atlantis!");

            message.getChannel().sendMessage(startUserEmbed.build()).queue();
        } else {
            message.getChannel().sendMessage("<@" + message.getAuthor().getId() + ">, you are already a user!").queue();
        }

        // check if a guilddata database object has been made. if no create one
        if (guildFound == null) {
            // new guild
            Document newGuild = new Document()
                    .append("guildID", message.getGuild().getId())
                    .append("prefix", "")
                    .append("owoPrefix", "");

            Database.guilddata.insertOne(newGuild);

            EmbedBuilder startGuildEmbed = new EmbedBuilder()
                    .setColor(Color.green)
                    .setAuthor(null, null, message.getAuthor().getAvatarUrl())
                    .setDescription("Registered **" + message.getGuild().getName() + "**!");

            message.getChannel().sendMessage(startGuildEmbed.build()).queue();
        }

    }
}
