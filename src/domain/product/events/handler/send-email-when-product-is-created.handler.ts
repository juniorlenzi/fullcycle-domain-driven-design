import EventHandlerInterface from "../../../@shared/event/event.handler.interface";
import EventInterface from "../../../@shared/event/event.interface";
import ProductsCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductsCreatedEvent> {

    handle(event: EventInterface): void {
        // console.log('Email sent when product is created')
    }
    
}