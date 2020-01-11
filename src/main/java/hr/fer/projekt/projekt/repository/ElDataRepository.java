package hr.fer.projekt.projekt.repository;

import hr.fer.projekt.projekt.model.ElData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;

/**
 * Repozitorij za spremanje {@link ElData}
 */
public interface ElDataRepository  extends PagingAndSortingRepository<ElData, Long> {

   // Page<ElData> findByTimeBetween(@Param("fromTime") Date from, @Param("toTime") Date to, Pageable p);

    @RestResource(exported = false)
    Page<ElData> findByPriceBetween(@Param("priceFrom") Double from, @Param("priceTo") Double to, Pageable p);

    @RestResource(exported = false)
    Page<ElData> findByVolumeBetween(@Param("volumeFrom") Double from, @Param("volumeTo") Double to,Pageable p);

}
