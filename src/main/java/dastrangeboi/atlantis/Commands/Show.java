package dastrangeboi.atlantis.Commands;

import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Database;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.entities.Emote;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import org.bson.Document;
import java.awt.*;

public class Show {

    private static Color getRoleColor(Member member) {
        return member.getColor();
    }

    private static String getReminderStatus(Document userdata, String name) {
        Boolean status = userdata.getBoolean(name);
        return status ? "Enabled" : "Disabled";
    }

    private static String getEmoji(String emojiID) {
        Emote emoji = Bot.bot.getEmoteById(emojiID);
        assert emoji != null;
        return emoji.getAsMention();
    }

    public static void run(JDA bot, GuildMessageReceivedEvent message, String[] args) {
        Document userdata = Database.getUserdata(message.getAuthor().getId());
        EmbedBuilder showEmbed = new EmbedBuilder()
                .setAuthor(message.getAuthor().getName() + "'s reminders", null, message.getAuthor().getAvatarUrl())
                .setColor(getRoleColor(message.getGuild().getSelfMember()))
                .addField(":bow_and_arrow: Hunt", getReminderStatus(userdata, "hunt"), true)
                .addField(":crossed_swords: Battle", getReminderStatus(userdata, "battle"), true)
                .addField(getEmoji("700185406947328020") + " Pray/Curse", getReminderStatus(userdata, "praycurse"), true)
                .addField(":robot: Huntbot", getReminderStatus(userdata, "huntbot"), true)
                .addField(getEmoji("700185426224480286") + " OwO", getReminderStatus(userdata, "owo"), true)
                .addField(":money_with_wings: Drop", getReminderStatus(userdata, "drop"), true);

        message.getChannel().sendMessage(showEmbed.build()).queue();
    }
}
