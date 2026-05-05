import { Box, Container, Text, Button, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const NotFoundPage = () => (
  <Box bg="var(--cream)" minH="80vh" display="flex" alignItems="center" justifyContent="center" position="relative" overflow="hidden">
    <Box className="blob-decoration" w="400px" h="400px" bg="rgba(232,180,184,0.1)" top="-100px" right="-80px" />
    <Box className="blob-decoration" w="300px" h="300px" bg="rgba(205,180,219,0.08)" bottom="-60px" left="-60px" style={{ animationDelay: "4s" }} />
    <Container maxW="500px" textAlign="center" position="relative" zIndex={1}>
      <Text fontFamily="'Playfair Display', serif" fontSize="8xl" fontWeight="900"
        style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        404
      </Text>
      <Text className="float" fontSize="5xl" mb={4}>🧼</Text>
      <Text fontFamily="'Playfair Display', serif" fontSize="2xl" fontWeight="700" mb={3}>
        Oops! Page not found
      </Text>
      <Text color="gray.400" fontSize="sm" mb={8} lineHeight="1.8">
        Looks like this page took a long bath and went down the drain. Let's get you back to the good stuff.
      </Text>
      <VStack spacing={3}>
        <Button as={RouterLink} to="/" w="full" size="lg" borderRadius="full"
          style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
          transition="all 0.3s ease" fontWeight="700">
          Go Home ✨
        </Button>
        <Button as={RouterLink} to="/shop" w="full" size="lg" variant="outline" borderRadius="full"
          borderColor="var(--pink)" color="var(--pink-dark)"
          _hover={{ bg: "rgba(232,180,184,0.1)", transform: "translateY(-2px)" }}
          transition="all 0.3s ease" fontWeight="600">
          Browse Soaps
        </Button>
      </VStack>
    </Container>
  </Box>
);

export default NotFoundPage;
