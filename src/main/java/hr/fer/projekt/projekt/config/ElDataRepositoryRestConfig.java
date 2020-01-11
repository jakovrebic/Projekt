package hr.fer.projekt.projekt.config;

import hr.fer.projekt.projekt.model.ElData;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.ExposureConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

@Configuration
@ComponentScan("hr.fer.projekt.projekt")
public class ElDataRepositoryRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration restConfig) {
        ExposureConfiguration config = restConfig.getExposureConfiguration();
        config.forDomainType(ElData.class).withItemExposure((metadata, httpMethods) ->
                httpMethods.disable(HttpMethod.PATCH));
    }
}