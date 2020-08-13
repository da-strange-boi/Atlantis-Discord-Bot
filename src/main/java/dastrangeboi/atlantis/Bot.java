package dastrangeboi.atlantis;

import dastrangeboi.atlantis.Events.Message;
import dastrangeboi.atlantis.Events.Ready;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;

import io.github.cdimascio.dotenv.Dotenv;
import javax.security.auth.login.LoginException;
import java.util.Date;

public class Bot {

    // setting up dependencies
    public static Dotenv dotenv = Dotenv.load();

    // static variables
    public static JDA bot;
    public static String prefix = "a!";
    public static String version = "1.7.17";
    public static String adminID = "295255543596187650";

    // Uptime
    public static long startUpTime;

    public static void startBot() throws LoginException {
        bot = JDABuilder.createDefault(dotenv.get("TOKEN")).build();
        startUpTime = System.currentTimeMillis();

        // Loading events
        bot.addEventListener(new Ready());
        bot.addEventListener(new Message());
    }

    public static void stopBot() {
        bot.shutdownNow();
        System.exit(0);
    }
}
