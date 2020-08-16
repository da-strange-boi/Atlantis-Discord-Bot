package dastrangeboi.atlantis.Events;

import dastrangeboi.atlantis.Bot;
import dastrangeboi.atlantis.Commands.*;

import dastrangeboi.atlantis.Database;
import dastrangeboi.atlantis.Reminders.Battle;
import dastrangeboi.atlantis.Reminders.Drop;
import dastrangeboi.atlantis.Reminders.Hunt;
import dastrangeboi.atlantis.Reminders.Praycurse;
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import org.bson.Document;

import java.awt.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class Message extends ListenerAdapter {

    private final Map<String, Long> cooldown = new HashMap<>();

    public void onGuildMessageReceived(GuildMessageReceivedEvent message) {

        // message startup
        String owoBotID = "408785106942164992";
        if (message.getAuthor().isBot() && message.getAuthor().getId().equalsIgnoreCase(owoBotID)) return;

        Document guildData = Database.guilddata.find(new Document("guildID", message.getGuild().getId())).first();

        // check if the bot was pinged
        if (message.getMessage().getContentRaw().replace("!", "").equalsIgnoreCase("<@"+Bot.bot.getSelfUser().getId()+">")) {
            if (guildData == null) {
                message.getChannel().sendMessage("<@"+message.getAuthor().getId()+">, Do `a!start` to register your account/guild account").queue();
            } else {
                message.getChannel().sendMessage("Hello there ***da strange boi***, my prefix is `" + guildData.getString("prefix") + "`").queue();
            }
        }

        String[] args = message.getMessage().getContentRaw().split("\\s+");
        String prefix = guildData != null ? guildData.getString("prefix").equalsIgnoreCase("") ? "a!" : guildData.getString("prefix") : "a!";

        // Check if message invokes a command
        if (args[0].startsWith(prefix)) {
            String cmd = args[0].replace(prefix, "");
            args = Arrays.copyOfRange(args, 1, args.length);

            // check cooldown
            if (cooldown.get(message.getAuthor().getId()) == null) {
                cooldown.put(message.getAuthor().getId(), System.currentTimeMillis());
            } else {
                long timeDifference = System.currentTimeMillis() - cooldown.get(message.getAuthor().getId());
                if ((timeDifference - 3000) <= 0) {
                    message.getChannel().sendMessage("Please slow down, the cooldown is 3 seconds").queue();
                    return;
                } else {
                    cooldown.put(message.getAuthor().getId(), System.currentTimeMillis());
                }
            }

            if (cmd.equalsIgnoreCase("start")) {
                Start.run(message);
            }
            else if (cmd.equalsIgnoreCase("help")) {
                Help.run(Bot.bot, message, args);
            }
            else if (cmd.equalsIgnoreCase("support")) {
                Support.run(message);
            }
            else if (cmd.equalsIgnoreCase("invite")) {
                Invite.run(message);
            }
            else if (cmd.equalsIgnoreCase("ping")) {
                Ping.run(message);
            }
            else if (cmd.equalsIgnoreCase("vote")) {
                Vote.run(message);
            }
            else if (cmd.equalsIgnoreCase("status")) {
                Status.run(message);
            }
            else {
                // check if user is not owo bot & has a user account (entry in database)
                Document userFound = Database.userdata.find(new Document("userID", message.getAuthor().getId())).first();
                if (userFound == null && !message.getAuthor().getId().equalsIgnoreCase(owoBotID)) {
                    EmbedBuilder errorEmbed = new EmbedBuilder()
                            .setAuthor(message.getAuthor().getName(), null, message.getAuthor().getAvatarUrl())
                            .setColor(Color.red)
                            .setDescription("To use that command/most of the bot do `a!start`");
                    message.getChannel().sendMessage(errorEmbed.build()).queue();
                    return;
                }
            }

            // User Account Required Commands
            if (cmd.equalsIgnoreCase("show")) {
                Show.run(Bot.bot, message, args);
            }
            else if (cmd.equalsIgnoreCase("stop")) {
                Stop.run(message);
            }
            else if (cmd.equalsIgnoreCase("stats")) {
                Stats.run(message);
            }
            else if (cmd.equalsIgnoreCase("serverstats")) {
                Serverstats.run(message);
            }

            // guild related commands
            if (cmd.equalsIgnoreCase("prefix")) {
                Prefix.run(message, args);
            }
            else if (cmd.equalsIgnoreCase("owoprefix")) {
                Owoprefix.run(message, args);
            }

            // Toggle Reminders Commands
            if (cmd.toLowerCase().matches("hunt|battle|praycurse|huntbot|owo|drop")) {
                ToggleReminder.run(Bot.bot, message, args);
            }
        }
        // Reminders
        assert guildData != null;
        if (message.getMessage().getContentRaw().matches("(owo|"+guildData.getString("owoPrefix")+")(h|hunt|catch)")) {
            Hunt.reminder(message);
        }
        if (message.getMessage().getContentRaw().matches("(owo|"+guildData.getString("owoPrefix")+")(battle|b|fight)")) {
            Battle.reminder(message);
        }
        if (message.getMessage().getContentRaw().matches("(owo|"+guildData.getString("owoPrefix")+")(pick|drop)")) {
            Drop.reminder(message);
        }
        if (message.getMessage().getContentRaw().matches("(owo|"+guildData.getString("owoPrefix")+")(pray|curse)")) {
            Praycurse.reminder(message);
        }
    }
}
