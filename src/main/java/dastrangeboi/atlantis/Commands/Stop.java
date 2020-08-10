package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Bot;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

public class Stop {
    public static void run(GuildMessageReceivedEvent message) {
        if (message.getAuthor().getId().equalsIgnoreCase(Bot.adminID)) {
            message.getChannel().sendMessage("Shutting down").queue(temp -> {
                Bot.stopBot();
            });
        }
    }
}
