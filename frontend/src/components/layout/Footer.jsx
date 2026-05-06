import { Box, Text, Flex, VStack, HStack, Divider } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => (
  <Box
    bg="var(--brown)"
    color="white"
    pt={{ base: 10, md: 14 }}
    pb={{ base: 6, md: 10 }}
    px={{ base: 4, md: 8 }}
    position="relative"
    overflow="hidden"
  >
    {/* Decorative blobs */}
    <Box
      position="absolute" top="-40px" right="-60px"
      w="200px" h="200px" borderRadius="50%"
      bg="rgba(232,180,184,0.05)" pointerEvents="none"
    />
    <Box
      position="absolute" bottom="-30px" left="-40px"
      w="160px" h="160px" borderRadius="50%"
      bg="rgba(205,180,219,0.05)" pointerEvents="none"
    />

    <Box maxW="1200px" mx="auto" position="relative" zIndex={1}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "center", md: "flex-start" }}
        gap={{ base: 8, md: 6 }}
        textAlign={{ base: "center", md: "left" }}
      >
        {/* Brand */}
        <VStack align={{ base: "center", md: "flex-start" }} spacing={2} maxW={{ md: "260px" }}>
          <Flex align="center" gap={2} justify={{ base: "center", md: "flex-start" }}>
            <Box
              w={8} h={8} borderRadius="full"
              style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)" }}
              display="flex" alignItems="center" justifyContent="center"
              fontSize="lg"
            >
              🌿
            </Box>
            <Text
              fontFamily="'Playfair Display', serif"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="700"
            >
              Sterling Botanica
            </Text>
          </Flex>
          <Text fontSize="xs" color="rgba(255,255,255,0.45)" lineHeight="1.7">
            Handcrafted botanical soaps for your best skin ever. Small batches, big results.
          </Text>
        </VStack>

        {/* Links */}
        <Flex
          gap={{ base: 5, md: 8 }}
          fontSize="sm"
          color="rgba(255,255,255,0.6)"
          flexWrap="wrap"
          justify="center"
        >
          {[
            { label: "Shop", to: "/shop" },
            { label: "Instagram", href: "#" },
            { label: "Privacy Policy", href: "#" },
            { label: "Contact Us", href: "#" },
          ].map(link => (
            <Text
              key={link.label}
              as={link.to ? RouterLink : "a"}
              to={link.to}
              href={link.href}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ color: "var(--pink)", transform: "translateY(-1px)" }}
              style={{ textDecoration: "none" }}
            >
              {link.label}
            </Text>
          ))}
        </Flex>

        {/* Trust badges */}
        <HStack spacing={3} flexWrap="wrap" justify="center">
          {["🌿 Natural", "🐰 Cruelty Free", "✨ Handmade"].map(badge => (
            <Text
              key={badge}
              fontSize="10px"
              px={3} py={1}
              borderRadius="full"
              bg="rgba(255,255,255,0.06)"
              border="1px solid rgba(255,255,255,0.1)"
              color="rgba(255,255,255,0.55)"
              fontWeight="600"
              letterSpacing="0.05em"
            >
              {badge}
            </Text>
          ))}
        </HStack>
      </Flex>

      <Divider borderColor="rgba(255,255,255,0.07)" my={{ base: 6, md: 8 }} />

      <Text
        fontSize="xs"
        color="rgba(255,255,255,0.3)"
        textAlign="center"
        letterSpacing="0.05em"
      >
        © {new Date().getFullYear()} Sterling Botanica. All rights reserved.
      </Text>
    </Box>
  </Box>
);

export default Footer;
