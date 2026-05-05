import { useQuery } from "@tanstack/react-query";
import { getProducts, getFeaturedProducts, getProductBySlug } from "../api/product.api.js";

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: 1000 * 60 * 2,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["featuredProducts"],
    queryFn: getFeaturedProducts,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};
