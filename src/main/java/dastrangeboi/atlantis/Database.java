package dastrangeboi.atlantis;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class Database {
    private static MongoClient client = MongoClients.create("mongodb://localhost:27017");
    private static MongoDatabase database = client.getDatabase("atlantis");
    public static MongoCollection<Document> userdata = database.getCollection("userdata");
}
