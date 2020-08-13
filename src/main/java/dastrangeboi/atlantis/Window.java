package dastrangeboi.atlantis;

import javax.security.auth.login.LoginException;
import javax.swing.*;
import java.awt.*;
import java.io.PrintStream;

import static dastrangeboi.atlantis.Bot.startBot;

public class Window {

    static JFrame frame;
    static JLabel botStatus;
    static JTextArea console;
    static JScrollPane consoleScroll;
    static JTextField ping;
    static JLabel pingLabel;

    private static void makeWindow() {
        frame = new JFrame();
        botStatus = new JLabel();
        console = new JTextArea();
        consoleScroll = new JScrollPane();
        ping = new JTextField();
        pingLabel = new JLabel();

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setTitle("Atlantis Discord Bot");
        frame.getContentPane().setBackground(new Color(48, 48, 48)); // #303030
        frame.setResizable(false);

        botStatus.setFont(new Font("JetBrains Mono", Font.BOLD, 18));
        botStatus.setForeground(Color.red);
        botStatus.setHorizontalAlignment(SwingConstants.CENTER);
        botStatus.setText("Bot Not Connected to Discord");

        console.setEditable(false);
        console.setBackground(new Color(16, 16, 16));
        console.setColumns(20);
        console.setFont(new Font("Cascadia Code", Font.PLAIN, 12));
        console.setForeground(new Color(204, 204, 204));
        console.setRows(5);
        console.setText("Console Text");
        console.setBorder(null);
        consoleScroll.setViewportView(console);

        pingLabel.setFont(new Font("JetBrains Mono", Font.PLAIN, 12));
        pingLabel.setForeground(new Color(204, 204, 204));
        pingLabel.setText("Atlantis Ping");

        ping.setEditable(false);
        ping.setBackground(new Color(48, 48, 48));
        ping.setForeground(new Color(204, 204, 204));
        ping.setHorizontalAlignment(JTextField.CENTER);
        ping.setText("100ms");
        ping.setBorder(null);

        GroupLayout layout = new GroupLayout(frame.getContentPane());
        frame.getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
                layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                        .addComponent(consoleScroll)
                        .addGroup(layout.createSequentialGroup()
                                .addGap(24, 24, 24)
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING, false)
                                        .addComponent(pingLabel, GroupLayout.DEFAULT_SIZE, GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                                        .addComponent(ping))
                                .addGap(109, 109, 109)
                                .addComponent(botStatus)
                                .addContainerGap(218, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
                layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                        .addGroup(layout.createSequentialGroup()
                                .addContainerGap()
                                .addGroup(layout.createParallelGroup(GroupLayout.Alignment.LEADING)
                                        .addComponent(botStatus, GroupLayout.PREFERRED_SIZE, 44, GroupLayout.PREFERRED_SIZE)
                                        .addGroup(layout.createSequentialGroup()
                                                .addComponent(pingLabel)
                                                .addPreferredGap(LayoutStyle.ComponentPlacement.RELATED)
                                                .addComponent(ping, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)))
                                .addPreferredGap(LayoutStyle.ComponentPlacement.RELATED, 95, Short.MAX_VALUE)
                                .addComponent(consoleScroll, GroupLayout.PREFERRED_SIZE, 200, GroupLayout.PREFERRED_SIZE))
        );

        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public static void main(String[] args) throws LoginException {
        makeWindow();
        startBot();
    }
}
