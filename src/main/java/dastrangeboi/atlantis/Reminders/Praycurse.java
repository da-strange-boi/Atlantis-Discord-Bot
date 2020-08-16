package dastrangeboi.atlantis.Reminders;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

import javax.swing.*;
import java.awt.event.ActionListener;
import java.util.ArrayList;

public class Praycurse {

    private static final ArrayList<String> praycurseTimeouts = new ArrayList<>();
    public static void reminder(GuildMessageReceivedEvent message) {
        String userID = message.getAuthor().getId();

        if (!praycurseTimeouts.contains(userID)) {
            praycurseTimeouts.add(userID);

            ActionListener owoReminder = e -> message.getChannel().sendMessage("<@"+message.getAuthor().getId()+">, `pray` or `curse` cooldown has passed!").queue(messageSent -> {
                praycurseTimeouts.remove(userID);
                ActionListener timeout = e1 -> messageSent.delete().queue();
                Timer timer2 = new Timer(5000, timeout);
                timer2.setRepeats(false);
                timer2.start();
            });

            int praycurseCoolDown = 10000;
            Timer timer = new Timer(praycurseCoolDown, owoReminder);
            timer.setRepeats(false);
            timer.start();
        }
    }
}
