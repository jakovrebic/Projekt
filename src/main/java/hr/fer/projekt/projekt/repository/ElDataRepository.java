package hr.fer.projekt.projekt.repository;

import hr.fer.projekt.projekt.model.ElData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.sql.Timestamp;
import java.util.function.Predicate;

/**
 * Repozitorij za spremanje {@link ElData}
 */
public interface ElDataRepository  extends PagingAndSortingRepository<ElData, Long> {

    @Query("select e from electric_price_data e " +
            "where e.time between ?1 and ?2")
    Page<ElData> findByDatesBetween(Timestamp from, Timestamp to, Pageable p);

    @Query("select e from electric_price_data e " +
            "where e.price between ?1 and ?2")
    Page<ElData> findByPriceBetween(Double from, Double to,Pageable p);

    @Query("select e from electric_price_data e " +
            "where e.volume between ?1 and ?2")
    Page<ElData> findByVolumeBetween(Double from, Double to,Pageable p);

}
