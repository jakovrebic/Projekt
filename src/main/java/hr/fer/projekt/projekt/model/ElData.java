package hr.fer.projekt.projekt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;
import java.sql.Timestamp;
import java.util.Date;
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
    private Date time;
    /**
     * Volumen el energije
     **/
    private Double volume;
    /**
     * Cijena el energije
     */
    private Double price;

    /**
     * Za automatsko vođenje evidencije da li se entry promijenio
     */
    private @Version
    @JsonIgnore
    Long version;

    /**
     * Default konstruktor da Hibernate bude sretan
     */
    private ElData() {

    }

    /**
     * Konstruktor
     **/
    public ElData(Date time, Double volume, Double price) {
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
                Objects.equals(version, elData.version) &&
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
    public Date getTime() {
        return time;
    }

    /**
     * Setter
     */
    public void setTime(Date time) {
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

    /**
     * Getter
     */
    public Long getVersion() {
        return version;
    }

    /**
     * Setter
     */
    public void setVersion(Long version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return "ElData{" +
                "id=" + id +
                ", time=" + time +
                ", volume=" + volume +
                ", price=" + price +
                ", version=" + version +
                '}';
    }
}
