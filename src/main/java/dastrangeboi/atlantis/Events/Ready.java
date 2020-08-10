package dastrangeboi.atlantis.Events;

import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Database;
import net.dv8tion.jda.api.OnlineStatus;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.events.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class Ready extends ListenerAdapter {
    public void onReady(ReadyEvent e) {
        Bot.bot.getPresence().setActivity(Activity.watching(Database.userdata.countDocuments() + " users"));
        Bot.bot.getPresence().setStatus(OnlineStatus.ONLINE);
    }
}
