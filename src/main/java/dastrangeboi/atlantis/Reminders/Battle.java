package dastrangeboi.atlantis.Reminders;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import javax.swing.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class Battle {

    private static final ArrayList<String> battleTimeouts = new ArrayList<>();
    public static void reminder(GuildMessageReceivedEvent message) {
        String userID = message.getAuthor().getId();

        if (!battleTimeouts.contains(userID)) {
            battleTimeouts.add(userID);

            ActionListener battleReminder = e -> message.getChannel().sendMessage("<@"+message.getAuthor().getId()+">, `battle` cooldown has passed!").queue(messageSent -> {
                battleTimeouts.remove(userID);
                ActionListener timeout = e1 -> messageSent.delete().queue();
                Timer timer2 = new Timer(5000, timeout);
                timer2.setRepeats(false);
                timer2.start();
            });

            int battleCoolDown = 15000;
            Timer timer = new Timer(battleCoolDown, battleReminder);
            timer.setRepeats(false);
            timer.start();
        }
    }
}
