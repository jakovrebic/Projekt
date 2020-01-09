package hr.fer.projekt.projekt.repository;

import hr.fer.projekt.projekt.model.ElData;
import org.springframework.data.repository.CrudRepository;

/**
 * Repozitorij za spremanje {@link ElData}
 */
public interface ElDataRepository  extends CrudRepository<ElData, Long> {

}
