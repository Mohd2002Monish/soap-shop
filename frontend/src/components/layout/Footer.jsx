import { Box, Text, Flex } from "@chakra-ui/react";

const Footer = () => (
  <Box bg="var(--brown)" color="white" py={10} px={8} mt={0}>
    <Flex maxW="1200px" mx="auto" direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={6}>
      <Box>
        <Text fontFamily="'Playfair Display', serif" fontSize="xl" fontWeight="700" mb={1}>Sterling Botanica 🌿</Text>
        <Text fontSize="sm" color="rgba(255,255,255,0.6)">Handcrafted botanical soaps for your best skin ever.</Text>
      </Box>
      <Flex gap={6} fontSize="sm" color="rgba(255,255,255,0.7)">
        <Text cursor="pointer" _hover={{ color: "var(--pink)" }}>Instagram</Text>
        <Text cursor="pointer" _hover={{ color: "var(--pink)" }}>Privacy Policy</Text>
        <Text cursor="pointer" _hover={{ color: "var(--pink)" }}>Contact Us</Text>
      </Flex>
      <Text fontSize="xs" color="rgba(255,255,255,0.4)">© 2024 Lather & Bloom. All rights reserved.</Text>
    </Flex>
  </Box>
);

export default Footer;
