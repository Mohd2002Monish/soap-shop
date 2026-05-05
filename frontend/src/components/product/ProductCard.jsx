import { Box, SimpleGrid, Image, Text, Heading, Button, Badge } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/slices/cartSlice.js";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addItem({
      _id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0]?.url || "https://via.placeholder.com/150",
      quantity: 1,
      stock: product.stock,
    }));
  };

  return (
    <Box borderWidth={1} borderRadius="lg" overflow="hidden" boxShadow="sm" p={4} bg="white">
      <RouterLink to={`/product/${product.slug}`}>
        <Image 
          src={product.images[0]?.url || "https://via.placeholder.com/300?text=Soap"} 
          alt={product.name} 
          h={48} 
          w="full" 
          objectFit="cover" 
          borderRadius="md" 
        />
      </RouterLink>
      <Box pt={4}>
        <RouterLink to={`/product/${product.slug}`}>
          <Heading size="md" mb={2} noOfLines={1}>{product.name}</Heading>
        </RouterLink>
        <Text fontSize="sm" color="gray.500" mb={3} noOfLines={2}>
          {product.shortDescription || product.description}
        </Text>
        <Box d="flex" alignItems="baseline" mb={4}>
          <Text fontWeight="bold" fontSize="lg">
            ₹{product.discountPrice || product.price}
          </Text>
          {product.discountPrice && (
            <Text textDecoration="line-through" color="gray.400" fontSize="sm" ml={2}>
              ₹{product.price}
            </Text>
          )}
        </Box>
        <Button 
          w="full" 
          colorScheme="blue" 
          onClick={addToCartHandler} 
          isDisabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCard;
