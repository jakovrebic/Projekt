package hr.fer.projekt.projekt.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.sql.Timestamp;
import java.util.Objects;

/**
 * Zapis o cijeni elekticne energije u odredenom trenutku
 */
@Entity(name = "electric_price_data")
public class ElData {

    /**
     * Id zapisa u bazi
     */
    private @Id
    @GeneratedValue
    Long id;
    /**
     * Trenutak u kojem su se dobili podaci
     **/
    private Timestamp time;
    /**
     * Volumen el energije
     **/
    private Double volume;
    /**
     * Cijena el energije
     */
    private Double price;

    /**
     * Default konstruktor da Hibernate bude sretan
     */
    private ElData(){

    }

    /**
     * Konstruktor
     **/
    public ElData(Timestamp time, Double volume, Double price) {
        this.time = time;
        this.volume = volume;
        this.price = price;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ElData elData = (ElData) o;
        return Objects.equals(time, elData.time) &&
                Objects.equals(volume, elData.volume) &&
                Objects.equals(price, elData.price);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, time, volume, price);
    }

    /**
     * Getter
     */
    public Long getId() {
        return id;
    }

    /**
     * Setter
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Getter
     */
    public Timestamp getTime() {
        return time;
    }

    /**
     * Setter
     */
    public void setTime(Timestamp time) {
        this.time = time;
    }

    /**
     * Getter
     */
    public Double getVolume() {
        return volume;
    }

    /**
     * Setter
     */
    public void setVolume(Double volume) {
        this.volume = volume;
    }

    /**
     * Getter
     */
    public Double getPrice() {
        return price;
    }

    /**
     * Setter
     */
    public void setPrice(Double price) {
        this.price = price;
    }
}
