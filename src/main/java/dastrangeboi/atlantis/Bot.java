package dastrangeboi.atlantis;

import dastrangeboi.atlantis.Events.Message;
import dastrangeboi.atlantis.Events.Ready;

import io.github.cdimascio.dotenv.Dotenv;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import org.apache.log4j.BasicConfigurator;

import javax.security.auth.login.LoginException;

public class Bot {

    // setting up dependencies
    public static Dotenv dotenv = Dotenv.load();

    // static variables
    public static JDA bot;
    public static String prefix = "a!";
    public static String adminID = "295255543596187650";

    public static void startBot() throws LoginException {
        bot = JDABuilder.createDefault(dotenv.get("TOKEN")).build();

        // Loading events
        bot.addEventListener(new Ready());
        bot.addEventListener(new Message());
    }

    public static void stopBot() {
        bot.shutdownNow();
        System.exit(0);
    }

    public static void main(String[] args) throws LoginException {
        BasicConfigurator.configure();
        startBot();
    }
}
