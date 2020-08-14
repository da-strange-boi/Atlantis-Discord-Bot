package dastrangeboi.atlantis.Reminders;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import javax.swing.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class Hunt {

    private static final ArrayList<String> huntTimeouts = new ArrayList<>();

    public static void reminder(GuildMessageReceivedEvent message) {

        String userID = message.getAuthor().getId();

        if (!huntTimeouts.contains(userID)) {
            huntTimeouts.add(userID);

            ActionListener huntReminder = e -> message.getChannel().sendMessage("Hunt is done").queue(messageSent -> {
                huntTimeouts.remove(userID);
                ActionListener timeout = e1 -> messageSent.delete().queue();
                Timer timer2 = new Timer(5000, timeout);
                timer2.setRepeats(false);
                timer2.start();
            });

            int huntCoolDown = 15000;
            Timer timer = new Timer(huntCoolDown, huntReminder);
            timer.setRepeats(false);
            timer.start();
        }
    }
}
