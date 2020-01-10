package hr.fer.projekt.projekt;

import hr.fer.projekt.projekt.model.ElData;
import hr.fer.projekt.projekt.repository.ElDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final ElDataRepository repository;

    @Autowired
    public DatabaseLoader(ElDataRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        this.repository.save(new ElData(Calendar.getInstance().getTime(), 1.0, 5.211));
        this.repository.save(new ElData(new Date(Calendar.getInstance().getTimeInMillis() - 200000), 2.0, 1.1));
        this.repository.save(new ElData(new Date(Calendar.getInstance().getTimeInMillis() - 2000000), 4.0, 7.9));
        this.repository.save(new ElData(new Date(Calendar.getInstance().getTimeInMillis() - 7990000), 1.0, 1.78));

    }
}