package dastrangeboi.atlantis.Reminders;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import javax.swing.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class Drop {

    private static final ArrayList<String> dropTimeouts = new ArrayList<>();
    public static void reminder(GuildMessageReceivedEvent message) {
        String userID = message.getAuthor().getId();

        if (!dropTimeouts.contains(userID)) {
            dropTimeouts.add(userID);

            ActionListener dropReminder = e -> message.getChannel().sendMessage("<@"+message.getAuthor().getId()+">, `drop` cooldown has passed!").queue(messageSent -> {
                dropTimeouts.remove(userID);
                ActionListener timeout = e1 -> messageSent.delete().queue();
                Timer timer2 = new Timer(5000, timeout);
                timer2.setRepeats(false);
                timer2.start();
            });

            int dropCoolDown = 30000;
            Timer timer = new Timer(dropCoolDown, dropReminder);
            timer.setRepeats(false);
            timer.start();
        }
    }
}
