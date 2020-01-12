package hr.fer.projekt.projekt.controller;

import hr.fer.projekt.projekt.model.ElData;
import hr.fer.projekt.projekt.repository.ElDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.*;
import org.springframework.hateoas.core.EmbeddedWrapper;
import org.springframework.hateoas.core.EmbeddedWrappers;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.*;

import static org.springframework.hateoas.core.DummyInvocationUtils.methodOn;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

@RepositoryRestController
public class ElDataExtendedApiController {

    Logger LOG = LoggerFactory.getLogger(ElDataExtendedApiController.class);

    @Autowired
    private ElDataRepository elDataRepository;

    @Autowired
    private EntityLinks entityLinks;

    @GetMapping("/elDatas/search/filtered-search")
    public @ResponseBody
    HttpEntity<?> filteredSearch(@RequestParam Map<String, String> parameterMap, Pageable pageable) {

        for (Map.Entry param : parameterMap.entrySet()){
            LOG.debug(param.getKey() + "-"+param.getValue());
        }

        Iterable<ElData> elDataEntities = elDataRepository.findAll();
        List<Resource<ElData>> returnElDataEntities = new ArrayList<>();
        elDataEntities.forEach(elData -> {
            if (parameterMap.get("priceFrom") != null && elData.getPrice() < Double.parseDouble(parameterMap.get("priceFrom"))) {
                return;
            }
            if (parameterMap.get("priceTo") != null && elData.getPrice() > Double.parseDouble(parameterMap.get("priceTo"))) {
                return;
            }
            if (parameterMap.get("volumeFrom") != null && elData.getVolume() < Double.parseDouble(parameterMap.get("volumeFrom"))) {
                return;
            }
            if (parameterMap.get("volumeTo") != null && elData.getVolume() > Double.parseDouble(parameterMap.get("volumeTo"))) {
                return;
            }
            try {
                if (parameterMap.get("dateFrom") != null ) {
                    LocalDateTime localDateTime = LocalDateTime.parse(URLDecoder.decode(parameterMap.get("dateFrom"), "UTF-8"));
                    Date fromDate = Date.from(localDateTime.atZone( ZoneId.systemDefault()).toInstant());
                    LOG.debug("From date is: " + fromDate + " " + elData.getTime());
                    if(elData.getTime().before(fromDate))
                        return;
                }
            } catch (UnsupportedEncodingException e) {
                //ignore
                LOG.error("",e);
            }
            try {
                if (parameterMap.get("dateTo") != null) {
                    LocalDateTime localDateTime = LocalDateTime.parse(URLDecoder.decode(parameterMap.get("dateTo"), "UTF-8"));
                    Date toDate = Date.from(localDateTime.atZone( ZoneId.systemDefault()).toInstant());
                    LOG.debug("To date is: " + toDate);
                    if(elData.getTime().after(toDate))
                        return;
                }
            } catch (UnsupportedEncodingException e) {
                LOG.error("",e);
            }
            Resource<ElData> model = new Resource<ElData>(elData, entityLinks.linkToSingleResource(ElData.class, elData.getId()).withSelfRel(), entityLinks.linkToSingleResource(ElData.class, elData.getId()).withRel("elData"));
            returnElDataEntities.add(model);
        });


        ControllerLinkBuilder link = linkTo(methodOn(ElDataExtendedApiController.class).filteredSearch(parameterMap, pageable));
        Link profileLink = new Link(link.toString().substring(0, link.toString().indexOf("/elDatas/search/filtered-search")) + "/api/profile/elDatas");
        Link selfLink = new Link(link.toString().substring(0, link.toString().indexOf("/elDatas/search/filtered-search")) + "/api/elDatas/search/filtered-search");


        if (returnElDataEntities.isEmpty()) {
            EmbeddedWrappers wrappers = new EmbeddedWrappers(false);
            EmbeddedWrapper wrapper = wrappers.emptyCollectionOf(ElData.class);
            Resources<Object> resources = new Resources<>(Arrays.asList(wrapper));
            resources.add(selfLink.withSelfRel(), profileLink.withRel("profile"));
            return new ResponseEntity<>(resources, HttpStatus.OK);
        } else {
            PagedResources<Resource<ElData>> resources = new PagedResources<Resource<ElData>>(returnElDataEntities, new PagedResources.PageMetadata(returnElDataEntities.size(), 0, returnElDataEntities.size(), 1), selfLink.withSelfRel(), profileLink.withRel("profile"));
            return new ResponseEntity<>(resources, HttpStatus.OK);
        }

    }

}
