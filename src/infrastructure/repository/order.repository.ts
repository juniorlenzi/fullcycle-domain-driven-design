import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order.repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";


export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map(item => ({
        id: item.id,
        price: item.price,
        name: item.name,
        quantity: item.quantity,
        order_id: entity.id,
        product_id: item.productId
      })),
    }, {
      include: [
        { model: OrderItemModel }
      ]
    });
  }

  async update(entity: Order): Promise<void> {

    await OrderModel.update({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
    },
      {
        where: { id: entity.id },
      });

    await OrderItemModel.destroy({ where: { order_id: entity.id } });
    entity.items.map(item =>
      OrderItemModel.create({
        id: item.id,
        price: item.price,
        name: item.name,
        quantity: item.quantity,
        order_id: entity.id,
        product_id: item.productId
      })
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"]
    });

    const orderItems = orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"]
    });

    return orderModels.map(orderModel => {
      const orderItems = orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });
  }

}