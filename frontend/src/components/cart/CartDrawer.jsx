import {
  Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay,
  DrawerContent, DrawerCloseButton, Button, Box, Flex, Image, Text,
  IconButton, Divider
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQty, clearCart } from "../../store/slices/cartSlice.js";

const CartDrawer = ({ isOpen, onClose }) => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Your Shopping Cart</DrawerHeader>

        <DrawerBody>
          {items.length === 0 ? (
            <Text textAlign="center" mt={10} color="gray.500">Your cart is empty.</Text>
          ) : (
            <Box>
              {items.map((item) => (
                <Flex key={item._id} align="center" justify="space-between" mb={4}>
                  <Flex align="center" gap={4}>
                    <Image src={item.image} alt={item.name} boxSize="60px" objectFit="cover" borderRadius="md" />
                    <Box>
                      <Text fontWeight="bold" noOfLines={1}>{item.name}</Text>
                      <Text color="gray.600">₹{item.price}</Text>
                      <Flex align="center" mt={2} gap={2}>
                        <Button 
                          size="xs" 
                          onClick={() => dispatch(updateQty({ id: item._id, quantity: Math.max(1, item.quantity - 1) }))}
                        >-</Button>
                        <Text fontSize="sm">{item.quantity}</Text>
                        <Button 
                          size="xs" 
                          onClick={() => dispatch(updateQty({ id: item._id, quantity: Math.min(item.stock, item.quantity + 1) }))}
                        >+</Button>
                      </Flex>
                    </Box>
                  </Flex>
                  <Button size="sm" colorScheme="red" variant="ghost" onClick={() => dispatch(removeItem(item._id))}>
                    Remove
                  </Button>
                </Flex>
              ))}
            </Box>
          )}
        </DrawerBody>

        <DrawerFooter flexDir="column" gap={4}>
          <Flex justify="space-between" w="full" fontWeight="bold" fontSize="lg">
            <Text>Subtotal:</Text>
            <Text>₹{total}</Text>
          </Flex>
          <Divider />
          <Flex gap={4} w="full">
            <Button variant="outline" w="full" onClick={onClose}>
              Continue Shopping
            </Button>
            <Button 
              colorScheme="blue" 
              w="full" 
              as={RouterLink} 
              to="/checkout" 
              onClick={onClose}
              isDisabled={items.length === 0}
            >
              Checkout
            </Button>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
