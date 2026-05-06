import { useState } from "react";
import {
  Box, Container, Text, Button, VStack, FormControl, FormLabel,
  Input, Tabs, TabList, TabPanels, Tab, TabPanel, useToast,
  Flex, Avatar, Divider, Badge
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/auth.api.js";
import { setCredentials } from "../store/slices/authSlice.js";
import OrderHistoryPage from "./OrderHistoryPage.jsx";

const ProfilePage = () => {
  const { userInfo } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const toast = useToast();

  const [name, setName] = useState(userInfo?.name || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast({ title: "Profile updated! ✨", status: "success", duration: 2000, position: "top-right" });
      setPassword(""); setConfirmPassword("");
    },
    onError: (err) => {
      toast({ title: "Update failed", description: err.response?.data?.message, status: "error", duration: 3000 });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast({ title: "Passwords don't match 😬", status: "error", duration: 2000 }); return;
    }
    mutate({ name, phone, ...(password ? { password } : {}) });
  };

  const inputStyle = {
    borderRadius: "full",
    bg: "rgba(232,180,184,0.05)",
    border: "1.5px solid rgba(232,180,184,0.3)",
    _focus: { borderColor: "var(--pink)", bg: "white" }
  };

  return (
    <Box bg="var(--cream)" minH="100vh" py={{ base: 5, md: 10 }}>
      <Container maxW="1100px" px={{ base: 3, md: 6 }}>
        {/* Profile Header */}
        <Flex
          align="center" gap={3} mb={{ base: 5, md: 8 }}
          p={{ base: 4, md: 5 }} bg="white"
          borderRadius={{ base: "18px", md: "24px" }}
          border="1px solid rgba(232,180,184,0.2)" shadow="sm" wrap="wrap"
          style={{ animation: "fadeUp 0.5s ease both" }}
        >
          <Avatar
            size={{ base: "lg", md: "xl" }} name={userInfo?.name}
            style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)" }}
            color="white"
            flexShrink={0}
          />
          <Box minW={0}>
            <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" noOfLines={1}>{userInfo?.name}</Text>
            <Text color="gray.400" fontSize="sm" noOfLines={1}>{userInfo?.email}</Text>
            <Badge mt={2} bg="rgba(232,180,184,0.15)" color="var(--pink-dark)" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="600">
              {userInfo?.role === "admin" ? "👑 Admin" : "🌿 Customer"}
            </Badge>
          </Box>
        </Flex>

        <Tabs variant="unstyled" colorScheme="pink">
          <TabList
            mb={{ base: 4, md: 6 }}
            bg="white" borderRadius="16px" p={2}
            border="1px solid rgba(232,180,184,0.15)" gap={2}
            style={{ animation: "fadeUp 0.5s 0.1s ease both", opacity: 0, animationFillMode: "forwards" }}
          >
            {["My Profile", "Order History"].map(label => (
              <Tab
                key={label}
                flex={1}
                borderRadius="12px"
                fontWeight="600"
                fontSize="sm"
                color="gray.400"
                py={3}
                _selected={{
                  color: "white",
                  bg: "linear-gradient(135deg,#E8B4B8,#CDB4DB)",
                  boxShadow: "0 4px 15px rgba(232,180,184,0.35)"
                }}
                transition="all 0.3s ease"
              >
                {label}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {/* Profile Tab */}
            <TabPanel p={0}>
              <Box
                maxW={{ base: "full", md: "500px" }} bg="white"
                borderRadius={{ base: "18px", md: "24px" }}
                p={{ base: 4, md: 8 }}
                border="1px solid rgba(232,180,184,0.2)" shadow="sm"
                style={{ animation: "scaleIn 0.4s ease both" }}
              >
                <Text fontFamily="'Playfair Display', serif" fontSize="xl" fontWeight="700" mb={6}>Update Your Details</Text>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">Full Name</FormLabel>
                      <Input value={name} onChange={e => setName(e.target.value)} {...inputStyle} placeholder="Your name" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">Email</FormLabel>
                      <Input value={userInfo?.email} isDisabled borderRadius="full" bg="rgba(0,0,0,0.03)" border="1.5px solid rgba(0,0,0,0.1)" color="gray.400" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">Phone</FormLabel>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} {...inputStyle} placeholder="+91 XXXXX XXXXX" />
                    </FormControl>
                    <Divider borderColor="rgba(232,180,184,0.2)" />
                    <Text fontSize="xs" color="gray.400" alignSelf="flex-start" fontWeight="600">CHANGE PASSWORD (optional)</Text>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">New Password</FormLabel>
                      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} {...inputStyle} placeholder="Leave blank to keep current" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600">Confirm New Password</FormLabel>
                      <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} {...inputStyle} placeholder="••••••••" />
                    </FormControl>
                    <Button
                      type="submit" w="full" size="lg" borderRadius="full" mt={2}
                      style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
                      _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
                      transition="all 0.3s ease" fontWeight="700" isLoading={isPending}
                    >
                      Save Changes ✨
                    </Button>
                  </VStack>
                </form>
              </Box>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel p={0}>
              <OrderHistoryPage embedded />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default ProfilePage;
