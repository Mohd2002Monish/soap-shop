import { Box, Container, Text, Button, Spinner, Center, Flex, Badge, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useMyOrders } from "../hooks/useOrders.js";

const statusColor = (status) => {
  const map = { pending: "yellow", confirmed: "blue", processing: "purple", shipped: "cyan", delivered: "green", cancelled: "red" };
  return map[status] || "gray";
};

const OrderHistoryPage = ({ embedded = false }) => {
  const { data: orders, isLoading, error } = useMyOrders();

  if (isLoading) return <Center py={16}><Spinner size="xl" color="var(--pink)" thickness="3px" /></Center>;
  if (error) return <Center py={10}><Text color="red.300">Couldn't load orders. Try again later.</Text></Center>;

  const Wrapper = embedded ? Box : ({ children }) => (
    <Box bg="var(--cream)" minH="100vh" py={10}>
      <Container maxW="900px">
        <Text fontFamily="'Playfair Display', serif" fontSize="3xl" fontWeight="700" mb={8}>My Orders 📦</Text>
        {children}
      </Container>
    </Box>
  );

  return (
    <Wrapper>
      {!orders || orders.length === 0 ? (
        <Box bg="white" borderRadius="24px" p={12} textAlign="center" border="1px solid rgba(232,180,184,0.2)">
          <Text fontSize="5xl" mb={4}>📦</Text>
          <Text fontFamily="'Playfair Display', serif" fontSize="xl" mb={2}>No orders yet</Text>
          <Text color="gray.400" fontSize="sm" mb={6}>You haven't placed any orders. Let's change that!</Text>
          <Button as={RouterLink} to="/" borderRadius="full" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
            _hover={{ transform: "translateY(-1px)", boxShadow: "0 8px 25px rgba(232,180,184,0.4)" }} transition="all 0.3s ease" fontWeight="600">
            Start Shopping ✨
          </Button>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {orders.map((order) => (
            <Box key={order._id} bg="white" borderRadius="20px" p={5} border="1px solid rgba(232,180,184,0.15)"
              _hover={{ borderColor: "rgba(232,180,184,0.4)", transform: "translateY(-2px)", boxShadow: "0 8px 25px rgba(232,180,184,0.15)" }}
              transition="all 0.3s ease">
              <Flex justify="space-between" align="flex-start" wrap={{ base: "wrap", sm: "nowrap" }} gap={4}>
                <Box>
                  <Text fontWeight="700" fontFamily="'Playfair Display', serif" fontSize="lg">{order.orderNumber}</Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""} · {order.shippingAddress?.city}
                  </Text>
                </Box>
                <Box textAlign={{ base: "left", sm: "right" }}>
                  <Text fontWeight="800" fontSize="xl" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    ₹{order.grandTotal}
                  </Text>
                  <Flex gap={2} mt={2} justify={{ base: "flex-start", sm: "flex-end" }} wrap="wrap">
                    <Badge colorScheme={statusColor(order.status)} borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="600" textTransform="capitalize">
                      {order.status}
                    </Badge>
                    <Badge colorScheme={order.paymentStatus === "received" ? "green" : "yellow"} borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="600">
                      {order.paymentStatus === "received" ? "Paid" : "COD Pending"}
                    </Badge>
                  </Flex>
                  <Button as={RouterLink} to={`/order/${order._id}`} mt={3} size="sm" borderRadius="full"
                    variant="outline" borderColor="var(--pink)" color="var(--pink-dark)" fontSize="xs"
                    _hover={{ bg: "rgba(232,180,184,0.1)" }}>
                    View Details →
                  </Button>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Wrapper>
  );
};

export default OrderHistoryPage;
