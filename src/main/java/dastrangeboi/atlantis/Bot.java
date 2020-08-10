package dastrangeboi.atlantis;

import dastrangeboi.atlantis.Events.Message;
import dastrangeboi.atlantis.Events.Ready;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;

import javax.security.auth.login.LoginException;

public class Bot {

    // static variables
    public static JDA bot;
    public static String prefix = "a!";
    private static String token = "no no. don't even try :)";

    public static void startBot() throws LoginException {
        bot = JDABuilder.createDefault(token).build();

        // Loading events
        bot.addEventListener(new Ready());
        bot.addEventListener(new Message());
    }

    public static void stopBot() {
        bot.shutdownNow();
        System.exit(1);
    }

    public static void main(String[] args) throws LoginException {
        startBot();
    }
}
