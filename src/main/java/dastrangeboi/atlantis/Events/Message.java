package dastrangeboi.atlantis.Events;

import com.mongodb.internal.connection.Server;
import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Commands.*;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

import java.util.Arrays;

public class Message extends ListenerAdapter {
    public void onGuildMessageReceived(GuildMessageReceivedEvent message) {
        String[] args = message.getMessage().getContentRaw().split("\\s+");

        // Check if message invokes a command
        if (args[0].startsWith(Bot.prefix)) {
            String cmd = args[0].replace(Bot.prefix, "");
            args = Arrays.copyOfRange(args, 1, args.length);

            if (cmd.equalsIgnoreCase("help")) {
                Help.run(Bot.bot, message, args);
            }
            if (cmd.equalsIgnoreCase("show")) {
                Show.run(Bot.bot, message, args);
            }
            if (cmd.equalsIgnoreCase("stop")) {
                Stop.run(message);
            }
            if (cmd.equalsIgnoreCase("support")) {
                Support.run(message);
            }
            if (cmd.equalsIgnoreCase("invite")) {
                Invite.run(message);
            }
            if (cmd.equalsIgnoreCase("stats")) {
                Stats.run(message);
            }
            if (cmd.equalsIgnoreCase("serverstats")) {
                Serverstats.run(message);
            }
            if (cmd.equalsIgnoreCase("ping")) {
                Ping.run(message);
            }
            if (cmd.equalsIgnoreCase("vote")) {
                Vote.run(message);
            }

            // Reminders
            if (cmd.toLowerCase().matches("hunt|battle|praycurse|huntbot|owo|drop")) {
                ToggleReminder.run(Bot.bot, message, args);
            }
        }
    }
}
