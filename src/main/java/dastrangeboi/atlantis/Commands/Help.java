package dastrangeboi.atlantis.Commands;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import java.awt.*;

public class Help {

    private static Color getRoleColor(Member member) {
        return member.getColor();
    }

    public static void run(JDA bot, GuildMessageReceivedEvent message, String[] args) {
        if (args.length > 0) {
            EmbedBuilder helpEmbed = new EmbedBuilder()
                    .setTitle("Atlantis Help :trident:")
                    .setColor(getRoleColor(message.getGuild().getSelfMember()))
                    .setDescription("Join **Atlantis Support Server**\nThis is the full command list for **Atlantis**! For more information on what a command does, do `a!help <command name>`\nThanks to `pri8000#8266` for the profile picture art!")
                    .addField("General", "`hunt`, `battle`, `drop`, `owo`, `praycurse`, `huntbot`, `show`", false)
                    .setFooter("Atlantis Bot, made by `da strange boi#7087` with lots of love!");

            message.getChannel().sendMessage(helpEmbed.build()).queue();
        } else {
            message.getChannel().sendMessage("not yet").queue();
        }
    }
}
