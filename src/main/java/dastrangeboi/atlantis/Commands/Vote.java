package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Bot;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

public class Vote {
    public static void run(GuildMessageReceivedEvent message) {
        message.getChannel().sendMessage("You can vote for Atlantis here:\nhttps://top.gg/bot/688911718788628496/vote").queue();
    }
}
