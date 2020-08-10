package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Database;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import org.bson.Document;
import java.awt.*;

public class ToggleReminder {

    public static void run(JDA bot, GuildMessageReceivedEvent message, String[] args) {
        Document userdata = Database.getUserdata(message.getAuthor().getId());
        String reminder = message.getMessage().getContentRaw().split("\\s+")[0].replace(Bot.prefix, "").toLowerCase();

        // check if valid reminder name
        if (!reminder.matches("hunt|battle|praycurse|huntbot|owo|drop")) {
            // return error
            return;
        }

        // Change DB status
        Boolean status = userdata.getBoolean(reminder);
        Database.userdata.updateOne(new Document("userID", userdata.getString("userID")), new Document("$set", new Document(reminder, !status)));

        // embed style & send
        EmbedBuilder reminderToggleEmbed = new EmbedBuilder()
                .setDescription("<@" + message.getAuthor().getId() + ">, You have **" + (!status ? "enabled" : "disabled") + "** the reminder for `owo " + reminder + "`")
                .setColor(!status ? Color.GREEN : Color.RED);

        message.getChannel().sendMessage(reminderToggleEmbed.build()).queue();

    }
}
