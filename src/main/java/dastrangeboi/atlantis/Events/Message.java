package dastrangeboi.atlantis.Events;

import com.mongodb.internal.connection.Server;
import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Commands.*;

import dastrangeboi.atlantis.Database;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.bson.Document;

import java.awt.*;
import java.util.Arrays;

public class Message extends ListenerAdapter {
    private static String owoBotID = "408785106942164992";
    public void onGuildMessageReceived(GuildMessageReceivedEvent message) {

        if (message.getAuthor().isBot() && message.getAuthor().getId().equalsIgnoreCase(owoBotID)) return;

        // check if the bot was pinged
        if (message.getMessage().getContentRaw().replace("!", "").equalsIgnoreCase("<@"+Bot.bot.getSelfUser().getId()+">")) {
            message.getChannel().sendMessage("Hello there ***da strange boi***, my prefix is `a!`").queue();
        }

        String[] args = message.getMessage().getContentRaw().split("\\s+");

        // Check if message invokes a command
        if (args[0].startsWith(Bot.prefix)) {
            String cmd = args[0].replace(Bot.prefix, "");
            args = Arrays.copyOfRange(args, 1, args.length);

            if (cmd.equalsIgnoreCase("start")) {
                Start.run(message);
            }
            else if (cmd.equalsIgnoreCase("help")) {
                Help.run(Bot.bot, message, args);
            }
            else if (cmd.equalsIgnoreCase("support")) {
                Support.run(message);
            }
            else if (cmd.equalsIgnoreCase("invite")) {
                Invite.run(message);
            }
            else if (cmd.equalsIgnoreCase("ping")) {
                Ping.run(message);
            }
            else if (cmd.equalsIgnoreCase("vote")) {
                Vote.run(message);
            }
            else {
                Document userFound = Database.userdata.find(new Document("userID", message.getAuthor().getId())).first();
                if (userFound == null && !message.getAuthor().getId().equalsIgnoreCase(owoBotID)) {
                    EmbedBuilder errorEmbed = new EmbedBuilder()
                            .setAuthor(message.getAuthor().getName(), null, message.getAuthor().getAvatarUrl())
                            .setColor(Color.red)
                            .setDescription("To use that command/most of the bot do `a!start`");
                    message.getChannel().sendMessage(errorEmbed.build()).queue();
                    return;
                }
            }

            if (cmd.equalsIgnoreCase("show")) {
                Show.run(Bot.bot, message, args);
            }
            if (cmd.equalsIgnoreCase("stop")) {
                Stop.run(message);
            }
            if (cmd.equalsIgnoreCase("stats")) {
                Stats.run(message);
            }
            if (cmd.equalsIgnoreCase("serverstats")) {
                Serverstats.run(message);
            }

            // Reminders
            if (cmd.toLowerCase().matches("hunt|battle|praycurse|huntbot|owo|drop")) {
                ToggleReminder.run(Bot.bot, message, args);
            }
        }
    }
}
