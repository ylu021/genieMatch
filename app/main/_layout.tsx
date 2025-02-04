import React from "react";
import { Stack } from "expo-router";
import HeaderTitle from "@/components/HeaderRight";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          // headerTitle: (props) => <HeaderTitle {...props} />,
          title: "mainnn",
        }}
      />
    </Stack>
  );
};

export default Layout;
