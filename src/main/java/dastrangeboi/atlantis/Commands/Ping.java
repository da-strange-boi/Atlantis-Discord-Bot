package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Bot;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

public class Ping {
    public static void run(GuildMessageReceivedEvent message) {
        long pingRate = Bot.bot.getGatewayPing();
        message.getChannel().sendMessage("Pong! :alarm_clock: **|** Latency is "+pingRate+"ms").queue();
    }
}
