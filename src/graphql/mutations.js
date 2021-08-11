/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelorderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      odrName
      Time
      Date
      Dish
      Qty
      PrepTime
      Color
      Done
      Note
      Workerno
      createdAt
      updatedAt
    }
  }
`;
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelorderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      odrName
      Time
      Date
      Dish
      Qty
      PrepTime
      Color
      Done
      Note
      Workerno
      createdAt
      updatedAt
    }
  }
`;
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelorderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
      id
      odrName
      Time
      Date
      Dish
      Qty
      PrepTime
      Color
      Done
      Note
      Workerno
      createdAt
      updatedAt
    }
  }
`;
