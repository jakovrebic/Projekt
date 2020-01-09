package hr.fer.projekt.projekt.repository;

import hr.fer.projekt.projekt.model.ElData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Repozitorij za spremanje {@link ElData}
 */
public interface ElDataRepository  extends PagingAndSortingRepository<ElData, Long> {

}
