package dastrangeboi.atlantis.Commands;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

//TODO: add section for when DM is not open
public class Support {
    public static void run(GuildMessageReceivedEvent message) {
        String supportServerLink = "https://discord.gg/w7Sk8hC";

        message.getAuthor().openPrivateChannel().complete().sendMessage(supportServerLink).queue();
        message.getChannel().sendMessage("A DM has been sent with the invite link to **Atlantis Support Server** :trident:").queue();
    }
}
