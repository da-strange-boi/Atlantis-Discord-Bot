package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Database;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import org.bson.Document;
import java.awt.*;
import java.util.Objects;

public class Prefix {

    private static Color getRoleColor(Member member) {
        return member.getColor();
    }

    public static void run(GuildMessageReceivedEvent message, String[] args) {

        Document guildFound = Database.guilddata.find(new Document("guildID", message.getGuild().getId())).first();
        if (guildFound == null) return;

        String prefix = String.join(" ", args);

        if (prefix.length() > 20) {
            EmbedBuilder errorEmbed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor(Color.red)
                    .setDescription("Prefix must be less then `20` characters long");
            message.getChannel().sendMessage(errorEmbed.build()).queue();
        }

        if (args.length < 1) {
            EmbedBuilder prefixEmbed = new EmbedBuilder()
                    .setTitle("Prefix for " + message.getGuild().getName())
                    .setColor(getRoleColor(message.getGuild().getSelfMember()))
                    .setDescription("Current prefix: `" + (guildFound.getString("prefix").equalsIgnoreCase("") ? Bot.prefix : guildFound.getString("prefix")) + "`");
            message.getChannel().sendMessage(prefixEmbed.build()).queue();
        }

        if (prefix.length() > 0) {
            if (Objects.requireNonNull(message.getMember()).hasPermission(Permission.ADMINISTRATOR)) {
                Database.guilddata.updateOne(new Document("guildID", message.getGuild().getId()), new Document("$set", new Document("prefix", prefix)));
                EmbedBuilder newPrefixEmbed = new EmbedBuilder()
                        .setTitle("New prefix for " + message.getGuild().getName())
                        .setColor(getRoleColor(message.getGuild().getSelfMember()))
                        .setDescription("New prefix is: `" + prefix + "`");
                message.getChannel().sendMessage(newPrefixEmbed.build()).queue();
            } else {
                EmbedBuilder errorEmbed = new EmbedBuilder()
                        .setTitle("Error")
                        .setColor(Color.red)
                        .setDescription("Only admins can change the server prefix");
                message.getChannel().sendMessage(errorEmbed.build()).queue();
            }
        }
    }
}
