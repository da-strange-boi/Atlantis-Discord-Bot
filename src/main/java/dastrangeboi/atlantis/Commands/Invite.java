package dastrangeboi.atlantis.Commands;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

public class Invite {
    public static void run(GuildMessageReceivedEvent message) {
        EmbedBuilder inviteEmbed = new EmbedBuilder()
                .setColor(message.getGuild().getSelfMember().getColor())
                .setDescription("[Click here to add Atlantis to your server!](https://discord.com/oauth2/authorize?client_id=688911718788628496&permissions=321600&scope=bot)");

        message.getChannel().sendMessage(inviteEmbed.build()).queue();
    }
}
