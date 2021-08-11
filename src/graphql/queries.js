/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelorderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
