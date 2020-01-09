package hr.fer.projekt.projekt;

import hr.fer.projekt.projekt.model.ElData;
import hr.fer.projekt.projekt.repository.ElDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.Calendar;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final ElDataRepository repository;

    @Autowired
    public DatabaseLoader(ElDataRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        this.repository.save(new ElData(new Timestamp(Calendar.getInstance().getTimeInMillis()), 1.0, 5.211));
    }
}