package hr.fer.projekt.projekt.repository;

import hr.fer.projekt.projekt.model.ElData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import static hr.fer.projekt.projekt.socket.WebSocketConfiguration.MESSAGE_PREFIX;

@Component
@RepositoryEventHandler(ElData.class)
public class EventHandler {

	private final SimpMessagingTemplate websocket;

	private final EntityLinks entityLinks;

	@Autowired
	public EventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	@HandleAfterCreate
	public void newEmployee(ElData elData) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newElData", getPath(elData));
	}

	@HandleAfterDelete
	public void deleteEmployee(ElData elData) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteElData", getPath(elData));
	}


	private String getPath(ElData elData) {
		return this.entityLinks.linkForItemResource(elData.getClass(),
				elData.getId()).toUri().getPath();
	}

}