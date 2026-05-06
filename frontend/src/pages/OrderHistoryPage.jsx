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
    <Box bg="var(--cream)" minH="100vh" py={{ base: 5, md: 10 }}>
      <Container maxW="900px" px={{ base: 3, md: 6 }}>
        <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "xl", md: "3xl" }} fontWeight="700" mb={{ base: 5, md: 8 }}
          style={{ animation: "fadeUp 0.5s ease both" }}
        >My Orders 📦</Text>
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
        <VStack spacing={{ base: 3, md: 4 }} align="stretch">
          {orders.map((order, i) => (
            <Box
              key={order._id} bg="white"
              borderRadius={{ base: "16px", md: "20px" }}
              p={{ base: 4, md: 5 }}
              border="1px solid rgba(232,180,184,0.15)"
              _hover={{ borderColor: "rgba(232,180,184,0.4)", transform: "translateY(-3px)", boxShadow: "0 10px 28px rgba(232,180,184,0.18)" }}
              transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              style={{ animation: `fadeUp 0.45s ${i * 0.07}s ease both`, opacity: 0, animationFillMode: "forwards" }}
            >
              <Flex justify="space-between" align="flex-start" wrap={{ base: "wrap", sm: "nowrap" }} gap={3}>
                <Box minW={0}>
                  <Text fontWeight="700" fontFamily="'Playfair Display', serif" fontSize={{ base: "md", md: "lg" }} noOfLines={1}>{order.orderNumber}</Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""} · {order.shippingAddress?.city}
                  </Text>
                </Box>
                <Box textAlign={{ base: "left", sm: "right" }} flexShrink={0}>
                  <Text fontWeight="800" fontSize={{ base: "lg", md: "xl" }} style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    ₹{order.grandTotal}
                  </Text>
                  <Flex gap={2} mt={2} justify={{ base: "flex-start", sm: "flex-end" }} wrap="wrap">
                    <Badge colorScheme={statusColor(order.status)} borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="600" textTransform="capitalize">
                      {order.status}
                    </Badge>
                    <Badge colorScheme={order.paymentStatus === "received" ? "green" : "yellow"} borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="600">
                      {order.paymentStatus === "received" ? "Paid" : "COD"}
                    </Badge>
                  </Flex>
                  <Button as={RouterLink} to={`/order/${order._id}`} mt={2} size="sm" borderRadius="full"
                    variant="outline" borderColor="var(--pink)" color="var(--pink-dark)" fontSize="xs"
                    _hover={{ bg: "rgba(232,180,184,0.1)", transform: "translateY(-1px)" }}
                    _active={{ transform: "scale(0.97)" }}
                    minH="34px"
                  >
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
