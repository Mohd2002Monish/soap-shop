import { useQuery } from "@tanstack/react-query";
import { getMyOrders, getMyOrderDetails } from "../api/order.api.js";

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
  });
};

export const useOrderDetails = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getMyOrderDetails(id),
    enabled: !!id,
  });
};
