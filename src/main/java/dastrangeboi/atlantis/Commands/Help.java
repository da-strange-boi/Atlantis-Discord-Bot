package dastrangeboi.atlantis.Commands;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.entities.MessageEmbed;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import java.awt.*;

public class Help {

    private static Color getRoleColor(Member member) {
        return member.getColor();
    }

    private static Member botMember;
    private static MessageEmbed getDetailedHelpEmbed(String name, String usage, String description, String example, String aliases) {
        EmbedBuilder detailedHelpEmbed = new EmbedBuilder()
                .setTitle(name)
                .setColor(getRoleColor((botMember)))
                .setDescription(description)
                .addField("Usage", ""+usage+"", false);
        if (example != null) {
            detailedHelpEmbed.addField("Example", example, false);
        }
        if (aliases != null) {
            detailedHelpEmbed.addField("Aliases", aliases, false);
        }
        return detailedHelpEmbed.build();
    }

    public static void run(JDA bot, GuildMessageReceivedEvent message, String[] args) {
        botMember = message.getGuild().getSelfMember();
        if (args.length == 0) {
            EmbedBuilder helpEmbed = new EmbedBuilder()
                    .setTitle("Atlantis Commands :trident:")
                    .setColor(getRoleColor(message.getGuild().getSelfMember()))
                    .setDescription("This is the full command list for **Atlantis**! For more information on what a command does, do `a!help <command name>`\nThanks to `pri8000#8266` for the profile picture art!")
                    .addField("General", "`hunt`, `battle`, `drop`, `owo`, `praycurse`, `huntbot`, `show`", false)
                    .addField("Utilities", "`start`, `support`, `custom`, `help`, `invite`, `stats`, `status`, `serverstats`, `prefix`, `ping`, `vote`, `owoprefix`, `zoostats`", false)
                    .setFooter("Made by da strange boi#7087 with lots of \u2764");

            message.getChannel().sendMessage(helpEmbed.build()).queue();
        } else {
            MessageEmbed helpMessage;
            switch (args[0].toLowerCase()) {
                case "hunt": helpMessage = getDetailedHelpEmbed("Hunt", "a!hunt", "Toggles the reminder for owo hunt", null, "h, catch"); break;
                case "battle": helpMessage = getDetailedHelpEmbed("Battle", "a!battle", "Toggles the reminder for owo battle", null, "b, fight"); break;
                case "owo": helpMessage = getDetailedHelpEmbed("OwO", "a!owo", "Toggles the reminder for owo", null, null); break;
                case "drop": helpMessage = getDetailedHelpEmbed("Drop", "a!drop", "Toggles the reminder for owo drop", null, null); break;
                case "praycurse": helpMessage = getDetailedHelpEmbed("Praycurse", "a!praycurse", "Toggles the reminder for owo pray & owo curse", null, "pray, curse"); break;
                case "huntbot": helpMessage = getDetailedHelpEmbed("Huntbot", "a!huntbot", "Toggles the reminder for owo huntbot", null, "huntbot"); break;
                case "show": helpMessage = getDetailedHelpEmbed("Show", "a!show", "Shows what is enabled/disabled", null, null); break;
                default:
                    return;
            }
            message.getChannel().sendMessage(helpMessage).queue();
        }
    }
}
