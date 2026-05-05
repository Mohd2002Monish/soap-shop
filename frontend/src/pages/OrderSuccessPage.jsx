import { Box, Container, Text, Button, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";

const OrderSuccessPage = () => {
  const { id } = useParams();
  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center" bg="var(--cream)">
      <Container maxW="500px" textAlign="center">
        <Box
          bg="white"
          borderRadius="30px"
          p={10}
          border="1px solid rgba(232,180,184,0.2)"
          boxShadow="0 20px 60px rgba(232,180,184,0.2)"
        >
          <Text fontSize="6xl" mb={4} className="float">🎉</Text>
          <Text fontFamily="'Playfair Display', serif" fontSize="3xl" fontWeight="700" mb={2}>
            Order Placed!
          </Text>
          <Text color="gray.400" mb={6} fontSize="sm" lineHeight="1.8">
            Your soaps are being lovingly prepared. Expect them to arrive at your door soon! 🧼✨
          </Text>
          <Box bg="rgba(232,180,184,0.1)" borderRadius="12px" p={3} mb={6}>
            <Text fontSize="xs" color="gray.400">Order ID</Text>
            <Text fontFamily="monospace" fontWeight="700" fontSize="sm" color="var(--pink-dark)">{id}</Text>
          </Box>
          <VStack spacing={3}>
            <Button
              as={RouterLink}
              to={`/order/${id}`}
              w="full"
              borderRadius="full"
              style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
              _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 25px rgba(232,180,184,0.4)" }}
              transition="all 0.3s ease"
              fontWeight="600"
            >
              Track My Order
            </Button>
            <Button as={RouterLink} to="/" variant="ghost" borderRadius="full" color="gray.400" fontSize="sm">
              Continue Shopping →
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderSuccessPage;
