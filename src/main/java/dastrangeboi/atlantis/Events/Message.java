package dastrangeboi.atlantis.Events;

import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Commands.Help;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class Message extends ListenerAdapter {
    public void onGuildMessageReceived(GuildMessageReceivedEvent message) {
        String[] args = message.getMessage().getContentRaw().split("\\s+");

        // Check if message invokes a command
        if (args[0].startsWith(Bot.prefix)) {
            String cmd = args[0].replace(Bot.prefix, "");

            if (cmd.equalsIgnoreCase("help")) {
                Help.run(Bot.bot, message, args);
            }
        }
    }
}
