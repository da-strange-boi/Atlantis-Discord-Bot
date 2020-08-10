package dastrangeboi.atlantis.Commands;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

public class Help {
    public static void run(JDA bot, GuildMessageReceivedEvent message, String[] args) {
        EmbedBuilder helpEmbed = new EmbedBuilder()
                .setTitle("Atlantis Help :trident:")
                .setDescription("Join **Atlantis Support Server**\nThis is the full command list for **Atlantis**! For more information on what a command does do `a!help <command name>`")
                .addField("General", "test", false)
                .setFooter("Atlantis Bot, made by `da strange boi#7087` with lots of love!");

        message.getChannel().sendMessage(helpEmbed.build()).queue();
    }
}
