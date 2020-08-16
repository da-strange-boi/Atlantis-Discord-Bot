package dastrangeboi.atlantis.Reminders;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import javax.swing.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class Owo {

    private static final ArrayList<String> owoTimeouts = new ArrayList<>();
    public static void reminder(GuildMessageReceivedEvent message) {
        String userID = message.getAuthor().getId();

        if (!owoTimeouts.contains(userID)) {
            owoTimeouts.add(userID);

            ActionListener owoReminder = e -> message.getChannel().sendMessage("<@"+message.getAuthor().getId()+">, `owo` cooldown has passed!").queue(messageSent -> {
                owoTimeouts.remove(userID);
                ActionListener timeout = e1 -> messageSent.delete().queue();
                Timer timer2 = new Timer(5000, timeout);
                timer2.setRepeats(false);
                timer2.start();
            });

            int owoCoolDown = 10000;
            Timer timer = new Timer(owoCoolDown, owoReminder);
            timer.setRepeats(false);
            timer.start();
        }
    }
}
